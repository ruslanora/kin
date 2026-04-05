import fs from 'node:fs';
import path from 'node:path';

import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { VitePlugin } from '@electron-forge/plugin-vite';
import type { ForgeConfig } from '@electron-forge/shared-types';

const rootNodeModules = path.resolve(__dirname, '../../node_modules');

const config: ForgeConfig = {
  packagerConfig: {
    asar: {
      unpack: '**/node_modules/better-sqlite3/**',
    },
    extraResource: ['src/main/database/migrations'],
    icon: 'assets/icons/icon',
  },
  rebuildConfig: {},
  hooks: {
    packageAfterCopy: async (_config, buildPath) => {
      for (const pkg of ['better-sqlite3', 'bindings', 'file-uri-to-path']) {
        const src = path.join(rootNodeModules, pkg);
        const dest = path.join(buildPath, 'node_modules', pkg);
        if (fs.existsSync(src) && !fs.existsSync(dest)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      }
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      config: {
        platforms: ['darwin'],
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new VitePlugin({
      build: [
        {
          entry: 'src/main/index.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/index.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
