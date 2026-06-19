import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

/**
 * Horizontal step indicator used during onboarding.
 * Each step renders as a circle; the active step and
 * completed steps are highlighted with the accent color.
 */
export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  const safeTotal = Math.max(1, totalSteps);
  const safeCurrent = Math.min(Math.max(1, currentStep), safeTotal);

  return (
    <View style={styles.container}>
      {Array.from({ length: safeTotal }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === safeCurrent;
        const isCompleted = stepNumber < safeCurrent;

        const circleStyle = isCompleted
          ? [styles.circle, styles.circleCompleted]
          : isActive
            ? [styles.circle, styles.circleActive]
            : styles.circle;

        const showLine = index < safeTotal - 1;
        const lineActive = isCompleted;

        return (
          <View key={stepNumber} style={styles.stepWrapper}>
            <View style={circleStyle}>
              {isCompleted ? (
                <Text style={styles.checkIcon}>✓</Text>
              ) : (
                <Text
                  style={[styles.stepNumber, isActive && styles.stepNumberActive]}>
                  {stepNumber}
                </Text>
              )}
            </View>

            {showLine && (
              <View style={[styles.connector, lineActive && styles.connectorActive]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const CIRCLE_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: '#f59e0b',
  },
  circleCompleted: {
    backgroundColor: '#22c55e',
  },
  stepNumber: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
  },
  stepNumberActive: {
    color: '#0f0f0f',
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  connector: {
    width: 24,
    height: 2,
    backgroundColor: '#374151',
    marginHorizontal: 4,
  },
  connectorActive: {
    backgroundColor: '#22c55e',
  },
});
