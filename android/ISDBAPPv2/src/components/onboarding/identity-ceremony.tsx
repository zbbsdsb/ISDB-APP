import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

interface IdentityCeremonyProps {
  builderId: number;
  username: string;
  onComplete: () => void;
}

function formatIdentityNumber(num: number): string {
  return `#${num.toString().padStart(6, '0')}`;
}

export function IdentityCeremony({ builderId, username, onComplete }: IdentityCeremonyProps) {
  const [showCard, setShowCard] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Stage 1: Show card with animation
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
        // Stage 2: Show content
        setTimeout(() => {
          setShowContent(true);
          Animated.timing(contentFade, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            // Stage 3: Show button
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
  }, []);

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
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.headerLabel}>Insane Dream Builder</Text>
        <Text style={styles.memberLabel}>🏅 OFFICIAL MEMBER CARD</Text>

        <View style={styles.divider} />

        {showContent && (
          <Animated.View style={[styles.content, { opacity: contentFade }]}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Builder ID</Text>
              <Text style={styles.builderId}>
                {formatIdentityNumber(builderId)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Username</Text>
              <Text style={styles.rowValue}>@{username}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Member Since</Text>
              <Text style={styles.rowValue}>
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Skills</Text>
              <Text style={styles.rowValue}>Registered</Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.divider} />

        <Text style={styles.quote}>"Build Something Insane"</Text>

        <View style={styles.verified}>
          <Text style={styles.verifiedIcon}>✓</Text>
          <Text style={styles.verifiedText}>Verified Member</Text>
        </View>
      </Animated.View>

      {showButton && (
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonFade,
              transform: [{ translateY: buttonSlide }],
            },
          ]}
        >
          <TouchableOpacity style={styles.enterButton} onPress={handleEnter}>
            <Text style={styles.enterButtonText}>Enter Dream Builder</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
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
    backgroundColor: '#0f0f0f',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1a1a24',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 32,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
  },
  headerLabel: {
    fontSize: 12,
    color: 'rgba(245, 158, 11, 0.5)',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  memberLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    marginVertical: 16,
  },
  content: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 12,
    color: 'rgba(245, 158, 11, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  builderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  rowValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  quote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'rgba(245, 158, 11, 0.4)',
    textAlign: 'center',
  },
  verified: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  verifiedIcon: {
    fontSize: 12,
    color: 'rgba(245, 158, 11, 0.3)',
  },
  verifiedText: {
    fontSize: 10,
    color: 'rgba(245, 158, 11, 0.3)',
    letterSpacing: 1,
  },
  buttonContainer: {
    marginTop: 32,
    width: '100%',
    maxWidth: 340,
  },
  enterButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  enterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});
