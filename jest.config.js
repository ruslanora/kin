import { globSync } from 'node:fs';
import path from 'path';

const __dirname = import.meta.dirname;

const configFiles = globSync('{apps,libs}/*/jest.config.{js,ts}', {
  cwd: __dirname,
});

const projects = configFiles.map((f) => ({
  rootDir: path.dirname(path.resolve(__dirname, f)),
}));

/** @type {import("jest").Config} */
export default projects.length > 0
  ? { projects, collectCoverage: false }
  : {
      preset: './jest.preset.js',
      testMatch: ['<rootDir>/src/**/*.{spec,test}.{ts,tsx}'],
    };
