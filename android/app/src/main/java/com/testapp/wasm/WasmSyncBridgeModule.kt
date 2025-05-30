package com.testapp.wasm

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class WasmSyncBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var latch: CountDownLatch? = null
    private var response: String? = null
    private var waiting = false
    override fun getName(): String = "WasmSyncBridge"

    @ReactMethod
    fun addListener(eventName: String?) {
    // Required for RN event emitter compatibility
    }

    @ReactMethod
    fun prepareWaiting(promise: Promise) {
    if (waiting) {
        promise.reject("Already waiting")
        return
    }
    latch = CountDownLatch(1)  // reset latch
    waiting = true
    promise.resolve(true)
    }

    @ReactMethod
    fun waitForResponse(timeout: Int, promise: Promise) {
    val success = latch?.await(timeout.toLong(), TimeUnit.MILLISECONDS)
    waiting = false
    promise.resolve(success)
    }

    @ReactMethod
    fun removeListeners(count: Int) {
    // Required for RN event emitter compatibility
    }


    @ReactMethod
    fun getWasmData(requestData: String, promise: Promise) {
        Log.e("WasmSyncBridge", "🔥 getWasmData called with: $requestData")
        latch = CountDownLatch(1)
        response = null

        // Send data to JS (via WebView)
        val event = Arguments.createMap()
        event.putString("data", requestData)
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("WasmBridgeRequest", event)
        Log.e("WasmSyncBridge", "⏳ Waiting for response...")
        Thread {
            try {
               val success = latch?.await(5, TimeUnit.SECONDS)
        Log.e("WasmSyncBridge", "✅ Done waiting. Success: $success")
                
            } catch (e: InterruptedException) {
                
                Log.e("WasmSyncBridge", "❌ Interrupted while waiting")
        promise.reject("INTERRUPTED", e)
            }
             if (response != null) {
        promise.resolve(response)
    } else {
        promise.reject("NO_RESPONSE", "Timed out or no response set")
    }
        }.start()
    }
  @ReactMethod
    fun setResponse(data: String) {
    Log.e("WasmSyncBridge", "✅ setResponse called with: $data")
    response = data
    Thread.sleep(500) // add a small delay here to test timing
    latch?.countDown()
    }
    @ReactMethod
    fun isWaiting(promise: Promise) {
        promise.resolve(waiting)
    }
}
