import { pluginEntry } from '@src/plugins/entry';
import { pluginHtml } from '@src/plugins/html';
import { pluginInlineChunk } from '@src/plugins/inlineChunk';
import { createStubRsbuild } from '@rsbuild/test-helper';

describe('plugin-inline-chunk', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production';
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should use proper plugin options when inlineScripts is true', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginEntry(), pluginHtml(), pluginInlineChunk()],
      rsbuildConfig: {
        output: {
          inlineScripts: true,
        },
      },
    });
    const config = await rsbuild.unwrapConfig();

    expect(config).toMatchSnapshot();
  });

  it('should use proper plugin options when inlineStyles is true', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginEntry(), pluginHtml(), pluginInlineChunk()],
      rsbuildConfig: {
        output: {
          inlineStyles: true,
        },
      },
    });
    const config = await rsbuild.unwrapConfig();

    expect(config).toMatchSnapshot();
  });

  it('should not apply InlineChunkHtmlPlugin when target is node', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginEntry(), pluginHtml(), pluginInlineChunk()],
      target: 'node',
    });

    expect(
      await rsbuild.matchBundlerPlugin('InlineChunkHtmlPlugin'),
    ).toBeFalsy();
  });

  it('should not apply InlineChunkHtmlPlugin when target is web-worker', async () => {
    const rsbuild = await createStubRsbuild({
      plugins: [pluginEntry(), pluginHtml(), pluginInlineChunk()],
      target: 'web-worker',
    });

    expect(
      await rsbuild.matchBundlerPlugin('InlineChunkHtmlPlugin'),
    ).toBeFalsy();
  });

  it('should not apply InlineChunkHtmlPlugin in development mode', async () => {
    process.env.NODE_ENV = 'development';
    const rsbuild = await createStubRsbuild({
      plugins: [pluginEntry(), pluginHtml(), pluginInlineChunk()],
    });

    expect(
      await rsbuild.matchBundlerPlugin('InlineChunkHtmlPlugin'),
    ).toBeFalsy();
  });
});
