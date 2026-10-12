import { Colors } from "@/constants/colors";
import { forwardRef, useImperativeHandle } from "react";
import Animated, {
  Easing,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { StyleSheet, View } from "react-native";

const NUM_DOTS = 8;
const DELAYS = [0, 0.025, 0.05, 0.075, 0.1, 0.125, 0.15, 0.175] as const;
const DOT_SIZES = [5.5, 3, 3, 5.5, 3, 3, 5.5, 3] as const;
const DOT_COLORS = [
  Colors.main[500],
  Colors.main[300],
  Colors.gray[100],
  Colors.main[500],
  Colors.main[300],
  Colors.gray[100],
  Colors.main[500],
  Colors.main[300],
] as const;

type DotConfig = { angle: number; distance: number };

export type SparkHandle = {
  trigger: (x: number, y: number) => void;
};

type SparkDotProps = {
  progress: SharedValue<number>;
  delay: number;
  size: number;
  color: string;
  dotConfigs: SharedValue<DotConfig[]>;
  index: number;
};

function SparkDot({ progress, delay, size, color, dotConfigs, index }: SparkDotProps) {
  const style = useAnimatedStyle(() => {
    "worklet";
    const rawT = progress.value;

    if (rawT <= delay) {
      return { opacity: 0, transform: [{ translateX: 0 }, { translateY: 0 }] };
    }

    const t = Math.min(1, (rawT - delay) / (1 - delay));
    const eased = 1 - (1 - t) * (1 - t) * (1 - t);

    const { angle, distance } = dotConfigs.value[index];
    const tx = Math.cos(angle) * distance * eased;
    const ty = Math.sin(angle) * distance * 0.8 * eased;

    const opacity = t < 0.25 ? t / 0.25 : 1 - (t - 0.25) / 0.75;

    return {
      opacity,
      transform: [{ translateX: tx }, { translateY: ty }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: -size / 2,
          top: -size / 2,
        },
        style,
      ]}
    />
  );
}

const EmojiSpark = forwardRef<SparkHandle>(function EmojiSpark(_, ref) {
  const progress = useSharedValue(0);
  const dotConfigs = useSharedValue<DotConfig[]>(
    Array.from({ length: NUM_DOTS }, () => ({ angle: 0, distance: 0 })),
  );
  const anchorX = useSharedValue(0);
  const anchorY = useSharedValue(0);

  const anchorStyle = useAnimatedStyle(() => ({
    left: anchorX.value,
    top: anchorY.value,
  }));

  useImperativeHandle(ref, () => ({
    trigger(x: number, y: number) {
      const configs: DotConfig[] = Array.from({ length: NUM_DOTS }, () => ({
        angle: -(0.12 + Math.random() * 0.76) * Math.PI,
        distance: 30 + Math.random() * 24,
      }));

      runOnUI(() => {
        "worklet";
        anchorX.value = x;
        anchorY.value = y;
        dotConfigs.value = configs;
        progress.value = 0;
        progress.value = withTiming(1, { duration: 600, easing: Easing.linear });
      })();
    },
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <Animated.View style={[styles.anchor, anchorStyle]}>
        {Array.from({ length: NUM_DOTS }, (_, i) => (
          <SparkDot
            key={i}
            progress={progress}
            delay={DELAYS[i]}
            size={DOT_SIZES[i]}
            color={DOT_COLORS[i]}
            dotConfigs={dotConfigs}
            index={i}
          />
        ))}
      </Animated.View>
    </View>
  );
});

export default EmojiSpark;

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    width: 0,
    height: 0,
  },
});
