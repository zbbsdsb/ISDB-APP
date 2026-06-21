import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks/use-theme';
import ReadmeBlock from './readme-block';
import RoadmapBlock from './roadmap-block';
import SkillsBlock from './skills-block';
import TeamBlock from './team-block';
import GithubStatsBlock from './github-stats-block';
import CtaBlock from './cta-block';
import type {BlockType} from '@isdb/shared';

interface BlockRendererProps {
  blockType: BlockType;
  config: Record<string, any>;
  projectId: string;
}

export default function BlockRenderer({
  blockType,
  config,
  projectId,
}: BlockRendererProps) {
  const {colors} = useTheme();

  switch (blockType) {
    case 'readme':
      return <ReadmeBlock config={config} />;
    case 'roadmap':
      return <RoadmapBlock config={config} />;
    case 'skills':
      return <SkillsBlock config={config} />;
    case 'team':
      return <TeamBlock config={config} projectId={projectId} />;
    case 'github_stats':
      return <GithubStatsBlock config={config} />;
    case 'cta':
      return <CtaBlock config={config} />;
    default:
      return (
        <View
          style={[styles.fallback, {backgroundColor: colors.surfaceVariant}]}>
          <Text style={[styles.fallbackText, {color: colors.onSurfaceVariant}]}>
            Unknown block: {blockType}
          </Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  fallback: {padding: 16, borderRadius: 8, marginBottom: 16},
  fallbackText: {fontSize: 14},
});
