## CCD Crypto SDK For React Native

### Installation 

Download the [ccd-crypto-sdk-for-react-native.js](/android/app/src/main/assets/ccd-crypto-sdk-for-react-native.js) and put it `android/app/src/main/assets` folder. 

Create index.html file in `android/app/src/main/assets` folder. Inside `index.html` add the following code

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
   <script src="./ccd-crypto-sdk-for-react-native.js"></script>
   </head>
   <body>
   </body>
</html>
```

### Usage

Use crypto function in your react native through webview like this: 

```js
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
        case CCDCryptoMethods.GetAccountPublicKey: {
          console.log(data.message.result);
          break;
        }
        case CCDCryptoMethods.GetIdCredSec: {
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
          method: CCDCryptoMethods.GetIdCredSec,
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

export default App;


```

### Note: 

- This is just for explanation, the CCD Crypto SDK For React Native is not full fledge SDK developed.
- This way a react devs can consume wasm based crypto functions in reactive native.

