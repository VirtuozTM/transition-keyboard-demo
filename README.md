# Transition Keyboard Demo

A focused Expo demo for one mobile UX detail: navigate to an OTP screen, wait
for the screen transition to finish, then focus the OTP input so the keyboard
appears after the screen is already visible.

This keeps the keyboard animation from competing with the route animation, which
is especially noticeable on short OTP or login flows.

## What It Shows

1. The home screen preloads the keyboard and navigates to `/otp`.
2. The OTP screen listens for Expo Router's `transitionEnd` event.
3. Once the opening transition has finished, the `InputOTP` receives focus.
4. A short fallback handles direct launches or cases where no transition event is
   emitted.

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
src/app/_layout.tsx  Root providers and stack configuration
src/app/index.tsx    Home screen that preloads the keyboard before navigation
src/app/otp.tsx      OTP screen that focuses after transitionEnd
```

## Implementation Notes

- `KeyboardProvider` is mounted once at the root.
- `KeyboardController.preload()` is called before navigating to the OTP screen.
- The OTP screen focuses `InputOTP` from a local `transitionEnd` listener.
- `KeyboardAvoidingView` comes from `react-native-keyboard-controller`.
- `KeyboardController.dismiss()` runs before going back from the OTP screen.

This repository is intentionally small. It does not include authentication,
backend calls, analytics, or unrelated screens.
