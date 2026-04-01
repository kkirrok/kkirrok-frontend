import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

interface KkBackgroundProps {
  children: React.ReactNode;
}

export default function KkBackground({ children }: KkBackgroundProps) {
  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 360 800"
        style={StyleSheet.absoluteFillObject}
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <RadialGradient
            id="glow0"
            cx="103"
            cy="655"
            r="420"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#F6623B" stopOpacity="0.20" />
            <Stop offset="30%" stopColor="#F6623B" stopOpacity="0.12" />
            <Stop offset="60%" stopColor="#F6623B" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#F6623B" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient
            id="glow1"
            cx="365"
            cy="86"
            r="420"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#F6623B" stopOpacity="0.20" />
            <Stop offset="30%" stopColor="#F6623B" stopOpacity="0.12" />
            <Stop offset="60%" stopColor="#F6623B" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#F6623B" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width="360" height="800" fill="#1A1614" />

        <Circle cx="103" cy="655" r="420" fill="url(#glow0)" />

        <Circle cx="365" cy="86" r="420" fill="url(#glow1)" />
      </Svg>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1614",
  },
});
