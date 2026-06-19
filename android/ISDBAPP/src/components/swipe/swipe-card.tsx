import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import type { SwipeCard as SwipeCardType } from '@isdb/shared';
import { Avatar } from '../ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

interface SwipeCardProps {
  card: SwipeCardType;
  onSwipe: (direction: 'left' | 'right' | 'down') => void;
  disabled?: boolean;
}

export function SwipeCard({ card, onSwipe, disabled }: SwipeCardProps) {
  const { project, matchScore, matchReasons } = card;
  const owner = project.owner;

  const getMatchColor = (score: number): string => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#eab308';
    return '#6b7280';
  };

  // Web 版同步：自定义卡片字段
  const accentColor = card.project.card_color || '#f59e0b';
  const hasHook = !!card.project.hook_text;
  const displayDescription = hasHook
    ? card.project.hook_text
    : card.project.description;

  return (
    <View style={[styles.card, { borderColor: `${accentColor}33` }]}>
      {/* custom_badge 徽章（右上角） */}
      {card.project.custom_badge && (
        <View style={[styles.customBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.customBadgeText}>{card.project.custom_badge}</Text>
        </View>
      )}

      <View style={styles.header}>
        <View
          style={[
            styles.matchBadge,
            { backgroundColor: getMatchColor(matchScore) },
          ]}
        >
          <Text style={styles.matchText}>{matchScore}% Match</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {project.title}
        </Text>
        <Text style={styles.description} numberOfLines={4}>
          {displayDescription}
        </Text>

        {/* featured_tags 行（作者自定义标签，在 tags 之前） */}
        {card.project.featured_tags && card.project.featured_tags.length > 0 && (
          <View style={styles.featuredTags}>
            {card.project.featured_tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                style={[styles.featuredTag, { backgroundColor: `${accentColor}33` }]}
              >
                <Text style={[styles.featuredTagText, { color: accentColor }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.tags}>
          {(project.tags || []).slice(0, 4).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.skills}>
          <Text style={styles.skillsLabel}>Looking for:</Text>
          <View style={styles.skillsTags}>
            {(project.required_skills || []).slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {matchReasons.length > 0 && (
          <View style={styles.reasons}>
            {matchReasons.slice(0, 2).map((reason, index) => (
              <Text key={index} style={styles.reasonText}>
                • {reason}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.owner}>
          <Avatar
            source={owner?.avatar_url ? { uri: owner.avatar_url } : null}
            size={32}
          />
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>
              {owner?.display_name || owner?.username || 'Unknown'}
            </Text>
            <Text style={styles.ownerHandle}>
              @{owner?.username || 'unknown'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => onSwipe('left')}
          disabled={disabled}
        >
          <Text style={styles.actionIcon}>✕</Text>
          <Text style={styles.actionLabel}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={() => onSwipe('down')}
          disabled={disabled}
        >
          <Text style={styles.actionIcon}>★</Text>
          <Text style={styles.actionLabel}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.matchButton]}
          onPress={() => onSwipe('right')}
          disabled={disabled}
        >
          <Text style={styles.actionIcon}>✓</Text>
          <Text style={styles.actionLabel}>Match</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a24',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    overflow: 'hidden',
    position: 'relative', // for absolute-positioned customBadge
  },
  customBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  customBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  matchBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  matchText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  featuredTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  featuredTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  featuredTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#a78bfa',
    fontSize: 12,
  },
  skills: {
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  skillsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    color: '#4ade80',
    fontSize: 12,
  },
  reasons: {
    marginTop: 8,
  },
  reasonText: {
    fontSize: 12,
    color: '#f59e0b',
    marginBottom: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 158, 11, 0.1)',
  },
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  ownerHandle: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 50,
    width: 64,
    height: 64,
  },
  passButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  saveButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  matchButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  actionIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  actionLabel: {
    fontSize: 10,
    color: '#ffffff',
    marginTop: 2,
  },
});
