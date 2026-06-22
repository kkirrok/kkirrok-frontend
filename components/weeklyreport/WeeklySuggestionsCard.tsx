import { Text, View } from "react-native";
import { styles } from "./styles";

export default function WeeklySuggestionsCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        다음에는 이렇게 해보아요:)
      </Text>

      <View style={styles.tipRow}>
        <View style={styles.smallImagePlaceholder} />

        <View style={styles.tipTextBox}>
          <Text style={styles.tipTitle}>
            영양소는 고르게 섭취해요
          </Text>

          <Text style={styles.tipBody}>
            다양한 식품군을 포함하여 영양소의 균형을 맞추는 것이
            중요합니다.
          </Text>
        </View>
      </View>

      <View style={styles.tipRow}>
        <View style={styles.tipTextBox}>
          <Text style={styles.tipTitle}>
            저녁과 야식은 라이트하게!
          </Text>

          <Text style={styles.tipBody}>
            저녁과 식사는 가볍고 소화가 잘되는 음식으로 구성하여
            건강을 지킵시다.
          </Text>
        </View>

        <View style={styles.smallImagePlaceholder} />
      </View>
    </View>
  );
}