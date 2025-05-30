# Project Title

This is a React Native project.

## Prerequisites

- Node.js version: 20.18.3
- Java jdk version: >=21

## Getting Started

### Step 1: Install Dependencies

```bash
yarn install
```

### Step 2: Build 

```bash
node build.js
```

### Step 3: Start the Metro Bundler

```bash
yarn start
```

### Step 4: Run the Application

Let Metro Bundler run in its own terminal. Open a new terminal from the root of your React Native project.

#### For Android

```bash
yarn android
```

#### For iOS

```bash
yarn ios
```


## Making function syncronous
When the user clicks the button, the React Native app sends a message to the WebView and waits for a response before continuing. Here’s the step-by-step flow:
- `Clcik Here` button is clicked

   - React Native triggers a function `sendMessageToWebView`.

   - It send multiple messages
- React native prepare to wait for a response using  `WasmSyncBridge.prepareWaiting()`. This tells the native Kotline code to get ready to pause and wait until a webView response is received.
- ReactNative sends a messsage to webView using `postMessage()`
- WebView receive the message using `window.addEventListener('message')`. And after executing speciifc function js code send the result back to **React Native** via 

    ```js
    window.ReactNativeWebView.postMessage(JSON.stringify({
    method,
    result
    }));

- React Native receive the result in `onMessage` using `handleMessage()` function and process the result. Here **native kotlin code** receive the message too and call `CountDownLatch.countDown()` to **unblock the waiting theread**
- React Native resume after latch is released and `getWasmData()` return the result back to JS.