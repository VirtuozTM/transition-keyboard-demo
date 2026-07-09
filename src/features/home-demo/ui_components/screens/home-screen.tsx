import { Button, Card, Typography } from "heroui-native";
import type { JSX } from "react";
import { View } from "react-native";

import { useHomeScreen } from "../../hooks/use-home-screen.hook";

export function HomeScreen(): JSX.Element {
  const { openAutofocusOtpScreen, openCleanOtpScreen } = useHomeScreen();

  return (
    <View className="flex-1 justify-center bg-background px-6">
      <Card className="gap-8">
        <View className="gap-3">
          <Typography.Heading type="h1">Transition Keyboard Demo</Typography.Heading>
          <Typography.Paragraph color="muted">
            Compare delayed OTP focus with direct input autoFocus during a route transition.
          </Typography.Paragraph>
        </View>

        <View className="gap-3">
          <Button onPress={openAutofocusOtpScreen} variant="danger" className="w-full">
            Open autoFocus OTP
          </Button>
          <Button onPress={openCleanOtpScreen} className="w-full">
            Open clean OTP with delay
          </Button>
        </View>

        <Typography.Paragraph color="muted" type="body-sm" className="text-center">
          Expo Router + HeroUI Native InputOTP + react-native-keyboard-controller.
        </Typography.Paragraph>
      </Card>
    </View>
  );
}
