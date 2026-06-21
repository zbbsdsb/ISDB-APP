import React, {useState} from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {m3Shape} from '../../constants/m3-shape';

interface TextareaProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Textarea({
  label,
  error,
  containerStyle,
  style,
  ...props
}: TextareaProps) {
  const {colors} = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) {return colors.error;}
    if (isFocused) {return colors.primary;}
    return colors.outline;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, {color: colors.onBackground}]}>
          {label}
        </Text>
      )}
      <RNTextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: getBorderColor(),
            color: colors.onBackground,
          },
          style,
        ]}
        placeholderTextColor={colors.onSurfaceVariant}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: m3Shape.small,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
