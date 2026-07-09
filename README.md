# Transition Keyboard Demo

A focused Expo demo for one mobile UX detail: navigate to an OTP screen, wait
for the screen to be focused and rendered, then focus the OTP input so the
keyboard appears after the screen is already visible.

This keeps the keyboard animation from competing with the route animation, which
is especially noticeable on short OTP or login flows.

## What It Shows

1. The home screen offers two routes: `/otp` for the clean implementation and
   `/otp-autofocus` for the anti-pattern comparison.
2. The OTP screen runs a focus effect when Expo Router focuses the screen.
3. The hook waits for two animation frames, then applies a platform-specific
   delay before focusing `InputOTP`.
4. Cleanup cancels the pending animation frames and timer when leaving the
   screen.
5. The anti-pattern screen uses `autoFocus` directly on the hidden OTP text
   input, so the keyboard can start opening while the route transition is still
   in progress.

## Stack

- [Expo](https://expo.dev/) and [Expo Router](https://docs.expo.dev/router/introduction/)
- [HeroUI Native](https://heroui.com/en/docs/native/getting-started/quick-start)
- [HeroUI Native InputOTP](https://heroui.com/en/docs/native/components/input-otp)
- [Uniwind](https://docs.uniwind.dev/quickstart)
- [`react-native-keyboard-controller`](https://docs.expo.dev/versions/v57.0.0/sdk/keyboard-controller/)
- Bun for package management

## Run Locally

Install dependencies:

```bash
bun install
```

Start Expo:

```bash
bun start
```

For a predictable local port:

```bash
npx expo start --port 8083
```

Then open the app on iOS or Android from the Expo CLI.

## Useful Commands

```bash
bun run typecheck
bun run lint
bun run format:check
```

## Project Structure

```text
src/app/_layout.tsx                         Root providers and stack configuration
src/app/index.tsx                           Thin home route
src/app/otp.tsx                             Thin clean OTP route
src/app/otp-autofocus.tsx                   Thin direct autoFocus route
src/features/home-demo/ui_components/       Home screen UI
src/features/home-demo/hooks/               Home screen orchestration
src/features/otp-demo/ui_components/        OTP screen UI
src/features/otp-demo/hooks/                OTP state, refs, navigation, keyboard
src/features/keyboard-focus/hooks/          Reusable delayed focus hook
src/features/keyboard-focus/services/       Pure platform delay decision
```

## Implementation Notes

- `KeyboardProvider` is mounted once at the root.
- `KeyboardController.preload()` is called before navigating to the OTP screen.
- The OTP screen focuses `InputOTP` with the same delayed autofocus pattern used
  in Track: `useFocusEffect`, two `requestAnimationFrame` calls, then a
  platform-specific delay.
- `KeyboardAvoidingView` comes from `react-native-keyboard-controller`.
- `KeyboardController.dismiss()` runs before going back from the OTP screen.
- `/otp-autofocus` intentionally skips the delayed focus hook and puts
  `autoFocus: true` in `InputOTP` `textInputProps`; this is the comparison case,
  not the recommended implementation.
- Expo route files stay thin and delegate to feature screens.

This repository is intentionally small. It does not include authentication,
backend calls, analytics, or unrelated screens.
