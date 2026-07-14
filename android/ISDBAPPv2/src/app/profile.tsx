import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {Text} from '../components/ui/text';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {useAuth} from '../hooks/use-auth';
import {useProfile} from '../hooks/use-profile';
import {useBadges} from '../hooks/use-badges';
import {Button, Card, Avatar, Badge, Skeleton} from '../components/ui';
import {m3Typography} from '../constants/m3-typography';
import {m3Spacing} from '../constants/m3-spacing';
import {m3Shape} from '../constants/m3-shape';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const {colors} = useTheme();
  const navigation = useNavigation<NavProp>();
  const {user, signOut} = useAuth();
  const {getProfile} = useProfile();

  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const {badges, userBadges, loading: badgesLoading} = useBadges();
  const unlockedBadges = badges.filter(b => userBadges.has(b.id));
  const topBadges = unlockedBadges.slice(0, 4);

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      return;
    }
    setProfileLoading(true);
    const data = await getProfile(user.id);
    setProfile(data);
    setProfileLoading(false);
  }, [user?.id, getProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Sign Out', style: 'destructive', onPress: signOut},
    ]);
  };

  const userDisplayName =
    profile?.display_name || user?.user_metadata?.user_name || 'Builder';
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const skills = profile?.skills || [];
  const interests = profile?.interests || [];
  const bio = profile?.bio;
  const country = profile?.country;
  const builderId = profile?.id?.slice(0, 4).toUpperCase() || '----';
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  // Detect social logins from user metadata
  const identities = user?.identities || [];
  const connectedProviders: string[] = identities
    .map((id: {provider: string}) => id.provider)
    .filter(Boolean);

  const getProviderLabel = (provider: string) => {
    const labels: Record<string, string> = {
      github: 'GitHub',
      google: 'Google',
      discord: 'Discord',
      email: 'Email',
    };
    return labels[provider] || provider;
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Avatar + Name ── */}
        <View style={styles.header}>
          <Avatar source={userAvatar ? {uri: userAvatar} : null} size={80} />
          {profileLoading ? (
            <View style={styles.headerSkeleton}>
              <Skeleton
                width={160}
                height={22}
                style={{marginTop: m3Spacing.sm}}
              />
              <Skeleton
                width={100}
                height={16}
                style={styles.skeletonMarginSm}
              />
            </View>
          ) : (
            <>
              <Text variant="heading" style={[styles.name, {color: colors.onBackground}]}>
                {userDisplayName}
              </Text>
              {profile?.username && (
                <Text variant="body"
                  style={[styles.username, {color: colors.onSurfaceVariant}]}>
                  @{profile.username}
                </Text>
              )}
            </>
          )}
        </View>

        {/* ── Builder Identity Card ── */}
        <Card variant="elevated" padding={m3Spacing.md} style={styles.section}>
          {profileLoading ? (
            <View>
              <Skeleton
                width="100%"
                height={18}
                style={{marginBottom: m3Spacing.sm}}
              />
              <Skeleton width="60%" height={14} />
            </View>
          ) : (
            <>
              <Text variant="label" style={[styles.cardLabel, {color: colors.primary}]}>
                INSANE DREAM BUILDER
              </Text>
              <View style={styles.identityRow}>
                <Text variant="label"
                  style={[
                    styles.identityKey,
                    {color: colors.onSurfaceVariant},
                  ]}>
                  Builder ID
                </Text>
                <Text variant="body" style={[styles.identityValue, {color: colors.onSurface}]}>
                  #{builderId}
                </Text>
              </View>
              {joinDate && (
                <View style={styles.identityRow}>
                  <Text variant="label"
                    style={[
                      styles.identityKey,
                      {color: colors.onSurfaceVariant},
                    ]}>
                    Joined
                  </Text>
                  <Text variant="body"
                    style={[styles.identityValue, {color: colors.onSurface}]}>
                    {joinDate}
                  </Text>
                </View>
              )}
              {country && (
                <View style={styles.identityRow}>
                  <Text variant="label"
                    style={[
                      styles.identityKey,
                      {color: colors.onSurfaceVariant},
                    ]}>
                    Country
                  </Text>
                  <Text variant="body"
                    style={[styles.identityValue, {color: colors.onSurface}]}>
                    {country}
                  </Text>
                </View>
              )}
              {!badgesLoading && (
                <View style={styles.identityRow}>
                  <Text variant="label"
                    style={[
                      styles.identityKey,
                      {color: colors.onSurfaceVariant},
                    ]}>
                    Badges
                  </Text>
                  <Text variant="body"
                    style={[styles.identityValue, {color: colors.onSurface}]}>
                    {unlockedBadges.length}
                  </Text>
                </View>
              )}
            </>
          )}
        </Card>

        {/* ── Bio ── */}
        <Card variant="filled" padding={m3Spacing.md} style={styles.section}>
          <Text variant="title" style={[styles.sectionTitle, {color: colors.onBackground}]}>
            Bio
          </Text>
          {profileLoading ? (
            <Skeleton width="100%" height={40} />
          ) : (
            <Text variant="body" style={[styles.bioText, {color: colors.onSurfaceVariant}]}>
              {bio || 'No bio yet'}
            </Text>
          )}
        </Card>

        {/* ── Skills ── */}
        <Card variant="filled" padding={m3Spacing.md} style={styles.section}>
          <Text variant="title" style={[styles.sectionTitle, {color: colors.onBackground}]}>
            Skills
          </Text>
          {skills.length > 0 ? (
            <View style={styles.tagsRow}>
              {skills.map((s: string) => (
                <View
                  key={s}
                  style={[
                    styles.chip,
                    {backgroundColor: colors.secondaryContainer},
                  ]}>
                  <Text variant="label"
                    style={[
                      styles.chipText,
                      {color: colors.onSecondaryContainer},
                    ]}>
                    {s}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text variant="body"
              style={[
                styles.placeholderText,
                {color: colors.onSurfaceVariant},
              ]}>
              No skills added yet
            </Text>
          )}
        </Card>

        {/* ── Interests ── */}
        <Card variant="filled" padding={m3Spacing.md} style={styles.section}>
          <Text variant="title" style={[styles.sectionTitle, {color: colors.onBackground}]}>
            Interests
          </Text>
          {interests.length > 0 ? (
            <View style={styles.tagsRow}>
              {interests.map((i: string) => (
                <View
                  key={i}
                  style={[
                    styles.chip,
                    {backgroundColor: colors.tertiaryContainer},
                  ]}>
                  <Text variant="label"
                    style={[
                      styles.chipText,
                      {color: colors.onTertiaryContainer},
                    ]}>
                    {i}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text variant="body"
              style={[
                styles.placeholderText,
                {color: colors.onSurfaceVariant},
              ]}>
              No interests added yet
            </Text>
          )}
        </Card>

        {/* ── Social Connections ── */}
        {connectedProviders.length > 0 && (
          <Card variant="filled" padding={m3Spacing.md} style={styles.section}>
            <Text variant="title" style={[styles.sectionTitle, {color: colors.onBackground}]}>
              Connected Accounts
            </Text>
            {connectedProviders.map((provider: string) => (
              <View
                key={provider}
                style={[
                  styles.socialRow,
                  {borderBottomColor: colors.outlineVariant},
                ]}>
                <Text variant="body" style={[styles.socialLabel, {color: colors.onSurface}]}>
                  {getProviderLabel(provider)}
                </Text>
                <View
                  style={[
                    styles.connectedDot,
                    {backgroundColor: colors.primary},
                  ]}
                />
              </View>
            ))}
          </Card>
        )}

        {/* ── Badges Preview ── */}
        <Card variant="elevated" padding={m3Spacing.md} style={styles.section}>
          <View style={styles.badgesHeader}>
            <Text variant="title" style={[styles.sectionTitle, {color: colors.onBackground}]}>
              Badges
            </Text>
            <Button
              title="View All"
              onPress={() => navigation.navigate('Badges')}
              variant="text"
              size="sm"
            />
          </View>
          {badgesLoading ? (
            <View style={styles.badgeSkeletonRow}>
              <Skeleton variant="rectangular" width={60} height={24} />
              <Skeleton variant="rectangular" width={60} height={24} />
              <Skeleton variant="rectangular" width={60} height={24} />
            </View>
          ) : topBadges.length > 0 ? (
            <View style={styles.tagsRow}>
              {topBadges.map(b => {
                const badgeColor: 'warning' | 'secondary' | 'tertiary' =
                  b.tier === 'gold'
                    ? 'warning'
                    : b.tier === 'silver'
                    ? 'secondary'
                    : 'tertiary';
                return (
                  <Badge
                    key={b.id}
                    label={b.name}
                    size="sm"
                    color={badgeColor}
                  />
                );
              })}
            </View>
          ) : (
            <Text variant="body"
              style={[
                styles.placeholderText,
                {color: colors.onSurfaceVariant},
              ]}>
              Earn badges by completing challenges
            </Text>
          )}
        </Card>

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            onPress={() => navigation.navigate('Settings')}
            variant="filled"
            fullWidth
          />
          <Button
            title="Invite Friends"
            onPress={() => navigation.navigate('Referral')}
            variant="outlined"
            fullWidth
          />
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="ghost"
            fullWidth
          />
        </View>

        {/* Bottom spacer */}
        <View style={{height: m3Spacing.xl}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {padding: m3Spacing.lg},
  header: {alignItems: 'center', marginBottom: m3Spacing.xl},
  headerSkeleton: {alignItems: 'center'},
  skeletonMarginSm: {marginTop: 6},
  name: {
    ...m3Typography.headlineSmall,
    fontWeight: '700',
    marginTop: m3Spacing.sm,
  },
  username: {...m3Typography.bodyLarge, marginTop: m3Spacing.xs},

  // Identity Card
  cardLabel: {
    ...m3Typography.labelSmall,
    letterSpacing: 2,
    marginBottom: m3Spacing.sm,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  identityKey: {...m3Typography.bodySmall},
  identityValue: {...m3Typography.bodyMedium, fontWeight: '500'},

  section: {marginBottom: m3Spacing.md},
  sectionTitle: {...m3Typography.titleSmall, marginBottom: m3Spacing.sm},
  bioText: {...m3Typography.bodyMedium},
  tagsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: m3Spacing.xs},
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: m3Shape.small,
  },
  chipText: {...m3Typography.labelMedium},
  placeholderText: {...m3Typography.bodyMedium},

  // Social Connections
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: m3Spacing.sm,
    borderBottomWidth: 1,
  },
  socialLabel: {...m3Typography.bodyMedium},
  connectedDot: {width: 8, height: 8, borderRadius: 4},

  // Badges
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeSkeletonRow: {flexDirection: 'row', gap: m3Spacing.sm},

  actions: {gap: m3Spacing.sm, marginTop: m3Spacing.md},
});
