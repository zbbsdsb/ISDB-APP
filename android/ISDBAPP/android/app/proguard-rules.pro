# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in android-sdk/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the ProGuard
# include property in project.properties.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.flipper.** { *; }
-keep class com.facebook.yoga.** { *; }
-keep class com.facebook.proguard.annotations.** { *; }

# React Native Animated
-keep class com.facebook.react.animated.** { *; }

# Keep React Native interfaces
-keep interface com.facebook.react.bridge.** { *; }
-keepclassmembers,allowshrinking,allowoptimization class * { native <methods>; }

# React Native WebView
-keep class com.facebook.react.views.webview.** { *; }

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Keep Kotlin stdlib
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**

# Keep Kotlin Coroutines
-keepnames class kotlinx.coroutines.internal.MainCoroutineDispatcher
-keepnames class com.facebook.react.bridge.ReactContext
-keepclassmembers class kotlinx.coroutines.android.** { *; }

# react-native-gesture-handler
-keep class com.swmansion.gesturehandler.** { *; }

# react-native-safe-area-context
-keep class com.th3rdwave.safeareacontext.** { *; }

# react-native-async-storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# react-native-keychain
-keep class com.facebook.crypto.** { *; }
-keep class com.facebook.secure.** { *; }
-keep class com.oblador.keychain.** { *; }

# JSC (if using)
-keep class org.webkit.** { *; }
-keep class com.facebook.react.jscexecutor.** { *; }

# AndroidX / AppCompat
-keep class androidx.** { *; }
-keep interface androidx.** { *; }
-dontwarn androidx.**
-keep class android.support.v4.** { *; }
-keep interface android.support.v4.** { *; }
-keep class android.support.v7.** { *; }
-keep interface android.support.v7.** { *; }

# App Compatibility
-keep class androidx.appcompat.** { *; }
-keep class android.support.v7.widget.** { *; }

# Keep Lifecycle
-keep class androidx.lifecycle.** { *; }

# Firebase / OKHTTP (if used)
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# Retrofit (if used)
-keep class retrofit2.** { *; }
-dontwarn retrofit2.**
-keepattributes Signature
-keepattributes Exceptions

# GSON (if used)
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.examples.android.model.** { *; }
-keep class com.google.gson.** { *; }

# Crash reporting
-keepattributes SourceFile,LineNumberTable

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
-renamesourcefileattribute SourceFile

# Hermes-specific
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.hermes.intl.** { *; }
-keep class com.facebook.hermes.reactexecutor.** { *; }
-keep class com.facebook.hermes.** { *; }

# Keep Parcelable
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Reflection
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Remove logging in production
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}
