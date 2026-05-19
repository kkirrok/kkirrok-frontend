import KkButton from "@/components/KkButton";
import KkModal from "@/components/KkModal";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NutrientInput from "./NutrientInput";
import { styles } from "./QuickAddFoodSheet.styles";

type MealType = "아침" | "점심" | "저녁" | "간식";
const MEAL_TYPES: MealType[] = ["아침", "점심", "저녁", "간식"];

type FormData = {
  mealType: MealType;
  name: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  sugar: string;
  sodium: string;
};

const INITIAL_FORM: FormData = {
  mealType: "아침",
  name: "",
  calories: "",
  carbs: "",
  protein: "",
  fat: "",
  sugar: "",
  sodium: "",
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => void;
};

export default function QuickAddFoodSheet({
  visible,
  onClose,
  onSubmit,
}: Props) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [showExitModal, setShowExitModal] = useState(false);

  const isAllFilled = (Object.keys(INITIAL_FORM) as (keyof FormData)[])
    .filter((k) => k !== "mealType")
    .every((k) => form[k] !== "");

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: false,
        damping: 22,
        stiffness: 220,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 220,
        useNativeDriver: false,
      }).start(() => setForm(INITIAL_FORM));
    }
  }, [visible, slideAnim]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardOffset, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === "ios" ? e.duration : 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === "ios" ? e.duration : 200,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardOffset]);

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    if (isAllFilled) {
      setShowExitModal(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    onSubmit?.(form);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={handleClose}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + 16 },
            { transform: [{ translateY: slideAnim }] },
            { marginBottom: keyboardOffset },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>음식 간단하게 추가하기</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={24} color="#FDFCFC" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            {MEAL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.tab, form.mealType === type && styles.tabActive]}
                onPress={() => set("mealType")(type)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    form.mealType === type && styles.tabTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formContainer}>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>식사명</Text>
              <View style={styles.inputBox}>
                <TextInput
                  value={form.name}
                  onChangeText={set("name")}
                  placeholder="예: 된장찌개, 닭가슴살샐러드"
                  placeholderTextColor="#D0C7C2"
                  style={styles.baseInput}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>칼로리</Text>
              <View style={[styles.inputBox, styles.calorieBox]}>
                <TextInput
                  value={form.calories}
                  onChangeText={set("calories")}
                  keyboardType="numeric"
                  style={[styles.baseInput, styles.calorieInput]}
                  placeholderTextColor="#D0C7C2"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
                <Text style={styles.calorieUnit}>kcal</Text>
              </View>
            </View>

            <View style={styles.nutrientRow}>
              <NutrientInput
                label="탄수화물"
                value={form.carbs}
                onChange={set("carbs")}
                unit="g"
              />
              <NutrientInput
                label="단백질"
                value={form.protein}
                onChange={set("protein")}
                unit="g"
              />
              <NutrientInput
                label="지방"
                value={form.fat}
                onChange={set("fat")}
                unit="g"
              />
            </View>

            <View style={styles.nutrientRow}>
              <NutrientInput
                label="당"
                value={form.sugar}
                onChange={set("sugar")}
                unit="g"
              />
              <NutrientInput
                label="나트륨"
                value={form.sodium}
                onChange={set("sodium")}
                unit="mg"
              />
              <View style={styles.nutrientSpacer} />
            </View>

            <KkButton
              title="끼록하기"
              disabled={!isAllFilled}
              onPress={handleSubmit}
              style={{ marginTop: 24 }}
            />
          </View>
        </Animated.View>
      </View>

      <KkModal
        visible={showExitModal}
        onClose={() => setShowExitModal(false)}
        message={"간편 추가 중이에요.\n지금 나가면 작성된 정보가 사라져요."}
        buttonText="계속 작성하기"
        onButtonPress={() => setShowExitModal(false)}
        cancelText="나가기"
        onCancelPress={() => {
          setShowExitModal(false);
          onClose();
        }}
      />
    </Modal>
  );
}
