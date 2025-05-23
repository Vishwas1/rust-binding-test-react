import {mnemonicToSeedSync, validateMnemonic} from '@scure/bip39';
import * as wasm from './wasm/index_bg.wasm.js';

import {
  __wbg_set_wasm,
  getAccountPublicKey,
  getIdCredSec,
  getPrfKey,
  getSignatureBlindingRandomness,
  getAccountSigningKey,
  getAttributeCommitmentRandomness,
} from './wasm/index_bg.js';
import {Buffer} from 'buffer';

window.onload = function () {
  window.ReactNativeWebView?.postMessage(JSON.stringify({type: 'ready'}));
};

__wbg_set_wasm(wasm);

const method = () => {
  try {
    const seedAsHex = Buffer.from(
      mnemonicToSeedSync(
        'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      ),
    ).toString('hex');

    const keys = {
      idCredSec: getIdCredSec(seedAsHex, 'Testnet', 0, 0).toString('hex'),
      prfKey: getPrfKey(seedAsHex, 'Testnet', 0, 0).toString('hex'),
      blindingRandomness: getSignatureBlindingRandomness(
        seedAsHex,
        'Testnet',
        0,
        0,
      ).toString('hex'),
    };

    const pubKey = getAccountPublicKey(seedAsHex, 'Testnet', 0, 0, 0).toString(
      'hex',
    );

    const signingKey = getAccountSigningKey(
      seedAsHex,
      'Testnet',
      0,
      0,
      0,
    ).toString('hex');

    const attributeRandomness = getAttributeCommitmentRandomness(
      seedAsHex,
      'Testnet',
      0,
      0,
      0,
      0,
    );

    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: 'success',
        message: 'Method executed successfully',
        wasmSupport: !!window.WebAssembly,
        pubKey: pubKey,
        keys: keys,
        signingKey: signingKey,
        attributeRandomness: attributeRandomness,
      }),
    );
  } catch (error) {
    alert(error);

    window.ReactNativeWebView?.postMessage(
      JSON.stringify({type: 'error', message: error}),
    );
  }
};

document.addEventListener('message', async function (event: any) {
  const data = event.data;

  method();

  // Reply back
});
