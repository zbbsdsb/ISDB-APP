import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/use-theme';
import { useSwipe } from '../hooks/use-swipe';
import { Button, Card, Icon } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import { m3Shape } from '../constants/m3-shape';
import type { RootStackParamList } from '../navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function SwipeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { projects, loading, error, currentIndex, loadProjects, submitSwipe, undoLastSwipe, canUndo } = useSwipe();

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const currentProject = projects[currentIndex];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !swiping,
    onPanResponderGrant: () => {
      Animated.spring(scale, { toValue: 1.02, useNativeDriver: true }).start();
    },
    onPanResponderMove: (_, gesture) => {
      pan.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: async (_, gesture) => {
      if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
        const action = gesture.dx > 0 ? 'save' : 'pass';
        setSwiping(true);
        // Animate card off screen
        Animated.timing(pan, {
          toValue: { x: gesture.dx > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5, y: 0 },
          duration: 250,
          useNativeDriver: true,
        }).start(async () => {
          await submitSwipe(currentProject.id, action as any);
          pan.setValue({ x: 0, y: 0 });
          scale.setValue(1);
          setSwiping(false);
        });
      } else {
        // Return to center
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
      }
    },
  });

  const handleMatch = async () => {
    if (!currentProject || swiping) return;
    setSwiping(true);
    Animated.timing(pan, {
      toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(async () => {
      await submitSwipe(currentProject.id, 'match');
      pan.setValue({ x: 0, y: 0 });
      scale.setValue(1);
      setSwiping(false);
    });
  };

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.4],
    outputRange: [0, 1],
  });
  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.4, 0],
    outputRange: [1, 0],
  });

  const renderCard = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
            Loading projects...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <Button title="Retry" onPress={loadProjects} variant="text" />
        </View>
      );
    }

    if (!currentProject) {
      return (
        <View style={styles.centerContent}>
          <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
            No more projects to discover!
          </Text>
          <Button title="Refresh" onPress={loadProjects} variant="filled" icon={<Icon name="plus" size="sm" color={colors.onPrimary} />} />
        </View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Like / Nope overlays */}
        <Animated.View style={[styles.overlayBadge, styles.likeBadge, { opacity: likeOpacity, borderColor: '#22c55e' }]}>
          <Text style={[styles.overlayText, { color: '#22c55e' }]}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.overlayBadge, styles.nopeBadge, { opacity: nopeOpacity, borderColor: '#ef4444' }]}>
          <Text style={[styles.overlayText, { color: '#ef4444' }]}>NOPE</Text>
        </Animated.View>

        {/* Card content */}
        <Card variant="elevated" padding={m3Spacing.lg} style={styles.cardContent}>
          <Text style={[styles.projectTitle, { color: colors.onBackground }]}>
            {currentProject.title}
          </Text>
          {currentProject.hook_text && (
            <Text style={[styles.hookText, { color: colors.primary }]}>
              {currentProject.hook_text}
            </Text>
          )}
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]} numberOfLines={6}>
            {currentProject.description}
          </Text>

          {/* Tags */}
          {currentProject.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {currentProject.tags.slice(0, 5).map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.secondaryContainer }]}>
                  <Text style={[styles.tagText, { color: colors.onSecondaryContainer }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Owner */}
          {currentProject.owner && (
            <View style={styles.ownerRow}>
              <View style={[styles.ownerDot, { backgroundColor: colors.primary }]}>
                <Text style={[styles.ownerDotText, { color: colors.onPrimary }]}>
                  {(currentProject.owner.display_name || currentProject.owner.username || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.ownerName, { color: colors.onSurfaceVariant }]}>
                {currentProject.owner.display_name || currentProject.owner.username}
              </Text>
            </View>
          )}

          {/* Learn more button */}
          <TouchableOpacity
            style={styles.learnMore}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: currentProject.id })}
          >
            <Text style={[styles.learnMoreText, { color: colors.primary }]}>
              View Details →
            </Text>
          </TouchableOpacity>
        </Card>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.onBackground }]}>Discover</Text>
        {canUndo && (
          <Button title="Undo" onPress={undoLastSwipe} variant="text" size="sm" />
        )}
      </View>
      <View style={styles.cardArea}>
        {renderCard()}
      </View>
      {/* Action buttons */}
      {currentProject && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: '#ef4444' }]}
            onPress={() => {
              if (!swiping) {
                setSwiping(true);
                Animated.timing(pan, {
                  toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
                  duration: 200, useNativeDriver: true,
                }).start(async () => {
                  await submitSwipe(currentProject.id, 'pass');
                  pan.setValue({ x: 0, y: 0 });
                  setSwiping(false);
                });
              }
            }}
          >
            <Icon name="close" size="md" color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: '#3b82f6' }]}
            onPress={() => {
              if (!swiping) {
                setSwiping(true);
                Animated.timing(pan, {
                  toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
                  duration: 200, useNativeDriver: true,
                }).start(async () => {
                  await submitSwipe(currentProject.id, 'save');
                  pan.setValue({ x: 0, y: 0 });
                  setSwiping(false);
                });
              }
            }}
          >
            <Icon name="check" size="md" color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={handleMatch}
          >
            <Text style={{ color: colors.onPrimary, fontSize: 24 }}>⚡</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: m3Spacing.lg, paddingVertical: m3Spacing.md,
  },
  title: { ...m3Typography.headlineSmall },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: m3Spacing.md },
  card: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 0.72,
  },
  cardContent: { flex: 1 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: m3Spacing.md },
  loadingText: { ...m3Typography.bodyLarge },
  errorText: { ...m3Typography.bodyLarge },
  emptyText: { ...m3Typography.titleMedium, textAlign: 'center', marginBottom: m3Spacing.md },
  projectTitle: { ...m3Typography.headlineSmall, marginBottom: m3Spacing.xs },
  hookText: { ...m3Typography.titleSmall, fontStyle: 'italic', marginBottom: m3Spacing.sm },
  description: { ...m3Typography.bodyMedium, marginBottom: m3Spacing.md },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: m3Spacing.xs, marginBottom: m3Spacing.md },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: m3Shape.small },
  tagText: { ...m3Typography.labelSmall },
  ownerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: m3Spacing.sm },
  ownerDot: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: m3Spacing.xs },
  ownerDotText: { fontSize: 10, fontWeight: '700' },
  ownerName: { ...m3Typography.labelMedium },
  learnMore: { marginTop: m3Spacing.xs },
  learnMoreText: { ...m3Typography.labelLarge },
  overlayBadge: {
    position: 'absolute', top: 20, zIndex: 10,
    borderWidth: 3, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    transform: [{ rotate: '-15deg' }],
  },
  likeBadge: { left: 20 },
  nopeBadge: { right: 20 },
  overlayText: { fontSize: 24, fontWeight: '800' },
  actionRow: {
    flexDirection: 'row', justifyContent: 'center', gap: m3Spacing.lg,
    paddingVertical: m3Spacing.xl, paddingBottom: m3Spacing.xxl,
  },
  actionBtn: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2,
  },
});
