import "../global.css";

import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import type { JSX } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <HeroUINativeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Keyboard demo" }} />
            <Stack.Screen
              name="otp"
              options={{
                animation: "slide_from_right",
                title: "Clean OTP keyboard",
              }}
            />
            <Stack.Screen
              name="otp-autofocus"
              options={{
                animation: "slide_from_right",
                title: "autoFocus OTP keyboard",
              }}
            />
          </Stack>
        </HeroUINativeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
