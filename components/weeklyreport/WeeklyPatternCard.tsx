import { Text, View } from "react-native";
import { styles } from "./styles";

const PATTERN_TEXTS = [
  "하루 식사 중 특정 시간대에 섭취가 집중되는 경향",
  "전체 칼로리 섭취가 한 끼에 치우쳐 있는 패턴",
  "식사 이후 추가적인 간식 또는 야식 섭취가 이어짐",
];

export default function WeeklyPatternCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>칼로리 섭취 패턴</Text>

      <View style={styles.patternRow}>
        <View style={styles.patternTextBox}>
          {PATTERN_TEXTS.map((text) => (
            <Text key={text} style={styles.patternText}>
              · {text}
            </Text>
          ))}
        </View>

        <View style={styles.imagePlaceholder} />
      </View>
    </View>
  );
}