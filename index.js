/**
 * @format
 */
// #region documentation-snippet
import './polyfill';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Polyfill must come before any reference to @concordium/web-sdk.
// In this case, that means before importing ./App.tsx
import { Crypto } from "@peculiar/webcrypto";
Object.assign(global.crypto, new Crypto());

AppRegistry.registerComponent(appName, () => App);
// #endregion documentation-snippet
