package com.videoeditor

import android.net.Uri
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class SAFModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private var pickerPromise : Promise? = null

    @ReactMethod
    fun launchSAFPicker(filename: String,promise: Promise) {

        var activity = this.getReactApplicationContext().getCurrentActivity() as MainActivity
        if (activity == null) {
            promise.reject("E_ACTIVITY_DOES_NOT_EXIST", "Activity doesn't exist")
            return
        }

        pickerPromise = promise

        try {
            activity.onActivityResultImplementation = object : OnActivityResultImplementation {
                        override fun execute(uri: Uri?){
                            uri?.let { pickerPromise?.resolve(uri.toString())}
                            ?: pickerPromise?.reject("E_NO_IMAGE_DATA_FOUND", "No video data found")

                            pickerPromise = null
                        }
                    }
            activity.saveVideoLauncher.launch(filename)
        } catch (t: Throwable) {
            pickerPromise?.reject("E_FAILED_TO_SHOW_PICKER", t)
            pickerPromise = null
        }


    }

    override fun getName() = "SAFModule"
}