const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
    extraNodeModules: {
      '@concordium/rust-bindings': path.resolve(
        __dirname,
        'node_modules/@concordium/rust-bindings/bundler',
      ),
      '@concordium/web-sdk': path.resolve(
        __dirname,
        'node_modules/@concordium/web-sdk',
      ),
      buffer: path.resolve(__dirname, 'node_modules/buffer'),
      ...require('node-libs-react-native'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('readable-stream'),
    },
    resolverMainFields: ['browser', 'module', 'main'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'wasm'],
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'wasm', 'webp'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
