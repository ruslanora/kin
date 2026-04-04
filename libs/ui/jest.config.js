import preset from '../../jest.preset.js';

/** @type {import("jest").Config} */
export default {
  ...preset,
  testEnvironment: 'jsdom',
};
