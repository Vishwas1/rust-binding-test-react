/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import WebView from 'react-native-webview';

function App(): JSX.Element {
  const webviewRef = useRef(null);

  const handleMessage = event => {
    try {
      console.log(event.nativeEvent.data);

      // Display result, save it, etc.
      // Send data to React WebView
    } catch (e) {
      console.error(e.message);
    }
  };

  const sendMesageToWebView = () => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(
        JSON.stringify({
          type: 'success',
          message: 'get me keys',
        }),
      );
    }
  };

  return (
    <View style={{flex: 1}}>
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
        source={{uri: 'file:///android_asset/index.html'}}
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


