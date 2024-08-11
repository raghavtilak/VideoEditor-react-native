package com.videoeditor

import android.net.Uri
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import androidx.activity.result.contract.ActivityResultContracts

class MainActivity : ReactActivity() {

  var onActivityResultImplementation : OnActivityResultImplementation? = null;
  val saveVideoLauncher =
        registerForActivityResult(ActivityResultContracts.CreateDocument("video/mp4")) { uri ->
                onActivityResultImplementation?.execute(uri)
        }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "VideoEditor"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
