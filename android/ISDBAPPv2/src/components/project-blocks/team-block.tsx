import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Text} from '../ui/text';
import {useTheme} from '../../hooks/use-theme';
import {Card} from '../ui';
import {m3Typography} from '../../constants/m3-typography';
import {m3Spacing} from '../../constants/m3-spacing';
import {supabase} from '../../services/supabase';
import logger from '../../utils/logger';

interface TeamMember {
  role?: string | null;
  profiles?: {
    username?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface TeamBlockProps {
  config: Record<string, unknown>;
  projectId: string;
}

export default function TeamBlock({projectId}: TeamBlockProps) {
  const {colors} = useTheme();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(false);
      const {data, error: fetchError} = await supabase
        .from('project_members')
        .select('role, profiles(username, display_name, avatar_url)')
        .eq('project_id', projectId)
        .order('created_at', {ascending: true});
      if (!active) {
        return;
      }
      if (fetchError) {
        logger.error('[TeamBlock] failed to load members:', fetchError);
        setError(true);
        setMembers([]);
      } else {
        setMembers((data as TeamMember[]) ?? []);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [projectId]);

  const title = 'Team';

  return (
    <Card variant="elevated" padding={m3Spacing.md} style={styles.card}>
      <Text variant="title" style={[styles.title, {color: colors.onBackground}]}>
        {title}
      </Text>

      {loading ? (
        <Text
          variant="body"
          style={[styles.hint, {color: colors.onSurfaceVariant}]}>
          Loading team…
        </Text>
      ) : error ? (
        <Text
          variant="body"
          style={[styles.hint, {color: colors.onSurfaceVariant}]}>
          Couldn’t load team members.
        </Text>
      ) : members.length === 0 ? (
        <Text
          variant="body"
          style={[styles.hint, {color: colors.onSurfaceVariant}]}>
          No team members yet — be the first to join.
        </Text>
      ) : (
        <View style={styles.list}>
          {members.map((m, i) => {
            const profile = m.profiles;
            const name =
              profile?.display_name || profile?.username || 'Member';
            const initial = (name || '?').charAt(0).toUpperCase();
            return (
              <View key={i} style={styles.member}>
                {profile?.avatar_url ? (
                  <Image
                    source={{uri: profile.avatar_url}}
                    style={styles.avatar}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      styles.avatarFallback,
                      {backgroundColor: colors.surfaceVariant},
                    ]}>
                    <Text
                      variant="label"
                      style={{color: colors.onSurfaceVariant}}>
                      {initial}
                    </Text>
                  </View>
                )}
                <View style={styles.meta}>
                  <Text
                    variant="body"
                    style={[styles.name, {color: colors.onSurface}]}>
                    {name}
                  </Text>
                  {m.role ? (
                    <Text
                      variant="caption"
                      style={[styles.role, {color: colors.onSurfaceVariant}]}>
                      {m.role}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginBottom: m3Spacing.md},
  title: {...m3Typography.titleSmall, marginBottom: m3Spacing.sm},
  hint: {...m3Typography.bodyMedium, fontStyle: 'italic'},
  list: {gap: m3Spacing.sm},
  member: {flexDirection: 'row', alignItems: 'center', gap: m3Spacing.sm},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallback: {borderWidth: 1, borderColor: 'rgba(232,168,56,0.2)'},
  meta: {flexDirection: 'column'},
  name: {...m3Typography.bodyMedium},
  role: {...m3Typography.bodySmall},
});
