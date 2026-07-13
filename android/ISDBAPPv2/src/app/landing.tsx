import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {Button, Card} from '../components/ui';
import {m3Typography} from '../constants/m3-typography';
import {m3Spacing} from '../constants/m3-spacing';

const QUOTES = [
  {
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
  },
  {
    text: 'What I cannot create, I do not understand.',
    author: 'Richard Feynman',
  },
  {
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
  },
  {
    text: "If you want to build a ship, don't drum up people to collect wood, but rather teach them to long for the endless immensity of the sea.",
    author: 'Antoine de Saint-Exupéry',
  },
  {
    text: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
  },
  {
    text: 'We are all apprentices in a craft where no one ever becomes a master.',
    author: 'Ernest Hemingway',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create Profile',
    subtitle: 'Showcase your skills and passions',
  },
  {
    step: '02',
    title: 'Discover Projects',
    subtitle: 'Swipe through insane ideas',
  },
  {
    step: '03',
    title: 'Build Together',
    subtitle: 'Collaborate and ship products',
  },
];

export function LandingScreen() {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation();

  // ── Quote carousel state ──
  const [quoteIndex, setQuoteIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ── Gradient animation ──
  const gradientAnim = useRef(new Animated.Value(0)).current;

  const currentQuote = QUOTES[quoteIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setQuoteIndex(prev => (prev + 1) % QUOTES.length);
        slideAnim.setValue(20);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim]);

  // Subtle background gradient shift
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [gradientAnim]);

  const bgOpacity = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.02, 0.06],
  });

  const handleGetStarted = () => {
    navigation.navigate('Auth' as never);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.gradientOverlay,
          {
            backgroundColor: colors.primary,
            opacity: bgOpacity,
          },
        ]}
      />
      <View style={styles.content}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* Brand area */}
        <View style={styles.brandArea}>
          <Text style={[styles.brandIcon, {color: colors.primary}]}>✦</Text>
          <Text style={[styles.brandName, {color: colors.primary}]}>ISDB</Text>
          <Text style={[styles.brandFull, {color: colors.onBackground}]}>
            Insane Dream Builder
          </Text>
          <Text style={[styles.brandTagline, {color: colors.onSurfaceVariant}]}>
            Build Something Insane
          </Text>
        </View>

        {/* Quote card */}
        <Animated.View
          style={[
            styles.quoteWrapper,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Card variant="elevated" padding={m3Spacing.lg}>
            <Text style={[styles.quoteText, {color: colors.onSurface}]}>
              "{currentQuote.text}"
            </Text>
            <Text
              style={[styles.quoteAuthor, {color: colors.onSurfaceVariant}]}>
              — {currentQuote.author}
            </Text>
          </Card>
        </Animated.View>

        {/* How it Works */}
        <View style={styles.howSection}>
          {HOW_IT_WORKS.map((item, idx) => (
            <View key={item.step} style={styles.howRow}>
              <Text style={[styles.howStep, {color: colors.primary}]}>
                {item.step}
              </Text>
              <View style={styles.howContent}>
                <Text style={[styles.howTitle, {color: colors.onBackground}]}>
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.howSubtitle,
                    {color: colors.onSurfaceVariant},
                  ]}>
                  {item.subtitle}
                </Text>
              </View>
              {idx < HOW_IT_WORKS.length - 1 && (
                <View
                  style={[
                    styles.howLine,
                    {backgroundColor: colors.outlineVariant},
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Bottom actions */}
        <View style={styles.actions}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="filled"
            size="lg"
            fullWidth
          />
          <Text style={[styles.terms, {color: colors.onSurfaceVariant}]}>
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingHorizontal: m3Spacing.lg,
    justifyContent: 'space-between',
  },
  topSpacer: {
    flex: 0.1,
  },
  brandArea: {
    alignItems: 'center',
  },
  brandIcon: {
    fontSize: 48,
    marginBottom: m3Spacing.sm,
  },
  brandName: {
    ...m3Typography.displaySmall,
    fontWeight: '700',
    letterSpacing: 6,
    marginBottom: m3Spacing.xs,
  },
  brandFull: {
    ...m3Typography.titleLarge,
    textAlign: 'center',
  },
  brandTagline: {
    ...m3Typography.bodyLarge,
    marginTop: m3Spacing.xs,
    textAlign: 'center',
  },
  quoteWrapper: {
    flex: 0.8,
    justifyContent: 'center',
    paddingHorizontal: m3Spacing.sm,
  },
  quoteText: {
    ...m3Typography.bodyLarge,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAuthor: {
    ...m3Typography.labelLarge,
    marginTop: m3Spacing.sm,
    textAlign: 'right',
  },
  howSection: {
    flex: 0.6,
    paddingHorizontal: m3Spacing.sm,
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: m3Spacing.sm,
    position: 'relative',
  },
  howStep: {
    ...m3Typography.titleMedium,
    fontWeight: '700',
    width: 32,
    fontFamily: 'monospace',
  },
  howContent: {
    marginLeft: m3Spacing.sm,
  },
  howTitle: {
    ...m3Typography.labelLarge,
    fontWeight: '600',
  },
  howSubtitle: {
    ...m3Typography.bodySmall,
    marginTop: 2,
  },
  howLine: {
    position: 'absolute',
    left: 14,
    top: 30,
    width: 2,
    height: 24,
  },
  actions: {
    marginBottom: m3Spacing.xl,
    gap: m3Spacing.sm,
  },
  terms: {
    ...m3Typography.bodySmall,
    textAlign: 'center',
    marginTop: m3Spacing.xs,
  },
});
