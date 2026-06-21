import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput as RNTextInput,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/use-theme';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { Button, Icon } from '../components/ui';
import { m3Typography } from '../constants/m3-typography';
import { m3Spacing } from '../constants/m3-spacing';
import { m3Shape } from '../constants/m3-shape';

export function SettingsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { getProfile, updateProfile, loading } = useProfile();
  const { show: showToast, ToastComponent } = useToast();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [interestsText, setInterestsText] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      const profile = await getProfile(user.id);
      if (profile) {
        setUsername(profile.username || '');
        setDisplayName(profile.display_name || '');
        setBio(profile.bio || '');
        setCountry(profile.country || '');
        setSkillsText((profile.skills || []).join(', '));
        setInterestsText((profile.interests || []).join(', '));
      }
      setInitialLoading(false);
    };
    load();
  }, [user?.id, getProfile]);

  const handleSave = async () => {
    if (!user?.id) return;
    const skills = skillsText.split(',').map((s: string) => s.trim()).filter(Boolean);
    const interests = interestsText.split(',').map((i: string) => i.trim()).filter(Boolean);

    const success = await updateProfile(user.id, {
      username,
      display_name: displayName,
      bio,
      country,
      skills,
      interests,
    });

    if (success) {
      showToast('Profile saved!', 'success');
      setTimeout(() => navigation.goBack(), 1200);
    } else {
      showToast('Failed to save profile', 'error');
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Button
            title=""
            onPress={() => navigation.goBack()}
            variant="text"
            icon={<Icon name="close" size="sm" color={colors.onBackground} />}
          />
          <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Edit Profile</Text>
          <Button
            title="Save"
            onPress={handleSave}
            variant="text"
            loading={loading}
            disabled={loading}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Username */}
          <Text style={[styles.label, { color: colors.onBackground }]}>Username</Text>
          <RNTextInput
            style={[styles.input, { color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surfaceVariant }]}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="username"
            placeholderTextColor={colors.onSurfaceVariant}
          />

          {/* Display Name */}
          <Text style={[styles.label, { color: colors.onBackground }]}>Display Name</Text>
          <RNTextInput
            style={[styles.input, { color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surfaceVariant }]}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your display name"
            placeholderTextColor={colors.onSurfaceVariant}
          />

          {/* Bio */}
          <Text style={[styles.label, { color: colors.onBackground }]}>Bio</Text>
          <RNTextInput
            style={[styles.textArea, { color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surfaceVariant }]}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholder="Tell us about yourself"
            placeholderTextColor={colors.onSurfaceVariant}
          />

          {/* Country */}
          <Text style={[styles.label, { color: colors.onBackground }]}>Country</Text>
          <RNTextInput
            style={[styles.input, { color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surfaceVariant }]}
            value={country}
            onChangeText={setCountry}
            placeholder="Your country"
            placeholderTextColor={colors.onSurfaceVariant}
          />

          {/* Skills (comma-separated) */}
          <Text style={[styles.label, { color: colors.onBackground }]}>Skills (comma separated)</Text>
          <RNTextInput
            style={[styles.input, { color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surfaceVariant }]}
            value={skillsText}
            onChangeText={setSkillsText}
            placeholder="React, TypeScript, Node.js"
            placeholderTextColor={colors.onSurfaceVariant}
          />

          {/* Interests (comma-separated) */}
          <Text style={[styles.label, { color: colors.onBackground }]}>Interests (comma separated)</Text>
          <RNTextInput
            style={[styles.input, { color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surfaceVariant }]}
            value={interestsText}
            onChangeText={setInterestsText}
            placeholder="Gaming, Design, AI"
            placeholderTextColor={colors.onSurfaceVariant}
          />

          <View style={{ height: m3Spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
      {ToastComponent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: m3Spacing.xs, height: 56,
  },
  headerTitle: { ...m3Typography.titleMedium },
  scrollContent: { padding: m3Spacing.lg },
  label: { ...m3Typography.labelLarge, marginBottom: m3Spacing.xs, marginTop: m3Spacing.md },
  input: {
    ...m3Typography.bodyMedium,
    borderWidth: 1, borderRadius: m3Shape.small,
    paddingHorizontal: m3Spacing.sm, paddingVertical: m3Spacing.sm,
  },
  textArea: {
    ...m3Typography.bodyMedium,
    borderWidth: 1, borderRadius: m3Shape.small,
    paddingHorizontal: m3Spacing.sm, paddingVertical: m3Spacing.sm,
    minHeight: 100, textAlignVertical: 'top',
  },
});