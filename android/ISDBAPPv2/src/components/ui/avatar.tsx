import React from 'react';
import {View, Image, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../hooks/use-theme';

interface AvatarProps {
  source?: {uri: string} | null;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({source, size = 40, style}: AvatarProps) {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
        },
        style,
      ]}>
      {source?.uri ? (
        <Image source={source} style={styles.image} />
      ) : (
        <View style={styles.fallback}>
          <AvatarFallbackText size={size} />
        </View>
      )}
    </View>
  );
}

function AvatarFallbackText({size}: {size: number}) {
  const {colors} = useTheme();

  return (
    <View style={styles.fallbackContainer}>
      <View style={[styles.fallbackText, {width: size, height: size}]}>
        <View style={styles.centerFill}>
          <View
            style={[
              styles.initials,
              {
                backgroundColor: colors.primary,
                width: size * 0.7,
                height: size * 0.7,
                borderRadius: (size * 0.7) / 2,
              },
            ]}>
            <View style={styles.centerFill}>
              <View
                style={[
                  styles.centerContent,
                  {
                    width: size * 0.5,
                    height: size * 0.5,
                    borderRadius: (size * 0.5) / 2,
                    backgroundColor: colors.secondary,
                  },
                ]}>
                <View
                  style={{
                    width: size * 0.3,
                    height: size * 0.3,
                    borderRadius: (size * 0.3) / 2,
                    backgroundColor: colors.tertiary,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
