import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {Icon} from './icon';
import {m3Typography} from '../../constants/m3-typography';
import {m3Spacing} from '../../constants/m3-spacing';
import {m3Shape} from '../../constants/m3-shape';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  style?: ViewStyle;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  style,
}: SelectProps) {
  const {colors} = useTheme();
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(o => o.value === value);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, {color: colors.onBackground}]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.outline,
          },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.triggerText,
            {
              color: selectedOption
                ? colors.onBackground
                : colors.onSurfaceVariant,
            },
          ]}
          numberOfLines={1}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon name="arrowDown" size="sm" color={colors.onSurfaceVariant} />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}>
          <View
            style={[
              styles.dropdown,
              {backgroundColor: colors.surface, borderColor: colors.outline},
            ]}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({item}) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      {
                        backgroundColor: isSelected
                          ? colors.primaryContainer
                          : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}>
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected
                            ? colors.onPrimaryContainer
                            : colors.onSurface,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}>
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Icon name="check" size="sm" color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: m3Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: m3Shape.small,
    paddingHorizontal: m3Spacing.sm,
    paddingVertical: 12,
    minHeight: 48,
  },
  triggerText: {
    ...m3Typography.bodyMedium,
    flex: 1,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: m3Spacing.lg,
  },
  dropdown: {
    maxHeight: 320,
    borderRadius: m3Shape.medium,
    borderWidth: 1,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: m3Spacing.md,
    paddingVertical: 12,
  },
  optionText: {
    ...m3Typography.bodyMedium,
  },
});
