import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type ButtonSize = 'large' | 'small' | 'tag';

type Props = {
  title: string;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const getColors = (size: ButtonSize, disabled: boolean) => {
  if (!disabled) {
    return {
      backgroundColor: '#F6623B',
      textColor: '#FDFCFC',
    };
  }

  if (size === 'small') {
    return {
      backgroundColor: '#A49289',
      textColor: '#D0C7C2',
    };
  }

  return {
    backgroundColor: '#372E2A',
    textColor: '#BAADA6',
  };
};

export default function KkButton({
  title,
  size = 'large',
  disabled = false,
  onPress,
  style,
  textStyle,
}: Props) {
  const { backgroundColor, textColor } = getColors(size, disabled);
  const isActive = backgroundColor === '#F6623B';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        size === 'large'
          ? styles.large
          : size === 'small'
            ? styles.small
            : styles.tag,
        { backgroundColor },
        isActive && styles.shadow,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'small' && styles.textSmall,
          size === 'tag' && styles.textTag,
          { color: textColor },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  large: {
    height: 52,
    width: '100%',
  },
  small: {
    height: 48,
    minWidth: 104,
    paddingHorizontal: 15.5,
  },
  tag: {
    height: 42,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16, 
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 16,
  },
  textTag: {
    fontSize: 13,
  },
  shadow: {
    shadowColor: '#FF8868',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,

    elevation: 5, // Android용
  },
});