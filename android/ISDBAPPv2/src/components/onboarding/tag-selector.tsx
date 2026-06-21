import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { m3Shape } from '../../constants/m3-shape';
import { m3Spacing } from '../../constants/m3-spacing';
import type { Tag } from '../../types';

interface TagSelectorProps {
  label: string;
  selectedTags: string[];
  availableTags: Tag[];
  onTagsChange: (tags: string[]) => void;
  minTags?: number;
  maxTags?: number;
  placeholder?: string;
  loading?: boolean;
}

export function TagSelector({
  label,
  selectedTags,
  availableTags,
  onTagsChange,
  minTags = 0,
  maxTags = 10,
  placeholder = 'Search tags...',
  loading = false,
}: TagSelectorProps) {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const filteredTags = useMemo(() => {
    return availableTags.filter(tag => {
      const isSelected = selectedTags.includes(tag.name);
      const matchesSearch = tag.name.toLowerCase().includes(search.toLowerCase());
      return !isSelected && matchesSearch;
    });
  }, [availableTags, selectedTags, search]);

  const groupedTags = useMemo(() => {
    const groups: Record<string, Tag[]> = {};
    filteredTags.forEach(tag => {
      const category = tag.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(tag);
    });
    return groups;
  }, [filteredTags]);

  const addTag = (tagName: string) => {
    if (selectedTags.length < maxTags && !selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName]);
      setSearch('');
    }
  };

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(t => t !== tagName));
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.onBackground }]}>{label}</Text>
        <Text style={[styles.requirement, { color: colors.onSurfaceVariant }]}>
          {minTags > 0 ? `${minTags}-${maxTags} required` : `Up to ${maxTags}`}
        </Text>
      </View>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <View style={styles.selectedContainer}>
          {selectedTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.selectedTag, { backgroundColor: colors.primary }]}
              onPress={() => removeTag(tag)}
            >
              <Text style={[styles.selectedTagText, { color: colors.onPrimary }]}>{tag}</Text>
              <Text style={[styles.removeIcon, { color: colors.onPrimary }]}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search Input */}
      {selectedTags.length < maxTags && (
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: colors.surfaceVariant, borderColor: colors.outline, color: colors.onBackground }]}
            value={search}
            onChangeText={setSearch}
            placeholder={placeholder}
            placeholderTextColor={colors.onSurfaceVariant}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              style={styles.loadingSpinner}
              color={colors.primary}
            />
          )}
        </View>
      )}

      {/* Tag List */}
      {search && !loading && (
        <ScrollView style={[styles.tagList, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          {Object.entries(groupedTags).map(([category, tags]) => (
            <View key={category} style={[styles.categoryGroup, { borderBottomColor: colors.outlineVariant }]}>
              <Text style={[styles.categoryTitle, { color: colors.primary }]}>{category}</Text>
              {tags.slice(0, 10).map((tag) => (
                <TouchableOpacity
                  key={tag.name}
                  style={[styles.tagItem, { borderBottomColor: colors.outlineVariant }]}
                  onPress={() => addTag(tag.name)}
                >
                  <Text style={[styles.tagName, { color: colors.onSurface }]}>{tag.name}</Text>
                  {tag.description && (
                    <Text style={[styles.tagDescription, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                      {tag.description}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {filteredTags.length === 0 && (
            <Text style={[styles.noResults, { color: colors.onSurfaceVariant }]}>
              No tags found matching "{search}"
            </Text>
          )}
        </ScrollView>
      )}

      {/* Validation Message */}
      {selectedTags.length < minTags && (
        <Text style={[styles.validationText, { color: colors.error }]}>
          Please select at least {minTags} {label.toLowerCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  requirement: {
    fontSize: 12,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  selectedTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: m3Shape.small,
    padding: 12,
    fontSize: 16,
  },
  loadingSpinner: {
    marginLeft: 8,
  },
  tagList: {
    borderWidth: 1,
    borderRadius: m3Shape.small,
    maxHeight: 250,
  },
  categoryGroup: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  tagName: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  noResults: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  validationText: {
    fontSize: 12,
    marginTop: 4,
  },
});