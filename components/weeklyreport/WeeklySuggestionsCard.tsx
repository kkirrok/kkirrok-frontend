import { Text, View } from "react-native";
import { styles } from "./styles";
import type { WeeklyReportResponse } from "@/utils/types/report";

type Props = {
  suggestions: WeeklyReportResponse["data"]["nextWeekSuggestions"];
};

export default function WeeklySuggestionsCard({ suggestions }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>다음에는 이렇게 해보아요:)</Text>

      {suggestions.map((suggestion, index) => (
        <View key={suggestion.title} style={styles.tipRow}>
          {index % 2 === 0 && <View style={styles.smallImagePlaceholder} />}

          <View style={styles.tipTextBox}>
            <Text style={styles.tipTitle}>{suggestion.title}</Text>

            <Text style={styles.tipBody}>{suggestion.content}</Text>
          </View>

          {index % 2 === 1 && <View style={styles.smallImagePlaceholder} />}
        </View>
      ))}
    </View>
  );
}
