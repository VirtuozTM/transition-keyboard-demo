import { router } from "expo-router";
import type { InputOTPRef } from "heroui-native";
import { useCallback, useRef, useState, type RefObject } from "react";
import { KeyboardController } from "react-native-keyboard-controller";

import { useDelayedScreenAutoFocus } from "../../keyboard-focus/hooks/use-delayed-screen-auto-focus.hook";

type UseOtpScreenResult = {
  clearCode: () => void;
  code: string;
  dismissKeyboard: () => void;
  goBack: () => void;
  handleCodeChange: (nextCode: string) => void;
  handleCodeComplete: (nextCode: string) => void;
  inputRef: RefObject<InputOTPRef | null>;
};

export function useOtpScreen(): UseOtpScreenResult {
  const inputRef = useRef<InputOTPRef>(null);
  const [code, setCode] = useState("");

  const focusOtpInput = useCallback((): void => {
    inputRef.current?.focus();
  }, []);

  useDelayedScreenAutoFocus(focusOtpInput);

  const clearCode = useCallback((): void => {
    inputRef.current?.clear();
    setCode("");
  }, []);

  const dismissKeyboard = useCallback((): void => {
    KeyboardController.dismiss();
  }, []);

  const goBack = useCallback((): void => {
    KeyboardController.dismiss();
    router.back();
  }, []);

  return {
    clearCode,
    code,
    dismissKeyboard,
    goBack,
    handleCodeChange: setCode,
    handleCodeComplete: setCode,
    inputRef,
  };
}
