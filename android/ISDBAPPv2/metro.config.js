const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, '../../shared');

/**
 * Metro configuration for monorepo with @isdb/shared
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [sharedRoot],

  resolver: {
    // Ensure Metro can resolve @isdb/shared and its dependencies
    extraNodeModules: {
      '@isdb/shared': sharedRoot,
    },
    // Make sure Metro looks in shared/node_modules for transitive deps
    nodeModulesPaths: [
      path.resolve(sharedRoot, 'node_modules'),
    ],
  },

  // Reset cache on first run to avoid stale resolution
  resetCache: process.env.RESET_CACHE === '1',
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
