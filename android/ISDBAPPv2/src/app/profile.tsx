import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Button, Card, Avatar } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import { m3Shape } from '../constants/m3-shape';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { user, signOut } = useAuth();
  const { getProfile } = useProfile();

  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
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
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ],
    );
  };

  const userDisplayName = profile?.display_name || user?.user_metadata?.user_name || 'Builder';
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const skills = profile?.skills || [];
  const interests = profile?.interests || [];
  const bio = profile?.bio;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar + Name */}
        <View style={styles.header}>
          <Avatar source={userAvatar ? { uri: userAvatar } : null} size={80} />
          {profileLoading ? (
            <ActivityIndicator style={{ marginTop: m3Spacing.sm }} color={colors.primary} />
          ) : (
            <>
              <Text style={[styles.name, { color: colors.onBackground }]}>
                {userDisplayName}
              </Text>
              {profile?.username && (
                <Text style={[styles.username, { color: colors.onSurfaceVariant }]}>
                  @{profile.username}
                </Text>
              )}
            </>
          )}
        </View>

        {/* Bio */}
        <Card variant="filled" padding={m3Spacing.md} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Bio</Text>
          <Text style={[styles.bioText, { color: colors.onSurfaceVariant }]}>
            {bio || 'No bio yet'}
          </Text>
        </Card>

        {/* Skills */}
        <Card variant="filled" padding={m3Spacing.md} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Skills</Text>
          {skills.length > 0 ? (
            <View style={styles.tagsRow}>
              {skills.map((s: string) => (
                <View key={s} style={[styles.chip, { backgroundColor: colors.secondaryContainer }]}>
                  <Text style={[styles.chipText, { color: colors.onSecondaryContainer }]}>{s}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.placeholderText, { color: colors.onSurfaceVariant }]}>No skills added yet</Text>
          )}
        </Card>

        {/* Interests */}
        <Card variant="filled" padding={m3Spacing.md} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Interests</Text>
          {interests.length > 0 ? (
            <View style={styles.tagsRow}>
              {interests.map((i: string) => (
                <View key={i} style={[styles.chip, { backgroundColor: colors.tertiaryContainer }]}>
                  <Text style={[styles.chipText, { color: colors.onTertiaryContainer }]}>{i}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.placeholderText, { color: colors.onSurfaceVariant }]}>No interests added yet</Text>
          )}
        </Card>

        {/* Badges Preview */}
        <Card variant="elevated" padding={m3Spacing.md} style={styles.section}>
          <View style={styles.badgesHeader}>
            <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>Badges</Text>
            <Button
              title="View All"
              onPress={() => navigation.navigate('Badges')}
              variant="text"
              size="sm"
            />
          </View>
          <Text style={[styles.placeholderText, { color: colors.onSurfaceVariant }]}>
            Earn badges by completing challenges
          </Text>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            onPress={() => navigation.navigate('Settings')}
            variant="outlined"
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: m3Spacing.lg },
  header: { alignItems: 'center', marginBottom: m3Spacing.xl },
  name: { ...m3Typography.headlineSmall, fontWeight: '700', marginTop: m3Spacing.sm },
  username: { ...m3Typography.bodyLarge, marginTop: m3Spacing.xs },
  section: { marginBottom: m3Spacing.md },
  sectionTitle: { ...m3Typography.titleSmall, marginBottom: m3Spacing.sm },
  bioText: { ...m3Typography.bodyMedium },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: m3Spacing.xs },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: m3Shape.small },
  chipText: { ...m3Typography.labelMedium },
  placeholderText: { ...m3Typography.bodyMedium },
  badgesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { gap: m3Spacing.sm, marginTop: m3Spacing.md },
});