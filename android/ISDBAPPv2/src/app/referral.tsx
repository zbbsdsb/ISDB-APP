import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Share,
  ActivityIndicator,
} from 'react-native';
import {Text} from '../components/ui/text';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {useToast} from '../hooks/use-toast';
import {useReferral} from '../hooks/use-referral';
import {Button, Icon, Card} from '../components/ui';
import {m3Typography} from '../constants/m3-typography';
import {m3Spacing} from '../constants/m3-spacing';

export function ReferralScreen() {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {code, totalReferrals, loading, shareText} = useReferral();
  const {show: showToast, ToastComponent} = useToast();

  const handleShare = async () => {
    try {
      await Share.share({message: shareText});
    } catch {
      showToast('Failed to share', 'error');
    }
  };

  const handleCopy = () => {
    // React Native doesn't have Clipboard in core; use Share as fallback
    showToast('Code: ' + code, 'info');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title=""
          onPress={() => navigation.goBack()}
          variant="text"
          icon={<Icon name="back" size="sm" color={colors.onBackground} />}
        />
        <Text variant="title" style={[styles.headerTitle, {color: colors.onBackground}]}>
          Invite Friends
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Referral code card */}
          <Card
            variant="elevated"
            padding={m3Spacing.xl}
            style={styles.codeCard}>
            <Text variant="body" style={styles.emoji}>🎉</Text>
            <Text variant="label" style={[styles.codeLabel, {color: colors.onSurfaceVariant}]}>
              Your Referral Code
            </Text>
            <Text variant="heading" style={[styles.codeValue, {color: colors.primary}]}>
              {code || 'ISDB-XXXXXX'}
            </Text>
            <Text variant="body" style={[styles.codeHint, {color: colors.onSurfaceVariant}]}>
              Share this code with friends to invite them!
            </Text>
          </Card>

          {/* Stats */}
          <Card
            variant="filled"
            padding={m3Spacing.md}
            style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text variant="heading" style={[styles.statValue, {color: colors.primary}]}>
                {totalReferrals}
              </Text>
                <Text variant="label"
                  style={[styles.statLabel, {color: colors.onSurfaceVariant}]}>
                Friends Joined
              </Text>
            </View>
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Share Invite"
              onPress={handleShare}
              variant="filled"
              fullWidth
              icon={<Icon name="share" size="sm" color={colors.onPrimary} />}
            />
            <Button
              title="Copy Code"
              onPress={handleCopy}
              variant="outlined"
              fullWidth
            />
          </View>
        </View>
      )}
      {ToastComponent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContent: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: m3Spacing.xs,
    height: 56,
  },
  headerTitle: {...m3Typography.titleMedium},
  headerSpacer: {width: 48},
  content: {flex: 1, padding: m3Spacing.lg},
  codeCard: {alignItems: 'center', marginBottom: m3Spacing.lg},
  emoji: {fontSize: 48, marginBottom: m3Spacing.md},
  codeLabel: {...m3Typography.bodyLarge, marginBottom: m3Spacing.sm},
  codeValue: {
    ...m3Typography.headlineMedium,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: m3Spacing.sm,
  },
  codeHint: {...m3Typography.bodyMedium, textAlign: 'center'},
  statsCard: {alignItems: 'center', marginBottom: m3Spacing.lg},
  statRow: {alignItems: 'center'},
  statValue: {...m3Typography.displaySmall, fontWeight: '700'},
  statLabel: {...m3Typography.bodyMedium},
  actions: {gap: m3Spacing.sm},
});
