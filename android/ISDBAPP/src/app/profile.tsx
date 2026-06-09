import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { useTags } from '../hooks/use-tags';
import { Button, Card, Avatar } from '../components/ui';
import type { Profile } from '../types';

const COUNTRIES = [
  'United States',
  'China',
  'India',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'Canada',
  'Australia',
  'Brazil',
  'Russia',
  'Other',
];

export function ProfileScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const { getProfile, updateProfile, loading: profileLoading } = useProfile();
  const { getTagNames } = useTags();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const availableTags = getTagNames();

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        const data = await getProfile(user.id);
        if (data) {
          setProfile(data);
          setDisplayName(data.display_name || '');
          setBio(data.bio || '');
          setCountry(data.country || '');
          setSkills(data.skills || []);
          setInterests(data.interests || []);
        }
      }
      setLoading(false);
    };
    loadProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const success = await updateProfile(user.id, {
        display_name: displayName,
        bio,
        country,
        skills,
        interests,
      });

      if (success) {
        setProfile(prev =>
          prev
            ? { ...prev, display_name: displayName, bio, country, skills, interests }
            : null
        );
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (tag: string) => {
    setSkills(prev =>
      prev.includes(tag) ? prev.filter(s => s !== tag) : [...prev, tag]
    );
  };

  const toggleInterest = (tag: string) => {
    setInterests(prev =>
      prev.includes(tag) ? prev.filter(i => i !== tag) : [...prev, tag]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ],
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Please sign in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading || profileLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const userDisplayName = profile?.display_name || user.user_metadata?.user_name || 'Builder';
  const userAvatar = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar source={userAvatar ? { uri: userAvatar } : null} size={80} />
          <Text style={[styles.name, { color: colors.text }]}>
            {userDisplayName}
          </Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @{profile?.username || user.user_metadata?.user_name?.toLowerCase() || 'unknown'}
          </Text>
        </View>

        {editing ? (
          <>
            <Card style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Basic Information
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Display Name
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Your display name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Bio
                </Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  maxLength={280}
                />
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {bio.length}/280
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Country
                </Text>
                <TouchableOpacity
                  style={[styles.selectButton, { backgroundColor: colors.surface }]}
                  onPress={() => setShowCountryPicker(!showCountryPicker)}
                >
                  <Text style={[styles.selectText, { color: country ? colors.text : colors.textSecondary }]}>
                    {country || 'Select your country'}
                  </Text>
                  <Text style={styles.selectArrow}>▼</Text>
                </TouchableOpacity>

                {showCountryPicker && (
                  <ScrollView style={styles.countryList}>
                    {COUNTRIES.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={styles.countryItem}
                        onPress={() => {
                          setCountry(c);
                          setShowCountryPicker(false);
                        }}
                      >
                        <Text style={[styles.countryItemText, { color: colors.text }]}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </Card>

            <Card style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Skills ({skills.length})
              </Text>
              <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
                Select your skills
              </Text>
              <View style={styles.tagGrid}>
                {availableTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tag, skills.includes(tag) && styles.tagSelected]}
                    onPress={() => toggleSkill(tag)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        skills.includes(tag) && styles.tagTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <Card style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Interests ({interests.length})
              </Text>
              <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
                Select your interests
              </Text>
              <View style={styles.tagGrid}>
                {availableTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tag, interests.includes(tag) && styles.tagSelected]}
                    onPress={() => toggleInterest(tag)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        interests.includes(tag) && styles.tagTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <View style={styles.editActions}>
              <Button
                title="Cancel"
                onPress={() => setEditing(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title={saving ? 'Saving...' : 'Save'}
                onPress={handleSave}
                disabled={saving}
                style={{ flex: 1 }}
              />
            </View>
          </>
        ) : (
          <>
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Bio</Text>
                <TouchableOpacity onPress={() => setEditing(true)}>
                  <Text style={[styles.editLink, { color: colors.primary }]}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.bioText, { color: colors.textSecondary }]}>
                {profile?.bio || 'No bio added yet'}
              </Text>
              {profile?.country && (
                <Text style={[styles.countryText, { color: colors.textSecondary }]}>
                  📍 {profile.country}
                </Text>
              )}
            </Card>

            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Skills ({profile?.skills?.length || 0})
                </Text>
                <TouchableOpacity onPress={() => setEditing(true)}>
                  <Text style={[styles.editLink, { color: colors.primary }]}>Edit</Text>
                </TouchableOpacity>
              </View>
              {profile?.skills && profile.skills.length > 0 ? (
                <View style={styles.tags}>
                  {profile.skills.map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillTagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No skills added yet
                </Text>
              )}
            </Card>

            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Interests ({profile?.interests?.length || 0})
                </Text>
                <TouchableOpacity onPress={() => setEditing(true)}>
                  <Text style={[styles.editLink, { color: colors.primary }]}>Edit</Text>
                </TouchableOpacity>
              </View>
              {profile?.interests && profile.interests.length > 0 ? (
                <View style={styles.tags}>
                  {profile.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestTagText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No interests added yet
                </Text>
              )}
            </Card>

            <View style={styles.actions}>
              <Button
                title="Sign Out"
                onPress={handleSignOut}
                variant="ghost"
                fullWidth
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  username: {
    fontSize: 16,
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 12,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  countryText: {
    fontSize: 14,
    marginTop: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillTagText: {
    color: '#4ade80',
    fontSize: 14,
  },
  interestTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestTagText: {
    color: '#a78bfa',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  editLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  selectButton: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
  },
  selectArrow: {
    fontSize: 12,
  },
  countryList: {
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    maxHeight: 200,
    marginTop: 4,
  },
  countryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  countryItemText: {
    fontSize: 16,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagSelected: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  tagText: {
    color: '#ffffff',
    fontSize: 14,
  },
  tagTextSelected: {
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
