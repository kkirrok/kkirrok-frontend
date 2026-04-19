import KkButton from "@/components/KkButton";
import { Modal, StyleSheet, Text, View } from "react-native";

interface KkModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  highlight?: string;
  buttonText: string;
  onButtonPress: () => void;
  cancelText?: string;
  onCancelPress?: () => void;
}

export default function KkModal({
  visible,
  onClose,
  message,
  highlight,
  buttonText,
  onButtonPress,
  cancelText,
  onCancelPress,
}: KkModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.message}>
            {message}
            {highlight && (
              <>
                {"\n"}
                <Text style={styles.highlight}>{highlight}</Text>
                <Text style={styles.message}>입니다.</Text>
              </>
            )}
          </Text>

          {cancelText ? (
            <View style={styles.rowButtons}>
              <KkButton
                title={cancelText}
                onPress={onCancelPress}
                style={styles.cancelButton}
                textStyle={styles.cancelText}
              />
              <KkButton
                title={buttonText}
                onPress={onButtonPress}
                style={styles.flex}
              />
            </View>
          ) : (
            <KkButton title={buttonText} onPress={onButtonPress} />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#1A1614B2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  box: {
    width: "100%",
    backgroundColor: "#372E2A",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    gap: 20,
  },
  message: {
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    color: "#FDFCFC",
    textAlign: "center",
    lineHeight: 28,
  },
  highlight: {
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    color: "#FF8868",
  },
  singleButton: {
    width: "100%",
  },
  rowButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  flex: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#A49289",
  },
  cancelText: {
    color: "#E7E2DF",
  },
});
