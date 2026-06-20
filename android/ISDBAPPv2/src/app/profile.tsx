import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { Button, Card, Avatar } from '../components/ui';

export function ProfileScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

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

  const userDisplayName = user?.user_metadata?.user_name || 'Builder';
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar source={userAvatar ? { uri: userAvatar } : null} size={80} />
          <Text style={[styles.name, { color: colors.onBackground }]}>
            {userDisplayName}
          </Text>
          <Text style={[styles.username, { color: colors.onSurfaceVariant }]}>
            @{userDisplayName.toLowerCase()}
          </Text>
        </View>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Bio
          </Text>
          <Text style={[styles.bio, { color: colors.onSurfaceVariant }]}>
            Tell us about yourself...
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Skills
          </Text>
          <View style={styles.tags}>
            <Text style={[styles.tag, { color: colors.onSurfaceVariant }]}>
              No skills added yet
            </Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Interests
          </Text>
          <View style={styles.tags}>
            <Text style={[styles.tag, { color: colors.onSurfaceVariant }]}>
              No interests added yet
            </Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            onPress={() => {}}
            variant="outline"
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
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    fontSize: 14,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
