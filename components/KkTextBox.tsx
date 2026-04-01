import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';

type KkTextBoxProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string; 
  type?: 'text' | 'date';
  rightButton?: React.ReactNode; 
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.textInput, inputStyle]}
      />
    );
  };

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.container,
          { borderColor },
          disabled && styles.disabled,
        ]}
      >
        <View style={styles.row}>
          {type === 'date' ? (
            renderInput()
          ) : (
            <View style={styles.inputWrapper}>
              {renderInput()}
            </View>
          )}

          {rightButton && (
            <View style={styles.buttonWrapper}>
              {rightButton}
            </View>
          )}
        </View>
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
    fontWeight: "600",
    color: '#FDFCFC',
  },
  container: {
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 8,
    backgroundColor: '#FDFCFC1A',
    height: 48,
    justifyContent: 'center',
  },
  textInput: {   
    fontSize: 16,
    flex: 1,
    color: '#FDFCFC'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 12,
    color: '#FFEFEB',
  },
  
});