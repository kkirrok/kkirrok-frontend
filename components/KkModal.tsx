import KkButton from "@/components/KkButton";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { Modal, StyleSheet, Text, View } from "react-native";

interface KkModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
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
  title,
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
          {title ? (
            <View style={styles.textBlock}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{message}</Text>
            </View>
          ) : (
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
          )}

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
    backgroundColor: `${Colors.gray[1000]}B2`,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  box: {
    width: "100%",
    backgroundColor: Colors.gray[900],
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    gap: 20,
  },
  textBlock: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    ...Typography.title.s,
    color: Colors.gray[200],
    textAlign: "center",
  },
  description: {
    ...Typography.body.m,
    color: Colors.gray[200],
    textAlign: "center",
  },
  message: {
    ...Typography.title.s,
    color: Colors.gray[100],
    textAlign: "center",
  },
  highlight: {
    ...Typography.title.s,
    color: Colors.main[400],
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
    backgroundColor: Colors.gray[500],
  },
  cancelText: {
    color: Colors.gray[200],
  },
});
