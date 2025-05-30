import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import WebView from 'react-native-webview';
import { mnemonicToSeedSync } from '@scure/bip39';
import { Buffer } from 'buffer';

const { WasmSyncBridge } = NativeModules;
const wasmBridgeEmitter = new NativeEventEmitter(WasmSyncBridge);

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

  useEffect(() => {
    const sub = wasmBridgeEmitter.addListener('WasmBridgeRequest', (event) => {
      console.log('Received event from native:', event);
      const data = JSON.parse(event.data);
      console.log(data, 'data')
      if (webviewRef.current) {
        webviewRef.current.postMessage(
          JSON.stringify({
            method: data.method,
            params: data.params,
          }),
        );
      }
    });

    return () => sub.remove();
  }, []);
  const handleMessage = async (event: any) => {
    try {
      const raw = event.nativeEvent.data;
      const data = JSON.parse(raw);
      console.log('WebView Response:', data);

      // Respond to native
      if (data.message?.method) {
        WasmSyncBridge.setResponse(JSON.stringify(data.message));
      }

      // Optional: log per method
      switch (data.message.method) {
        case CCDCryptoMethods.GetAccountSigningKey:
        case CCDCryptoMethods.GetAccountPublicKey:
        case CCDCryptoMethods.GetPrfKey:
        case CCDCryptoMethods.GetIdCredSec:
        case CCDCryptoMethods.GetSignatureBlindingRandomness:
        case CCDCryptoMethods.GetAttributeCommitmentRandomness: {
          console.log(`${data.message.method}:`, data.message.result);
          break;
        }
        default:
          console.warn('Unknown method:', data.message.method);
      }
    } catch (e) {
      console.error('handleMessage error:', e.message);
    }
  };

  const sendMesageToWebView = async () => {
    const seedAsHex = Buffer.from(
      mnemonicToSeedSync(
        'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      ),
    ).toString('hex');

    const methods = [
      CCDCryptoMethods.GetAccountPublicKey,
      CCDCryptoMethods.GetIdCredSec,
      CCDCryptoMethods.GetPrfKey,
      CCDCryptoMethods.GetSignatureBlindingRandomness,
      CCDCryptoMethods.GetAttributeCommitmentRandomness,
    ];

    for (const method of methods) {
      try {
        // Tell native to prepare for waiting (you need a native method for this)
        await WasmSyncBridge.prepareWaiting?.();

        // Send message to WebView
        webviewRef.current?.postMessage(
          JSON.stringify({
            method,
            params: { seedAsHex },
          }),
        );

        // Wait on native side until response is set via WasmSyncBridge.setResponse()
        const success = await WasmSyncBridge.waitForResponse?.(5000);

        if (success) {
          console.log(`Received response for ${method}`);
        } else {
          console.warn(`Timeout waiting for response for ${method}`);
        }

      } catch (err) {
        console.error(`Error in sending message for ${method}:`, err);
      }
    }
  };

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
