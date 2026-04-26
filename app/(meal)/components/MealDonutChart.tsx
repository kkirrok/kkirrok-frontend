import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const CHART_SIZE = 248;
const CX = CHART_SIZE / 2;
const CY = CHART_SIZE / 2;
const OUTER_R = 118;
const INNER_R = 100;

const SEGMENTS = [
  { label: "탄수화물", color: Colors.main[500], pct: 0.55 },
  { label: "단백질", color: Colors.main[400], pct: 0.25 },
  { label: "지방", color: Colors.main[200], pct: 0.2 },
];

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number,
) {
  const o1 = polarToCartesian(CX, CY, outerR, startDeg);
  const o2 = polarToCartesian(CX, CY, outerR, endDeg);
  const i1 = polarToCartesian(CX, CY, innerR, endDeg);
  const i2 = polarToCartesian(CX, CY, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${o1.x} ${o1.y} A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y} L ${i1.x} ${i1.y} A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y} Z`;
}

function NutrientDonut() {
  let cursor = 0;
  return (
    <Svg width={CHART_SIZE} height={CHART_SIZE}>
      {SEGMENTS.map((seg) => {
        const startDeg = cursor * 360;
        cursor += seg.pct;
        const endDeg = cursor * 360;
        return (
          <Path
            key={seg.label}
            d={arcPath(OUTER_R, INNER_R, startDeg, endDeg)}
            fill={seg.color}
          />
        );
      })}
      <Circle cx={CX} cy={CY} r={INNER_R - 3} fill={Colors.gray[1000]} />
    </Svg>
  );
}

function LegendDot({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

type Props = {
  photo: string | null;
  mealName?: string;
  recognitionFailed: boolean;
  onCameraPress: () => void;
};

export default function MealDonutChart({
  photo,
  mealName,
  recognitionFailed,
  onCameraPress,
}: Props) {
  return (
    <View style={styles.chartSection}>
      <View style={styles.chartContainer}>
        <NutrientDonut />
        <TouchableOpacity
          style={styles.chartCenterIcon}
          onPress={onCameraPress}
          activeOpacity={0.7}
        >
          {photo ? (
            <View>
              <Image
                source={{ uri: photo }}
                style={styles.chartPhoto}
                resizeMode="cover"
              />

              {!!mealName && (
                <View style={styles.mealNameBadge}>
                  <Text style={styles.mealNameText}>{mealName}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.cameraContent}>
              <Ionicons name="camera" size={48} color={Colors.gray[100]} />
              {recognitionFailed && (
                <Text style={styles.recognitionFailed}>
                  식사를 인식할 수 없어요.
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.legend}>
        {SEGMENTS.map((seg) => (
          <LegendDot
            key={seg.label}
            color={seg.color}
            label={seg.label}
            value="%"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartSection: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  chartContainer: {
    width: 248,
    height: 248,
  },
  chartCenterIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  chartPhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  cameraContent: {
    alignItems: "center",
    gap: 8,
  },
  recognitionFailed: {
    ...Typography.caption[1],
    color: Colors.gray[400],
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendLabel: {
    ...Typography.caption[1],
    color: Colors.gray[300],
  },
  legendValue: {
    ...Typography.caption[1],
    color: Colors.gray[300],
    marginLeft: 2,
  },
  mealNameBadge: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: "center",
  },
  mealNameText: {
    ...Typography.caption[1],
    color: Colors.gray[100],
    backgroundColor: Colors.main[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
