import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Button, Card, Avatar } from '../components/ui';

export function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar size={80} />
          <Text style={[styles.name, { color: colors.text }]}>
            Your Name
          </Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>
            @username
          </Text>
        </View>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Bio
          </Text>
          <Text style={[styles.bio, { color: colors.textSecondary }]}>
            Tell us about yourself...
          </Text>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Skills
          </Text>
          <View style={styles.tags}>
            <Text style={[styles.tag, { color: colors.textSecondary }]}>
              No skills added yet
            </Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Interests
          </Text>
          <View style={styles.tags}>
            <Text style={[styles.tag, { color: colors.textSecondary }]}>
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
            onPress={() => {}}
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
