/**
 * Expo app configuration as JS so you can add comments, logic, and types.
 * @see https://docs.expo.dev/workflow/configuration/
 * @type {import('expo/config').ExpoConfig}
 */
module.exports = {
  expo: {
    name: "web-app",
    slug: "web-app",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    scheme: "webapp",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.webapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.webapp",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-asset",
      [
        "expo-font",
        {
          "fonts": [
            "node_modules/@expo-google-fonts/roboto/100Thin/Roboto_100Thin.ttf",
            "node_modules/@expo-google-fonts/roboto/400Regular/Roboto_400Regular.ttf",
            "node_modules/@expo-google-fonts/roboto/500Medium/Roboto_500Medium.ttf",
            "node_modules/@expo-google-fonts/roboto/700Bold/Roboto_700Bold.ttf"
          ]
        }
      ],
      // [
      //   "expo-splash-screen",
      //   {
      //     // backgroundColor: "#ffffff",
      //     image: "./assets/splash-icon.png",
      //   },
      // ],
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
        }
      ]
    ],
  },
};
