import { join } from 'path';
import { expect } from '@playwright/test';
import { dev, getHrefByEntryName } from '@scripts/shared';
import { rspackOnlyTest } from '@scripts/helper';
import { pluginSourceBuild } from '@rsbuild/plugin-source-build';
import { pluginReact } from '@rsbuild/plugin-react';

const fixture = join(__dirname, 'app');

rspackOnlyTest(
  'should build succeed with source build plugin',
  async ({ page }) => {
    const rsbuild = await dev({
      cwd: fixture,
      plugins: [pluginSourceBuild(), pluginReact()],
    });

    await page.goto(getHrefByEntryName('index', rsbuild.port));

    const locator = page.locator('#root');
    await expect(locator).toHaveText(
      'Card Comp Title: AppCARD COMP CONTENT:hello world',
    );

    await rsbuild.server.close();
  },
);
