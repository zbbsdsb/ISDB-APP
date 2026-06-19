import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { useSwipe } from '../hooks/use-swipe';
import { SwipeCard } from '../components/swipe/swipe-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function SwipeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { getProfile } = useProfile();
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  const {
    cards,
    currentIndex,
    loading,
    error,
    isTransitioning,
    canUndo,
    fetchCards,
    handleSwipe,
    undoSwipe,
  } = useSwipe(user?.id || '', userSkills, userInterests);

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        const profile = await getProfile(user.id);
        if (profile) {
          setUserSkills(profile.skills || []);
          setUserInterests(profile.interests || []);
        }
      }
    };
    loadProfile();
  }, [user?.id, getProfile]);

  useEffect(() => {
    if (userSkills.length > 0 || userInterests.length > 0) {
      fetchCards();
    }
  }, [userSkills, userInterests]);

  const progress = `${currentIndex + 1} / ${cards.length}`;

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Text style={[styles.title, { color: colors.text }]}>
            Sign in required
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Please sign in to discover projects
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Finding projects for you...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCards}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Discover Projects
          </Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.celebration}>🎉</Text>
          <Text style={[styles.completedTitle, { color: colors.text }]}>
            All caught up!
          </Text>
          <Text style={[styles.completedText, { color: colors.textSecondary }]}>
            You've seen all available projects. Create your own project or check back later!
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchCards}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.text }]}>
            Discover Projects
          </Text>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            {progress}
          </Text>
        </View>
        {canUndo && (
          <TouchableOpacity
            style={styles.undoButton}
            onPress={undoSwipe}
            disabled={isTransitioning}
          >
            <Text style={styles.undoButtonText}>↩ Undo</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContainer}>
        {cards.slice(currentIndex, currentIndex + 2).map((card, index) => {
          const isTopCard = index === 0;
          const offset = index * 8;
          const scale = 1 - index * 0.05;
          const opacity = 1 - index * 0.2;

          return (
            <View
              key={card.project.id}
              style={[
                styles.cardWrapper,
                {
                  zIndex: 2 - index,
                  opacity,
                  transform: [{ scale }, { translateY: offset }],
                },
              ]}
            >
              {isTopCard ? (
                <SwipeCard
                  card={card}
                  onSwipe={handleSwipe}
                  disabled={isTransitioning}
                />
              ) : (
                <View style={styles.backgroundCard}>
                  <SwipeCard card={card} onSwipe={() => {}} disabled />
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.dots}>
        {cards.slice(Math.max(0, currentIndex - 4), currentIndex + 5).map((_, index) => {
          const actualIndex = Math.max(0, currentIndex - 4) + index;
          const isActive = actualIndex === currentIndex;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isActive ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          );
        })}
      </View>

      <View style={styles.instructions}>
        <View style={styles.instruction}>
          <View style={[styles.instructionIcon, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
            <Text style={styles.instructionArrow}>←</Text>
          </View>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>Pass</Text>
        </View>
        <View style={styles.instruction}>
          <View style={[styles.instructionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
            <Text style={styles.instructionArrow}>↓</Text>
          </View>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>Save</Text>
        </View>
        <View style={styles.instruction}>
          <View style={[styles.instructionIcon, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
            <Text style={styles.instructionArrow}>→</Text>
          </View>
          <Text style={[styles.instructionText, { color: colors.textSecondary }]}>Match</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progress: {
    fontSize: 14,
    marginTop: 4,
  },
  undoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  undoButtonText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  celebration: {
    fontSize: 64,
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardWrapper: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
  },
  backgroundCard: {
    opacity: 0.5,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#f59e0b',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
  },
  instructions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  instruction: {
    alignItems: 'center',
    gap: 6,
  },
  instructionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionArrow: {
    fontSize: 20,
    color: '#ffffff',
  },
  instructionText: {
    fontSize: 12,
  },
});
