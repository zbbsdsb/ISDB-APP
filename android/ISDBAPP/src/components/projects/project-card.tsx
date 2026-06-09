import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Project, Profile } from '../../types';
import { Avatar } from '../ui';

interface ProjectWithOwner extends Project {
  owner?: Profile;
}

interface ProjectCardProps {
  project: ProjectWithOwner;
  onPress?: () => void;
}

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'looking':
        return '#22c55e';
      case 'building':
        return '#3b82f6';
      case 'completed':
        return '#8b5cf6';
      case 'paused':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
          <Text style={styles.statusText}>{project.status}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {project.title}
      </Text>

      {project.description && (
        <Text style={styles.description} numberOfLines={3}>
          {project.description}
        </Text>
      )}

      <View style={styles.tags}>
        {(project.tags || []).slice(0, 4).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {(project.tags || []).length > 4 && (
          <View style={styles.moreTag}>
            <Text style={styles.moreTagText}>+{project.tags.length - 4}</Text>
          </View>
        )}
      </View>

      {project.required_skills && project.required_skills.length > 0 && (
        <View style={styles.skills}>
          <Text style={styles.skillsLabel}>Looking for:</Text>
          <View style={styles.skillsTags}>
            {project.required_skills.slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {project.required_skills.length > 3 && (
              <View style={styles.moreTag}>
                <Text style={styles.moreTagText}>+{project.required_skills.length - 3}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.owner}>
          <Avatar
            source={project.owner?.avatar_url ? { uri: project.owner.avatar_url } : null}
            size={28}
          />
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName} numberOfLines={1}>
              {project.owner?.display_name || project.owner?.username || 'Unknown'}
            </Text>
          </View>
        </View>

        {project.github_url && (
          <View style={styles.githubBadge}>
            <Text style={styles.githubIcon}>🔗</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: '#a78bfa',
    fontSize: 12,
  },
  moreTag: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  moreTagText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  skills: {
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  skillsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillText: {
    color: '#4ade80',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 13,
    color: '#d1d5db',
    fontWeight: '500',
  },
  githubBadge: {
    padding: 6,
  },
  githubIcon: {
    fontSize: 16,
  },
});
