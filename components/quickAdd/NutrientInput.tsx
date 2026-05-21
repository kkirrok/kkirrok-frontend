import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
};

export default function NutrientInput({ label, value, onChange, unit }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor={Colors.gray[300]}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    gap: 8,
  },
  label: {
    ...Typography.title.xs,
    color: Colors.gray[200],
  },
  box: {
    backgroundColor: "#FDFCFC1A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.gray[700],
  },
  input: {
    flex: 1,
    ...Typography.body.m,
    color: Colors.gray[100],
    padding: 0,
    minWidth: 0,
    textAlign: "right",
  },
  unit: {
    ...Typography.body.m,
    color: Colors.gray[100],
    marginLeft: 2,
  },
});
