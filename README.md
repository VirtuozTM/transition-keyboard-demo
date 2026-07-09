# Transition Keyboard Demo

A focused Expo demo for one mobile UX detail: navigate to an OTP screen, wait
for the screen to be focused and rendered, then focus the OTP input so the
keyboard appears after the screen is already visible.

This keeps the keyboard animation from competing with the route animation, which
is especially noticeable on short OTP or login flows.

## UX Problem

OTP screens look simple, but their timing is easy to get wrong. The route push,
the first screen layout, the hidden `TextInput` used by the OTP component, and
the native keyboard animation can all start in the same short window.

The anti-pattern is to treat the OTP field like a static form field and add
`autoFocus` directly to the input. React Native documents `autoFocus` as a prop
that focuses the input when it is `true`, which is correct for many plain forms.
On a transitioning OTP screen, though, that means the keyboard can begin opening
while the screen is still sliding in. The user sees two layout movements at once:
the navigation transition and the keyboard avoidance. The result often feels
janky, especially on Android where focus/keyboard behavior around stack
transitions has historically been more fragile.

The clean approach is to make focus part of the screen lifecycle instead of the
input mount lifecycle. The user first sees the OTP screen, then the keyboard
appears. The input still feels automatic, but the visual sequence is controlled.

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

## UX Comparison

| Route            | Pattern                         | What happens                                                                                                                                    |
| ---------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `/otp`           | Clean delayed focus             | The app preloads the keyboard, waits for the route to be focused, waits for two frames and a platform delay, then focuses the OTP input by ref. |
| `/otp-autofocus` | Direct `autoFocus` anti-pattern | The hidden OTP `TextInput` asks for focus as soon as it mounts, even if the route transition has not visually settled.                          |

The anti-pattern is not "bad code" in isolation. It is a common first attempt:

```tsx
<InputOTP
  textInputProps={{
    autoFocus: true,
    keyboardType: "number-pad",
    textContentType: "oneTimeCode",
  }}
/>
```

The problem is contextual. `autoFocus` ties keyboard timing to component mount,
but this demo needs keyboard timing to follow screen visibility.

## Clean Focus Sequence

The recommended route uses this sequence:

1. Preload the keyboard before navigation with `KeyboardController.preload()`.
2. Navigate to `/otp`.
3. Run the focus orchestration from `useFocusEffect`, not from JSX.
4. Wait for two `requestAnimationFrame` ticks so the screen and OTP slots get a
   chance to render.
5. Wait for the calibrated platform delay:
   - Android: `400ms`
   - iOS: `500ms`
   - default: `180ms`
6. Call `inputRef.current?.focus()`.
7. Cancel pending frames and timers when the route loses focus.

This deliberately separates three concerns:

- route focus belongs to Expo Router
- keyboard behavior belongs to `react-native-keyboard-controller`
- platform timing belongs to a small pure service

## Research Basis

This implementation is based on a combination of official docs, library docs,
and field notes from the React Native ecosystem:

- [Expo Router `useFocusEffect`](https://docs.expo.dev/versions/v57.0.0/sdk/router/#usefocuseffecteffect-do_not_pass_a_second_prop):
  Expo documents it as the hook for work that should run when a route becomes
  focused and clean up when it loses focus. This is why the clean version starts
  from route focus instead of component mount.
- [React Navigation `useFocusEffect`](https://reactnavigation.org/docs/use-focus-effect/#delaying-effect-until-transition-finishes):
  React Navigation notes that focus effects can run before a screen transition
  animation has finished, and recommends deferring work when it could affect the
  animation. This is the core reason the demo waits before focusing the input.
- [React Native `TextInput`](https://reactnative.dev/docs/textinput#autofocus):
  `autoFocus` is documented as focusing the input when true, while `.focus()` is
  available for imperative focus. The clean version uses the imperative path so
  focus happens at the chosen moment.
- [React Native animations notes](https://reactnative.dev/docs/animations#requestanimationframe):
  React Native describes `requestAnimationFrame` as running before the next
  repaint. Two nested frames give the navigation push and OTP layout a short
  render window before keyboard focus.
- [React Native `InteractionManager`](https://reactnative.dev/docs/interactionmanager):
  The API exists to defer work until interactions or animations complete. It is
  now deprecated for long-running work, so this demo keeps the idea of deferring
  transition-sensitive work while using a small frame-plus-delay strategy instead.
- [Expo keyboard handling guide](https://docs.expo.dev/guides/keyboard-handling/):
  Expo frames keyboard handling as a UX concern and points to
  `react-native-keyboard-controller` for advanced cross-platform keyboard
  behavior.
- [Expo SDK 57 `react-native-keyboard-controller`](https://docs.expo.dev/versions/v57.0.0/sdk/keyboard-controller/):
  Expo lists the library as the keyboard manager used for consistent Android and
  iOS behavior.
- [`KeyboardController` API](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-controller):
  The library documents `preload()` for reducing first-focus keyboard delay and
  `dismiss()` for hiding the keyboard through the controller rather than relying
  on the default React Native keyboard module.
- [HeroUI Native `InputOTP`](https://heroui.com/en/docs/native/components/input-otp):
  `InputOTP` manages OTP slots around an underlying input and exposes
  `textInputProps`, which is why the anti-pattern can be demonstrated by passing
  `autoFocus` through that prop.
- [Medium: React Native Keyboard Controller overview](https://medium.com/@shreyasdamase/mastering-keyboard-handling-in-react-native-a-complete-guide-to-react-native-keyboard-controller-451438bdc1f0):
  This is a secondary community source, not an API contract, but it reflects the
  same practical pain point: keyboard handling needs explicit cross-platform
  orchestration to feel native.
- [React Navigation issue #9875](https://github.com/react-navigation/react-navigation/issues/9875):
  A concrete historical example where `TextInput autoFocus` inside a stack screen
  caused Android focus/blur problems. The demo does not depend on that exact bug,
  but it supports the broader lesson: focus during stack transitions is timing
  sensitive.

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
  in production apps: `useFocusEffect`, two `requestAnimationFrame` calls, then a
  platform-specific delay.
- `KeyboardAvoidingView` comes from `react-native-keyboard-controller`.
- `KeyboardController.dismiss()` runs before going back from the OTP screen.
- `/otp-autofocus` intentionally skips the delayed focus hook and puts
  `autoFocus: true` in `InputOTP` `textInputProps`; this is the comparison case,
  not the recommended implementation.
- Expo route files stay thin and delegate to feature screens.

This repository is intentionally small. It does not include authentication,
backend calls, analytics, or unrelated screens.
