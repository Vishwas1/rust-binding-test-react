/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
  const webviewRef = useRef(null);

  const handleMessage = (event: any) => {
    try {
      console.log('global Log', event.nativeEvent.data);
      let data = event.nativeEvent.data;
      if (data) {
        data = JSON.parse(data);
      }
      // handle error here.

      // if no error then ...
      switch (data.message.method) {
        case CCDCryptoMethods.GetAccountSigningKey: {
          console.log(data.message.result);
          break;
        }
        case CCDCryptoMethods.GetAccountPublicKey: {
          console.log(data.message.result);
          break;
        }
        case CCDCryptoMethods.GetPrfKey: {
          console.log(data.message.result);
          break;
        }
        case CCDCryptoMethods.GetIdCredSec: {
          console.log(data.message.result);
          break;
        }
        case CCDCryptoMethods.GetSignatureBlindingRandomness: {
          console.log(data.message.result);
          break;
        }
        case CCDCryptoMethods.GetAttributeCommitmentRandomness: {
          console.log(data.message.result);
          break;
        }
        default: {
          console.log('Inside handleMessage default case');
        }
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const sendMesageToWebView = () => {
    const seedAsHex =  Buffer.from(
      mnemonicToSeedSync(
        'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      ),
    ).toString('hex');

    if (webviewRef.current) {
      webviewRef.current.postMessage(
        JSON.stringify({
          method: CCDCryptoMethods.GetAccountPublicKey,
          params: {
            seedAsHex: seedAsHex,
          },
        }),
      );

      webviewRef.current.postMessage(
        JSON.stringify({
          method: CCDCryptoMethods.getIdCredSec,
          params: {
            seedAsHex: seedAsHex,
          },
        }),
      );


      webviewRef.current.postMessage(
        JSON.stringify({
          method: CCDCryptoMethods.GetPrfKey,
          params: {
            seedAsHex: seedAsHex,
          },
        }),
      );

      webviewRef.current.postMessage(
        JSON.stringify({
          method: CCDCryptoMethods.GetSignatureBlindingRandomness,
          params: {
            seedAsHex: seedAsHex,
          },
        }),
      );
      webviewRef.current.postMessage(
        JSON.stringify({
          method: CCDCryptoMethods.GetAttributeCommitmentRandomness,
          params: {
            seedAsHex: seedAsHex,
          },
        }),
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.sectionContainer}
        onPress={sendMesageToWebView}>
        <Text>Click Here</Text>
      </TouchableOpacity>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true} // Android only
        startInLoadingState={true}
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
    width: '30%',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
