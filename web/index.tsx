import * as wasm from './wasm/index_bg.wasm.js';

import {
  __wbg_set_wasm,
  getIdCredSec,
  getPrfKey,
  getAccountPublicKey,
  getSignatureBlindingRandomness,
  getAttributeCommitmentRandomness,
} from './wasm/index_bg.js';

enum CCDCryptoMethods {
  GetAccountSigningKey = 'getAccountSigningKey',
  GetAccountPublicKey = 'getAccountPublicKey',
  GetPrfKey = 'getPrfKey',
  GetIdCredSec = 'getIdCredSec',
  GetSignatureBlindingRandomness = 'getSignatureBlindingRandomness',
  GetAttributeCommitmentRandomness = 'getAttributeCommitmentRandomness',
}

__wbg_set_wasm(wasm);

enum MessageType {
  SUCCESS = 'success',
  ERROR = 'error',
}

const postMessage = (
  message: {result: any; method?: CCDCryptoMethods},
  type: MessageType = MessageType.SUCCESS,
) => {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({
      message: message,
      type,
    }),
  );
};

const GetAccountPublicKey = ({
  seedAsHex,
}: {
  seedAsHex: string;
  network: string;
}) => {
  try {
    const pubKey = getAccountPublicKey(seedAsHex, 'Testnet', 0, 0, 0).toString(
      'hex',
    );
    postMessage({
      result: pubKey,
      method: CCDCryptoMethods.GetAccountPublicKey,
    });
  } catch (error) {
    postMessage(
      {
        result: error,
      },
      MessageType.ERROR,
    );
  }
};

const GetIdCredSec = ({seedAsHex}: {seedAsHex: string}) => {
  try {
    const idCredSec = getIdCredSec(seedAsHex, 'Testnet', 0, 0).toString('hex');

    postMessage(
      {
        result: idCredSec,
        method: CCDCryptoMethods.GetIdCredSec,
      },
      MessageType.SUCCESS,
    );
  } catch (error) {
    postMessage(
      {
        result: error,
      },
      MessageType.ERROR,
    );
  }
};

const GetPrfKey = ({seedAsHex}: {seedAsHex: string}) => {
  try {
    const privKey = getPrfKey(seedAsHex, 'Testnet', 0, 0).toString('hex');

    postMessage({
      result: privKey,
      method: CCDCryptoMethods.GetPrfKey,
    });
  } catch (error) {
    postMessage(
      {
        result: error,
      },
      MessageType.ERROR,
    );
  }
};

const GetSignatureBlindingRandomness = ({seedAsHex}: {seedAsHex: string}) => {
  try {
    const randomSignature = getSignatureBlindingRandomness(
      seedAsHex,
      'Testnet',
      0,
      0,
    ).toString('hex');

    postMessage({
      result: randomSignature,
      method: CCDCryptoMethods.GetSignatureBlindingRandomness,
    });
  } catch (error) {
    postMessage(
      {
        result: error,
      },
      MessageType.ERROR,
    );
  }
};

const GetAttributeCommitmentRandomness = ({seedAsHex}: {seedAsHex: string}) => {
  try {
    const randomSignature = getAttributeCommitmentRandomness(
      seedAsHex,
      'Testnet',
      0,
      0,
      0,
      0,
    ).toString('hex');

    postMessage({
      result: randomSignature,
      method: CCDCryptoMethods.GetAttributeCommitmentRandomness,
    });
  } catch (error) {
    postMessage(
      {
        result: error,
      },
      MessageType.ERROR,
    );
  }
};

document.addEventListener('message', async function (event: any) {
  let data = event.data;
  if (data) {
    data = JSON.parse(data);
  }

  switch (data.method) {
    case CCDCryptoMethods.GetAccountPublicKey: {
      GetAccountPublicKey(data.params);
      break;
    }
    case CCDCryptoMethods.GetIdCredSec: {
      GetIdCredSec(data.params);
      break;
    }
    case CCDCryptoMethods.GetPrfKey: {
      GetPrfKey(data.params);
      break;
    }
    case CCDCryptoMethods.GetSignatureBlindingRandomness: {
      GetSignatureBlindingRandomness(data.params);
      break;
    }
    case CCDCryptoMethods.GetAttributeCommitmentRandomness: {
      GetAttributeCommitmentRandomness(data.params);
      break;
    }
    default: {
    }
  }
});
