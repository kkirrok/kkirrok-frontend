import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { CheckIcon } from './icons/CheckIcon';
import { PlusIcon } from './icons/PlusIcon';

type ButtonSize = 'large' | 'small' | 'tag' | 'roundedSmall';
type ButtonVariant = 'active' | 'inactive';

type Props = {
  title: string;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  selected?: boolean;
  showIcon?: boolean;
  variant?: ButtonVariant;
};

const getColors = (size: ButtonSize, disabled: boolean, selected?: boolean, variant?: ButtonVariant) => {
  if (size === 'roundedSmall') {
    if (variant === 'active') {
      return { backgroundColor: '#F6623B', textColor: '#FDFCFC' };
    }
    if (variant === 'inactive') {
      return { backgroundColor: '#A49289', textColor: '#E7E2DF' };
    }
  }

  if (size === 'tag') {
    if (selected) {
      return {
        backgroundColor: '#F6623B', 
        textColor: '#FDFCFC',
      };
    } else {
      return {
        backgroundColor: '#372E2A', 
        textColor: '#E7E2DF',
      };
    }
  }

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
  selected = false,
  showIcon = false,
  variant = 'inactive'
}: Props) {
  const { backgroundColor, textColor } = getColors(size, disabled, selected, variant);
  const isActive = backgroundColor === '#F6623B';
  const shouldShowIcon = size === 'tag' && showIcon;

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
            : size === 'roundedSmall'
              ? styles.roundedSmall
              : styles.tag,
        { backgroundColor },
        isActive && styles.shadow,
        style,
      ]}
    >
      <View style={styles.inner}>
        {shouldShowIcon && (
          <View style={styles.icon}>
            {selected ? <CheckIcon /> : <PlusIcon />}
          </View>
        )}
        <Text
          style={[
            styles.text,
            (size === 'small' || size === 'roundedSmall') && styles.textSmall,
            size === 'tag' && styles.textTag,
            { color: textColor },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
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
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  roundedSmall: {
    height: 48,
    paddingHorizontal: 15.5,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  textSmall: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },
  textTag: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },
  shadow: {
    shadowColor: '#FF8868',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,

    elevation: 5, // Android용
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
    alignItems: 'center',
  },
});