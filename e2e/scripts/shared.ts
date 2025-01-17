import { URL } from 'url';
import assert from 'assert';
import { join } from 'path';
import { fse } from '@rsbuild/shared';
import { globContentJSON } from '@scripts/helper';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';
import type {
  RsbuildConfig,
  RsbuildPlugin,
  CreateRsbuildOptions,
} from '@rsbuild/core';

// TODO should not depend on uni-builder plugins
import { pluginBabel } from '../../packages/compat/uni-builder/src/webpack/plugins/babel';
import { pluginReact } from '../../packages/compat/uni-builder/src/webpack/plugins/react';

export const getHrefByEntryName = (entryName: string, port: number) => {
  const baseUrl = new URL(`http://localhost:${port}`);
  const htmlRoot = new URL('/', baseUrl);
  const homeUrl = new URL(`${entryName}.html`, htmlRoot);

  return homeUrl.href;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = async () => {};

export const createRsbuild = async (
  rsbuildOptions: CreateRsbuildOptions,
  rsbuildConfig: RsbuildConfig = {},
  plugins: RsbuildPlugin[] = [],
) => {
  const { createRsbuild } = await import('@rsbuild/core');

  if (process.env.PROVIDE_TYPE === 'rspack') {
    const rsbuild = await createRsbuild({
      ...rsbuildOptions,
      rsbuildConfig,
    });

    if (plugins) {
      rsbuild.addPlugins(plugins);
    }

    return rsbuild;
  }

  const { webpackProvider } = await import('@rsbuild/webpack');
  const rsbuild = await createRsbuild({
    ...rsbuildOptions,
    rsbuildConfig,
    provider: webpackProvider,
  });

  if (plugins) {
    rsbuild.addPlugins(plugins);
  }

  const babel = pluginBabel();
  if (!rsbuild.isPluginExists(babel.name)) {
    // @rsbuild/webpack has no built-in transformer
    rsbuild.addPlugins([babel]);
  }

  const react = pluginReact();
  if (!rsbuild.isPluginExists(react.name)) {
    // @rsbuild/webpack has no built-in transformer
    rsbuild.addPlugins([react]);
  }

  const cssMinimizer = pluginCssMinimizer();
  if (!rsbuild.isPluginExists(cssMinimizer.name)) {
    // @rsbuild/webpack has no built-in CSS minimizer
    rsbuild.addPlugins([cssMinimizer]);
  }

  return rsbuild;
};

const portMap = new Map();

export function getRandomPort(
  defaultPort = Math.ceil(Math.random() * 10000) + 10000,
) {
  let port = defaultPort;
  while (true) {
    if (!portMap.get(port)) {
      portMap.set(port, 1);
      return port;
    } else {
      port++;
    }
  }
}

const updateConfigForTest = (config: RsbuildConfig) => {
  // make devPort random to avoid port conflict
  config.server = {
    ...(config.server || {}),
    port: getRandomPort(config.server?.port),
  };

  config.dev ??= {};

  config.dev!.progressBar = config.dev!.progressBar || false;

  if (!config.performance?.buildCache) {
    config.performance = {
      ...(config.performance || {}),
      buildCache: false,
    };
  }

  if (config.performance?.printFileSize === undefined) {
    config.performance = {
      ...(config.performance || {}),
      printFileSize: false,
    };
  }

  // disable polyfill to make the tests faster
  if (config.output?.polyfill === undefined) {
    config.output = {
      ...(config.output || {}),
      polyfill: 'off',
    };
  }
};

export async function dev({
  plugins,
  rsbuildConfig = {},
  ...options
}: CreateRsbuildOptions & {
  plugins?: RsbuildPlugin[];
  rsbuildConfig?: RsbuildConfig;
}) {
  process.env.NODE_ENV = 'development';

  updateConfigForTest(rsbuildConfig);

  const rsbuild = await createRsbuild(options, rsbuildConfig, plugins);

  return rsbuild.startDevServer({
    printURLs: false,
  });
}

export async function build({
  plugins,
  runServer = false,
  rsbuildConfig = {},
  ...options
}: CreateRsbuildOptions & {
  plugins?: RsbuildPlugin[];
  runServer?: boolean;
  rsbuildConfig?: RsbuildConfig;
}) {
  process.env.NODE_ENV = 'production';

  updateConfigForTest(rsbuildConfig);

  const rsbuild = await createRsbuild(options, rsbuildConfig, plugins);

  await rsbuild.build();

  const { distPath } = rsbuild.context;

  const {
    port,
    server: { close },
  } = runServer
    ? await rsbuild.preview({
        printURLs: false,
      })
    : { port: 0, server: { close: noop } };

  const clean = async () => await fse.remove(distPath);

  const unwrapOutputJSON = async (ignoreMap = true) => {
    return globContentJSON(distPath, {
      absolute: true,
      ignore: ignoreMap ? [join(distPath, '/**/*.map')] : [],
    });
  };

  const getIndexFile = async () => {
    const files = await unwrapOutputJSON();
    const [name, content] =
      Object.entries(files).find(
        ([file]) => file.includes('index') && file.endsWith('.js'),
      ) || [];

    assert(name);

    return {
      content: content!,
      size: content!.length / 1024,
    };
  };

  return {
    distPath,
    port,
    clean,
    close,
    unwrapOutputJSON,
    getIndexFile,
    providerType: process.env.PROVIDE_TYPE || 'rspack',
    instance: rsbuild,
  };
}
