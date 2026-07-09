import {
  Button,
  Card,
  Description,
  InputOTP,
  Label,
  REGEXP_ONLY_DIGITS,
  Typography,
} from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import { useAutofocusOtpScreen } from "../../hooks/use-autofocus-otp-screen.hook";

export function AutofocusOtpScreen(): JSX.Element {
  const {
    clearCode,
    code,
    dismissKeyboard,
    goBack,
    handleCodeChange,
    handleCodeComplete,
    inputRef,
  } = useAutofocusOtpScreen();

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <Card className="gap-8">
          <View className="gap-3">
            <Typography.Heading type="h1">Avoid autoFocus</Typography.Heading>
            <Typography.Paragraph color="muted">
              This variant focuses the hidden OTP input as soon as it mounts.
            </Typography.Paragraph>
          </View>

          <View className="gap-3">
            <Label>Verification code</Label>
            <Description>Use any 6 digits for this demo.</Description>

            <InputOTP
              ref={inputRef}
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              inputMode="numeric"
              textInputProps={{
                autoFocus: true,
                keyboardType: "number-pad",
                textContentType: "oneTimeCode",
              }}
              onComplete={handleCodeComplete}
            >
              <InputOTP.Group>
                <InputOTP.Slot index={0} />
                <InputOTP.Slot index={1} />
                <InputOTP.Slot index={2} />
              </InputOTP.Group>
              <InputOTP.Separator />
              <InputOTP.Group>
                <InputOTP.Slot index={3} />
                <InputOTP.Slot index={4} />
                <InputOTP.Slot index={5} />
              </InputOTP.Group>
            </InputOTP>
          </View>

          <View className="gap-3">
            <Button onPress={clearCode} variant="secondary">
              Clear
            </Button>
            <Button onPress={dismissKeyboard} variant="secondary">
              Dismiss keyboard
            </Button>
            <Button onPress={goBack} variant="ghost">
              Back
            </Button>
          </View>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}
