import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Platform } from "react-native";

import { getDelayedAutoFocusDelayMs } from "../services/delayed-auto-focus.service";

type FocusInput = () => void;

export function useDelayedScreenAutoFocus(focusInput: FocusInput): void {
  useFocusEffect(
    useCallback(() => {
      let firstFrame: number | undefined;
      let secondFrame: number | undefined;
      let focusTimer: ReturnType<typeof setTimeout> | undefined;

      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          focusTimer = setTimeout(() => {
            focusInput();
          }, getDelayedAutoFocusDelayMs(Platform.OS));
        });
      });

      return () => {
        if (firstFrame !== undefined) {
          cancelAnimationFrame(firstFrame);
        }

        if (secondFrame !== undefined) {
          cancelAnimationFrame(secondFrame);
        }

        if (focusTimer) {
          clearTimeout(focusTimer);
        }
      };
    }, [focusInput])
  );
}
