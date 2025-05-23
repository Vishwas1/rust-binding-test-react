const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['web/index.tsx'],
  bundle: true,
  outfile: 'android/app/src/main/assets/webview.js',
  target: ['es2020'],
  platform: 'browser',
  loader: {
    
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.wasm': 'base64', // Load wasm as Uint8Array (recommended)
  },
  define: {
    global: 'window',
  },
}).catch(() => process.exit(1));
