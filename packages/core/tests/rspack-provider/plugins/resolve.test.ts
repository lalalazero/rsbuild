import type { SpyInstance } from 'vitest';
import { isFileExists } from '@rsbuild/shared';
import { pluginResolve } from '@/plugins/resolve';
import { createStubRsbuild } from '@rsbuild/test-helper';
import { rspackProvider } from '@/index';

// vitest doesn't support mock require(), to avoid load @rsbuild/shared by require, we should pass rspackProvider as param
vi.mock('@rsbuild/shared', async (importOriginal) => {
  const mod = await importOriginal<any>();
  return {
    ...mod,
    isFileExists: vi.fn(),
  };
});

describe('plugin-resolve', () => {
  it('should apply default extensions correctly', async () => {
    (isFileExists as unknown as SpyInstance).mockImplementationOnce(() =>
      Promise.resolve(false),
    );
    const rsbuild = await createStubRsbuild({
      plugins: [pluginResolve()],
      provider: rspackProvider,
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0].resolve?.extensions).toEqual([
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.mjs',
      '.json',
    ]);
    expect(bundlerConfigs[0].resolve?.tsConfigPath).toBeUndefined();
  });

  it('should apply default extensions correctly and tsConfigPath with ts', async () => {
    (isFileExists as unknown as SpyInstance).mockImplementationOnce(() =>
      Promise.resolve(true),
    );

    const rsbuild = await createStubRsbuild({
      plugins: [pluginResolve()],
      provider: rspackProvider,
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0].resolve?.extensions).toEqual([
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.mjs',
      '.json',
    ]);
    expect(bundlerConfigs[0].resolve?.tsConfigPath).toBeDefined();
  });

  it('should not apply tsConfigPath when aliasStrategy is "prefer-alias"', async () => {
    (isFileExists as unknown as SpyInstance).mockImplementationOnce(() =>
      Promise.resolve(true),
    );

    const rsbuild = await createStubRsbuild({
      plugins: [pluginResolve()],
      provider: rspackProvider,
      rsbuildConfig: {
        source: {
          aliasStrategy: 'prefer-alias',
        },
      },
    });

    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0].resolve?.tsConfigPath).toBeUndefined();
  });

  it('should allow to use source.alias to config alias', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginResolve()],
      provider: rspackProvider,
      rsbuildConfig: {
        source: {
          alias: {
            foo: 'bar',
          },
        },
      },
    });
    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0].resolve?.alias).toEqual({
      foo: 'bar',
    });
  });

  it('should support source.alias to be a function', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginResolve()],
      provider: rspackProvider,
      rsbuildConfig: {
        source: {
          alias() {
            return {
              foo: 'bar',
            };
          },
        },
      },
    });
    const bundlerConfigs = await rsbuild.initConfigs();

    expect(bundlerConfigs[0].resolve?.alias).toEqual({
      foo: 'bar',
    });
  });
});
