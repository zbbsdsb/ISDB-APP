import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../ui/text';
import {useTheme} from '../../hooks/use-theme';
import PostCard from './post-card';
import type {ProjectPost} from '@isdb/shared';

interface PostListProps {
  posts: ProjectPost[];
  loading: boolean;
}

export default function PostList({posts, loading}: PostListProps) {
  const {colors} = useTheme();

  if (loading) {
    return (
      <Text variant="body" style={[styles.statusText, {color: colors.onSurfaceVariant}]}>
        Loading posts...
      </Text>
    );
  }

  if (posts.length === 0) {
    return (
      <Text variant="body" style={[styles.statusText, {color: colors.onSurfaceVariant}]}>
        No updates yet
      </Text>
    );
  }

  return (
    <View>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statusText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 24,
  },
});
