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

window.onload = function () {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({type: 'ready', message: {type: 'ready'}}),
  );
};

// getAccountSigningKey
// getAccountPublicKey
// getCredentialId
// getPrfKey
// getIdCredSec
// getSignatureBlindingRandomness
// getAttributeCommitmentRandomness

enum CCDCryptoMethods {
  getAccountSigningKey = 'getAccountSigningKey',
  getAccountPublicKey = 'getAccountPublicKey',
  getPrfKey = 'getPrfKey',
  getIdCredSec = 'getIdCredSec',
  getSignatureBlindingRandomness = 'getSignatureBlindingRandomness',
  getAttributeCommitmentRandomness = 'getAttributeCommitmentRandomness',
}

__wbg_set_wasm(wasm);

// const method = () => {
//   try {
//     const seedAsHex = Buffer.from(
//       mnemonicToSeedSync(
//         'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
//       ),
//     ).toString('hex');

//     const keys = {
//       idCredSec: getIdCredSec(seedAsHex, 'Testnet', 0, 0).toString('hex'),
//       prfKey: getPrfKey(seedAsHex, 'Testnet', 0, 0).toString('hex'),
//       blindingRandomness: getSignatureBlindingRandomness(
//         seedAsHex,
//         'Testnet',
//         0,
//         0,
//       ).toString('hex'),
//     };

//     const pubKey = getAccountPublicKey(seedAsHex, 'Testnet', 0, 0, 0).toString(
//       'hex',
//     );

//     const signingKey = getAccountSigningKey(
//       seedAsHex,
//       'Testnet',
//       0,
//       0,
//       0,
//     ).toString('hex');

//     const attributeRandomness = getAttributeCommitmentRandomness(
//       seedAsHex,
//       'Testnet',
//       0,
//       0,
//       0,
//       0,
//     );

//     window.ReactNativeWebView?.postMessage(
//       JSON.stringify({
//         type: 'success',
//         message: 'Method executed successfully',
//         wasmSupport: !!window.WebAssembly,
//         pubKey: pubKey,
//         keys: keys,
//         signingKey: signingKey,
//         attributeRandomness: attributeRandomness,
//       }),
//     );
//   } catch (error) {
//     alert(error);

//     window.ReactNativeWebView?.postMessage(
//       JSON.stringify({type: 'error', message: error}),
//     );
//   }
// };

const postMessage = (message: {result: any; type: CCDCryptoMethods}) => {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({
      type: 'success',
      message: message,
    }),
  );
};

const GetAccountPublicKey = ({seedAsHex}: {seedAsHex: string}) => {
  try {
    const pubKey = getAccountPublicKey(seedAsHex, 'Testnet', 0, 0, 0).toString(
      'hex',
    );
    postMessage({
      result: pubKey,
      type: CCDCryptoMethods.getAccountPublicKey,
    });
  } catch (error) {
    alert(error);
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({type: 'error', message: error}),
    );
  }
};

const GetIdCredSec = ({seedAsHex}: {seedAsHex: string}) => {
  try {
    const idCredSec = getIdCredSec(seedAsHex, 'Testnet', 0, 0).toString('hex');

    postMessage({
      result: idCredSec,
      type: CCDCryptoMethods.getIdCredSec,
    });
  } catch (error) {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({type: 'error', message: error}),
    );
  }
};

const GetPrfKey = ({ seedAsHex }: { seedAsHex: string }) => {
  try {
    const privKey = getPrfKey(seedAsHex, 'Testnet', 0, 0).toString('hex');

    postMessage({
      result: privKey,
      type: CCDCryptoMethods.getPrfKey,
    });
  } catch (error) {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'error', message: error }),
    );
  }
};
const GetSignatureBlindingRandomness = ({ seedAsHex }: { seedAsHex: string }) => {
  try {
    const randomSignature = getSignatureBlindingRandomness(seedAsHex, 'Testnet', '', 0, 0).toString('hex');

    postMessage({
      result: randomSignature,
      type: CCDCryptoMethods.getSignatureBlindingRandomness,
    });
  } catch (error) {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'error', message: error }),
    );
  }
};

const GetAttributeCommitmentRandomness = ({ seedAsHex }: { seedAsHex: string }) => {
  try {
    const randomSignature = getAttributeCommitmentRandomness(seedAsHex, 'Testnet', 0, 0, 0, 0).toString('hex');

    postMessage({
      result: randomSignature,
      type: CCDCryptoMethods.getAttributeCommitmentRandomness,
    });
  } catch (error) {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: 'error', message: error }),
    );
  }
};

document.addEventListener('message', async function (event: any) {
  let data = event.data;
  if (data) {
    data = JSON.parse(data);
  }

  switch (data.method) {
    case CCDCryptoMethods.getAccountPublicKey: {
      GetAccountPublicKey(data.params);
      break;
    }
    case CCDCryptoMethods.getIdCredSec: {
      GetIdCredSec(data.params);
      break;
    }
    case CCDCryptoMethods.getPrfKey: {
      GetPrfKey(data.params)
    }
    case CCDCryptoMethods.getSignatureBlindingRandomness: {
      GetSignatureBlindingRandomness(data.params)
    }
    case CCDCryptoMethods.getAttributeCommitmentRandomness: {
      GetAttributeCommitmentRandomness(data.params)
    }

    default: {
    }
  }
  // method();
  // Reply back
});
