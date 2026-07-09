export const delayedAutoFocusDelayMs = {
  android: 400,
  default: 180,
  ios: 500,
} as const;

export function getDelayedAutoFocusDelayMs(platform: string): number {
  if (platform === "android" || platform === "ios") {
    return delayedAutoFocusDelayMs[platform];
  }

  return delayedAutoFocusDelayMs.default;
}
