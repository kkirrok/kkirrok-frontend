import { Text, View } from "react-native";
import { styles } from "./styles";

type Props = {
  description: string;
};

export default function WeeklyPatternCard({ description }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>칼로리 섭취 패턴</Text>

      <View style={styles.patternRow}>
        <View style={styles.patternTextBox}>
          {description.split("\n").map((text) => (
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