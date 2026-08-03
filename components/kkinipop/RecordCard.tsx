import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/typography";
import { MealRecord } from "@/utils/types/kkinipop";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SystemEmojiItem = { emoji_code: string; display: string };
type CustomEmojiItem = {
  emoji_id: number;
  emoji_code: string;
  label: string;
  imageUrl: string | null;
};

type Props = {
  record: MealRecord;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onAddReaction: (emojiCode: string) => void;
  onDelete: () => void;
  hasReacted: boolean;
  highlighted?: boolean;
  onOpenKkimoji?: () => void;
  systemEmojis: SystemEmojiItem[];
  customGroupEmojis: CustomEmojiItem[];
  onDeleteCustomEmoji?: (emojiId: number) => void;
};

export default function RecordCard({
  record,
  pickerOpen,
  onTogglePicker,
  onAddReaction,
  onDelete,
  hasReacted,
  highlighted = false,
  onOpenKkimoji,
  systemEmojis,
  customGroupEmojis,
  onDeleteCustomEmoji,
}: Props) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (customGroupEmojis.length === 0) setIsDeleteMode(false);
  }, [customGroupEmojis.length]);

  useEffect(() => {
    if (!pickerOpen) setIsDeleteMode(false);
  }, [pickerOpen]);

  useEffect(() => {
    if (isDeleteMode) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(wiggleAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: -1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      wiggleAnim.setValue(0);
    }
  }, [isDeleteMode, wiggleAnim]);

  const wiggleStyle = {
    transform: [
      {
        rotate: wiggleAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: ["-5deg", "5deg"],
        }),
      },
    ],
  };

  return (
    <View
      style={[styles.card, highlighted && { borderColor: Colors.main[600] }]}
    >
      {record.image ? (
        <Image
          source={{ uri: record.image }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.cardPlaceholder]} />
      )}

      <LinearGradient
        colors={["rgba(0,0,0,0.45)", "transparent", "rgba(0,0,0,0.65)"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.cardTopRow}>
        <View style={styles.cardAvatarRow}>
          <View style={styles.cardAvatar} />
          <Text style={styles.cardName}>{record.name}</Text>
        </View>
        <View style={styles.cardActions}>
          {record.isOwn && (
            <TouchableOpacity
              onPress={onDelete}
              style={styles.cardActionBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={20} color={Colors.gray[100]} />
            </TouchableOpacity>
          )}
          {!hasReacted && (
            <TouchableOpacity
              onPress={onTogglePicker}
              style={styles.cardActionBtn}
            >
              <Ionicons
                name="happy-outline"
                size={20}
                color={Colors.gray[100]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!pickerOpen && (
        <View style={styles.cardBottomRow}>
          <Text style={styles.cardTime}>{record.time}</Text>
          <View style={styles.reactionRow}>
            {record.reactions.map((r) => (
              <View key={r.emoji} style={styles.reactionPill}>
                <Text style={styles.reactionText}>
                  {r.emoji} {r.count}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {pickerOpen && (
        <TouchableOpacity
          style={styles.emojiOverlayWrapper}
          onPress={onTogglePicker}
          activeOpacity={1}
        >
          <TouchableOpacity
            style={styles.emojiOverlay}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.emojiTopSection}>
              <TouchableOpacity onPress={onOpenKkimoji}>
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={Colors.gray[300]}
                />
              </TouchableOpacity>

              {customGroupEmojis.map((item) => (
                <Animated.View
                  key={item.emoji_id}
                  style={[styles.emojiCurrentItem, isDeleteMode && wiggleStyle]}
                >
                  <Pressable
                    onLongPress={() => setIsDeleteMode(true)}
                    onPress={() => {
                      if (isDeleteMode) {
                        setIsDeleteMode(false);
                      } else {
                        onAddReaction(item.emoji_code);
                      }
                    }}
                  >
                    {item.imageUrl ? (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.customEmojiImage}
                        contentFit="cover"
                      />
                    ) : (
                      <Text style={styles.emojiCurrentText}>{item.label}</Text>
                    )}
                  </Pressable>

                  {isDeleteMode && (
                    <TouchableOpacity
                      style={styles.emojiCloseBtn}
                      onPress={() => onDeleteCustomEmoji?.(item.emoji_id)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={14}
                        color={Colors.gray[200]}
                      />
                    </TouchableOpacity>
                  )}
                </Animated.View>
              ))}
            </View>

            <View style={styles.emojiDivider} />

            <View style={styles.emojiGrid}>
              {systemEmojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji.emoji_code}
                  style={styles.emojiOption}
                  onPress={() => onAddReaction(emoji.emoji_code)}
                >
                  <Text style={styles.emojiOptionText}>{emoji.display}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.main[100],
  },
  cardPlaceholder: { backgroundColor: Colors.gray[800] },
  cardTopRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  cardAvatarRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray[100],
  },
  cardName: { ...Typography.caption[1], color: Colors.gray[100] },
  cardActions: { flexDirection: "row", gap: 6 },
  cardActionBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.gray[300],
    alignItems: "center",
    justifyContent: "center",
  },
  cardBottomRow: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTime: { ...Typography.caption[1], color: Colors.gray[100] },
  reactionRow: { flexDirection: "row", gap: 4 },
  reactionPill: {
    backgroundColor: Colors.gray[900],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  reactionText: { ...Typography.caption[2], color: Colors.gray[100] },
  emojiOverlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    backgroundColor: `${Colors.gray[1000]}CC`,
  },
  emojiOverlay: {
    width: "90%",
    backgroundColor: Colors.gray[900],
    borderRadius: 16,
  },
  emojiTopSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  emojiCurrentItem: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiCurrentText: { ...Typography.title.xs },
  customEmojiImage: { width: 28, height: 28, borderRadius: 14 },
  emojiCloseBtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  emojiDivider: { height: 1, backgroundColor: Colors.gray[700] },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignContent: "center",
    justifyContent: "space-between",
    rowGap: 6,
  },
  emojiOption: {
    width: "30%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiOptionText: { ...Typography.title.m },
});
