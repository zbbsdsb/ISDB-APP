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
  const [search, setSearch] = useState('');

  // Filter tags that are not selected and match search
  const filteredTags = useMemo(() => {
    return availableTags.filter(tag => {
      const isSelected = selectedTags.includes(tag.name);
      const matchesSearch = tag.name.toLowerCase().includes(search.toLowerCase());
      return !isSelected && matchesSearch;
    });
  }, [availableTags, selectedTags, search]);

  // Group tags by category
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
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.requirement}>
          {minTags > 0 ? `${minTags}-${maxTags} required` : `Up to ${maxTags}`}
        </Text>
      </View>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <View style={styles.selectedContainer}>
          {selectedTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.selectedTag}
              onPress={() => removeTag(tag)}
            >
              <Text style={styles.selectedTagText}>{tag}</Text>
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search Input */}
      {selectedTags.length < maxTags && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={placeholder}
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {loading && (
            <ActivityIndicator 
              size="small" 
              style={styles.loadingSpinner} 
            />
          )}
        </View>
      )}

      {/* Tag List */}
      {search && !loading && (
        <ScrollView style={styles.tagList}>
          {Object.entries(groupedTags).map(([category, tags]) => (
            <View key={category} style={styles.categoryGroup}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {tags.slice(0, 10).map((tag) => (
                <TouchableOpacity
                  key={tag.name}
                  style={styles.tagItem}
                  onPress={() => addTag(tag.name)}
                >
                  <Text style={styles.tagName}>{tag.name}</Text>
                  {tag.description && (
                    <Text style={styles.tagDescription} numberOfLines={1}>
                      {tag.description}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {filteredTags.length === 0 && (
            <Text style={styles.noResults}>
              No tags found matching "{search}"
            </Text>
          )}
        </ScrollView>
      )}

      {/* Validation Message */}
      {selectedTags.length < minTags && (
        <Text style={styles.validationText}>
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
    color: '#d1d5db',
  },
  requirement: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  selectedTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  removeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  loadingSpinner: {
    marginLeft: 8,
  },
  tagList: {
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    maxHeight: 250,
  },
  categoryGroup: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  tagName: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  tagDescription: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  noResults: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    padding: 20,
  },
  validationText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
});
