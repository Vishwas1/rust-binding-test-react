/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import { mnemonicToSeedSync } from '@scure/bip39';
import { Buffer } from 'buffer';

enum CCDCryptoMethods {
  GetAccountSigningKey = 'getAccountSigningKey',
  GetAccountPublicKey = 'getAccountPublicKey',
  GetPrfKey = 'getPrfKey',
  GetIdCredSec = 'getIdCredSec',
  GetSignatureBlindingRandomness = 'getSignatureBlindingRandomness',
  GetAttributeCommitmentRandomness = 'getAttributeCommitmentRandomness',
}

function App(): JSX.Element {
  const webviewRef = useRef<any>(null);
  const pendingPromises = useRef<{ [id: string]: (result: any) => void }>({});

  const handleMessage = (event: any) => {
    try {
      console.log('global Log', event.nativeEvent.data);
      let data = event.nativeEvent.data;
      if (data) {
        data = JSON.parse(data);
      }
      const id = data.id;
      const message = data.message;

      if (id && pendingPromises.current[id]) {
        pendingPromises.current[id](message.result); // resolve the promise
        delete pendingPromises.current[id];
      }

      switch (message.method) {
        case CCDCryptoMethods.GetAccountPublicKey:
          console.log('GetAccountPublicKey:', message.result);
          break;
        case CCDCryptoMethods.GetIdCredSec:
          console.log('GetIdCredSec:', message.result);
          break;
        case CCDCryptoMethods.GetPrfKey:
          console.log('GetPrfKey:', message.result);
          break;
        case CCDCryptoMethods.GetSignatureBlindingRandomness:
          console.log('GetSignatureBlindingRandomness:', message.result);
          break;
        case CCDCryptoMethods.GetAttributeCommitmentRandomness:
          console.log('GetAttributeCommitmentRandomness:', message.result);
          break;
        default:
          console.log('Unhandled method:', message.method);
      }
    } catch (e) {
      console.error('handleMessage error:', e);
    }
  };

  const sendMessageAndWait = (method: CCDCryptoMethods, params: any) => {
    return new Promise((resolve) => {
      const id = Date.now().toString() + Math.random().toString(16).slice(2);
      pendingPromises.current[id] = resolve;

      const message = {
        id,
        method,
        params,
      };

      webviewRef.current?.postMessage(JSON.stringify(message));
    });
  };

  const sendMesageToWebView = async () => {
    const seedAsHex = Buffer.from(
      mnemonicToSeedSync(
        'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      ),
    ).toString('hex');
    try {
      await sendMessageAndWait(CCDCryptoMethods.GetAccountPublicKey, { seedAsHex });
      await sendMessageAndWait(CCDCryptoMethods.GetIdCredSec, { seedAsHex });
      await sendMessageAndWait(CCDCryptoMethods.GetSignatureBlindingRandomness, { seedAsHex });
      await sendMessageAndWait(CCDCryptoMethods.GetAttributeCommitmentRandomness, { seedAsHex });
      await sendMessageAndWait(CCDCryptoMethods.GetPrfKey, { seedAsHex });

      // similarly for other methods...
    } catch (error) {
      console.error('Error calling WebView method:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.sectionContainer} onPress={sendMesageToWebView}>
        <Text>Click Here</Text>
      </TouchableOpacity>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        startInLoadingState
        onMessage={handleMessage}
        source={{ uri: 'file:///android_asset/index.html' }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  sectionContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    width: '60%',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 40,
  },
});

export default App;
