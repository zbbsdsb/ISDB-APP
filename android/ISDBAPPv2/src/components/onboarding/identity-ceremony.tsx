import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import {Button} from '../../components/ui';
import {Text} from '../../components/ui/text';
import {m3Typography} from '../../constants/m3-typography';
import {m3Spacing} from '../../constants/m3-spacing';

interface IdentityCeremonyProps {
  builderId: number;
  username: string;
  onComplete: () => void;
}

function formatIdentityNumber(num: number): string {
  return `#${num.toString().padStart(6, '0')}`;
}

export function IdentityCeremony({
  builderId,
  username,
  onComplete,
}: IdentityCeremonyProps) {
  const {colors} = useTheme();
  const [, setShowCard] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;

  const accentColor = colors.primary;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowCard(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          setShowContent(true);
          Animated.timing(contentFade, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              setShowButton(true);
              Animated.parallel([
                Animated.timing(buttonFade, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.spring(buttonSlide, {
                  toValue: 0,
                  tension: 100,
                  friction: 10,
                  useNativeDriver: true,
                }),
              ]).start();
            }, 800);
          });
        }, 500);
      });
    }, 500);
    return () => clearTimeout(timer1);
  }, [fadeAnim, scaleAnim, contentFade, buttonFade, buttonSlide]);

  const handleEnter = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: accentColor + '4D',
            shadowColor: accentColor,
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Text style={[styles.headerLabel, {color: accentColor + '80'}]} variant="label">
          Insane Dream Builder
        </Text>
        <Text style={[styles.memberLabel, {color: accentColor}]} variant="label">
          🏅 OFFICIAL MEMBER CARD
        </Text>

        <View style={[styles.divider, {backgroundColor: accentColor + '33'}]} />

        {showContent && (
          <Animated.View style={[styles.content, {opacity: contentFade}]}>
            <View style={styles.row}>
                <Text style={[styles.rowLabel, {color: accentColor + '80'}]} variant="label">
                  Builder ID
                </Text>
                <Text style={[styles.builderId, {color: accentColor}]} variant="title">
                  {formatIdentityNumber(builderId)}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.rowLabel, {color: accentColor + '80'}]} variant="label">
                  Username
                </Text>
                <Text style={[styles.rowValue, {color: colors.onSurface}]} variant="body">
                  @{username}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.rowLabel, {color: accentColor + '80'}]} variant="label">
                  Member Since
                </Text>
                <Text style={[styles.rowValue, {color: colors.onSurface}]} variant="body">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.rowLabel, {color: accentColor + '80'}]} variant="label">
                  Skills
                </Text>
                <Text style={[styles.rowValue, {color: colors.onSurface}]} variant="body">
                  Registered
                </Text>
            </View>
          </Animated.View>
        )}

        <View style={[styles.divider, {backgroundColor: accentColor + '33'}]} />

        <Text style={[styles.quote, {color: accentColor + '66'}]} variant="body">
          "Build Something Insane"
        </Text>

        <View style={styles.verified}>
          <Text style={[styles.verifiedIcon, {color: accentColor + '4D'}]} variant="caption">
            ✓
          </Text>
          <Text style={[styles.verifiedText, {color: accentColor + '4D'}]} variant="label">
            Verified Member
          </Text>
        </View>
      </Animated.View>

      {showButton && (
        <Animated.View
          style={[
            styles.buttonContainer,
            {opacity: buttonFade, transform: [{translateY: buttonSlide}]},
          ]}>
          <Button
            title="Enter Dream Builder"
            onPress={handleEnter}
            variant="filled"
            fullWidth
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: m3Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 1,
    padding: m3Spacing.xl,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
  },
  headerLabel: {
    ...m3Typography.labelSmall,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: m3Spacing.xs,
  },
  memberLabel: {
    ...m3Typography.labelLarge,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: m3Spacing.md,
  },
  divider: {height: 1, marginVertical: m3Spacing.md},
  content: {gap: m3Spacing.sm},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    ...m3Typography.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  builderId: {
    ...m3Typography.titleLarge,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  rowValue: {...m3Typography.bodyMedium, fontWeight: '500'},
  quote: {...m3Typography.bodySmall, fontStyle: 'italic', textAlign: 'center'},
  verified: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: m3Spacing.sm,
  },
  verifiedIcon: {fontSize: 12},
  verifiedText: {...m3Typography.labelSmall, letterSpacing: 1},
  buttonContainer: {marginTop: m3Spacing.xl, width: '100%', maxWidth: 340},
});
