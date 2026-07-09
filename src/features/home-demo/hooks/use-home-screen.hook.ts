import { router } from "expo-router";
import { useCallback } from "react";
import { KeyboardController } from "react-native-keyboard-controller";

type UseHomeScreenResult = {
  openAutofocusOtpScreen: () => void;
  openCleanOtpScreen: () => void;
};

export function useHomeScreen(): UseHomeScreenResult {
  const openCleanOtpScreen = useCallback((): void => {
    KeyboardController.preload();
    router.push("/otp");
  }, []);

  const openAutofocusOtpScreen = useCallback((): void => {
    router.push("/otp-autofocus");
  }, []);

  return { openAutofocusOtpScreen, openCleanOtpScreen };
}
