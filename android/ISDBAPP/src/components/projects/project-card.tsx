import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project & {
    owner?: {
      username?: string;
      display_name?: string;
      avatar_url?: string | null;
    };
  };
  onPress?: () => void;
}

/**
 * Card component rendering a project on the projects feed.
 * Consumed by `app/projects.tsx`.
 */
export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const title = project.title || 'Untitled Project';
  const description = project.description || 'No description provided.';
  const ownerName = project.owner?.display_name || project.owner?.username || 'Unknown';

  const requiredSkills = Array.isArray(project.required_skills)
    ? project.required_skills.slice(0, 3)
    : [];

  const tags = Array.isArray(project.tags) ? project.tags.slice(0, 4) : [];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.owner}>by @{ownerName}</Text>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      {tags.length > 0 && (
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {requiredSkills.length > 0 && (
        <View style={styles.skillsRow}>
          <Text style={styles.skillsLabel}>Seeking: </Text>
          <View style={styles.skillsList}>
            {requiredSkills.map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.15)',
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  owner: {
    marginTop: 4,
    fontSize: 12,
    color: '#9ca3af',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#d1d5db',
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagPill: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#a78bfa',
  },
  skillsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  skillsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  skillsList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillPill: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: '#4ade80',
  },
});
