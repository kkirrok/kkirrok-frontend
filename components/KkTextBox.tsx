import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, KeyboardTypeOptions } from 'react-native';

type KkTextBoxProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  type?: 'text' | 'date';
  rightButton?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  style?: ViewStyle;
  inputStyle?: TextStyle;
};

export default function KkTextBox({
  label,
  value,
  onChangeText,
  placeholder,
  disabled = false,
  error,
  type = 'text',
  rightButton,
  secureTextEntry = false,
  keyboardType,
  style,
  inputStyle,
}: KkTextBoxProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused || value.length > 0;
  const hasError = !!error;

  const borderColor = hasError
    ? '#F6623B'
    : isActive
    ? '#F6623B'
    : '#A49289';

  const renderInput = () => {
    if (type === 'date') {
      return (
        <TouchableOpacity style={styles.inputWrapper} disabled={disabled}>
          <Text
            style={[
              styles.dateText,
              !value && styles.placeholder,
            ]}
          >
            {value || placeholder || '생년월일'}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!disabled}
        placeholderTextColor="#C7C7C7"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.textInput, inputStyle]}
      />
    );
  };

  return (
    <View style={style}>
    {label && <Text style={styles.label}>{label}</Text>}
    <View style={styles.row}>
      <View
        style={[
          styles.container,
          { borderColor },
          disabled && styles.disabled,
        ]}
      >
        {type === 'date' ? renderInput() : (
          <View style={styles.inputWrapper}>
            {renderInput()}
          </View>
        )}
      </View>
      {rightButton && (  
        <View style={styles.buttonWrapper}>
          {rightButton}
        </View>
      )}
    </View>
    {isActive && hasError && (
      <Text style={styles.errorText}>{error}</Text>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#FDFCFC',
  },
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    height: 48,
    backgroundColor: '#FDFCFC1A',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: '#FDFCFC',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 0,
    flex: 1,
  },
  buttonWrapper: {
    marginLeft: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#FDFCFC',
  },
  placeholder: {
    fontSize: 16,
    color: '#E7E2DF',
  },
  disabled: {
    backgroundColor: '#F2F2F2',
    borderColor: '#E0E0E0',
  },
  errorText: {
    paddingTop: 8,
    fontSize: 12,
    color: '#FFEFEB',
  },
});