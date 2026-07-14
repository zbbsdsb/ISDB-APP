import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../hooks/use-theme';
import {useGroups} from '../hooks/use-groups';
import {Text} from '../components/ui/text';
import {Button, Icon} from '../components/ui';
import {m3Spacing} from '../constants/m3-spacing';

export function GroupCreateScreen() {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {createGroup, loading} = useGroups();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Group name is required');
      return;
    }
    const id = await createGroup({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    if (id) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to create group');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {borderBottomColor: colors.outlineVariant}]}>
        <Button
          title=""
          onPress={() => navigation.goBack()}
          variant="text"
          icon={<Icon name="close" size="sm" color={colors.onBackground} />}
        />
        <Text variant="title" style={[styles.headerTitle, {color: colors.onBackground}]}>
          New Group
        </Text>
        <Button
          title="Create"
          onPress={handleCreate}
          variant="filled"
          disabled={!name.trim() || loading}
          loading={loading}
        />
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text variant="label" style={[styles.label, {color: colors.onSurfaceVariant}]}>
            Group Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceVariant,
                color: colors.onSurface,
                borderColor: colors.outline,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="My Awesome Group"
            placeholderTextColor={colors.onSurfaceVariant}
            maxLength={100}
          />
        </View>
        <View style={styles.field}>
          <Text variant="label" style={[styles.label, {color: colors.onSurfaceVariant}]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.surfaceVariant,
                color: colors.onSurface,
                borderColor: colors.outline,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="What's this group about?"
            placeholderTextColor={colors.onSurfaceVariant}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: m3Spacing.xs,
    height: 56,
    borderBottomWidth: 1,
  },
  headerTitle: {},
  form: {padding: m3Spacing.lg, gap: m3Spacing.lg},
  field: {gap: m3Spacing.xs},
  label: {},
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: m3Spacing.md,
    paddingVertical: m3Spacing.sm,
  },
  textArea: {minHeight: 100, paddingTop: m3Spacing.sm},
});
