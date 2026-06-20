import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useProfile } from '../../hooks/use-profile';

interface BasicInfoFormProps {
  initialData?: {
    username?: string;
    display_name?: string;
    bio?: string;
    country?: string;
  };
  onNext: (data: {
    username: string;
    display_name: string;
    bio: string;
    country: string;
  }) => void;
}

const COUNTRIES = [
  'United States',
  'China',
  'India',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'Canada',
  'Australia',
  'Brazil',
  'Russia',
  'Other',
];

export function BasicInfoForm({ initialData, onNext }: BasicInfoFormProps) {
  const [username, setUsername] = useState(initialData?.username || '');
  const [displayName, setDisplayName] = useState(initialData?.display_name || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  const { checkUsernameAvailable } = useProfile();

  const validateUsername = (value: string): boolean => {
    // 3-20 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(value)) {
      setUsernameError('Username must be 3-20 characters (letters, numbers, underscore)');
      return false;
    }
    setUsernameError(null);
    return true;
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    
    if (value.length >= 3) {
      if (!validateUsername(value)) return;
      
      setCheckingUsername(true);
      const isAvailable = await checkUsernameAvailable(value);
      setCheckingUsername(false);
      
      if (!isAvailable) {
        setUsernameError('Username is already taken');
      }
    } else {
      setUsernameError(null);
    }
  };

  const handleSubmit = () => {
    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    }

    if (usernameError) return;

    onNext({
      username: username.trim(),
      display_name: displayName.trim(),
      bio: bio.trim(),
      country,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          This information will be displayed on your public profile
        </Text>

        <View style={styles.form}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Username <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.usernameContainer}>
              <TextInput
                style={[
                  styles.input,
                  usernameError ? styles.inputError : null,
                ]}
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="your_username"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {checkingUsername && (
                <ActivityIndicator 
                  size="small" 
                  style={styles.usernameSpinner} 
                />
              )}
            </View>
            {usernameError && (
              <Text style={styles.errorText}>{usernameError}</Text>
            )}
            <Text style={styles.hint}>
              3-20 characters, letters, numbers, and underscore only
            </Text>
          </View>

          {/* Display Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your Display Name"
              maxLength={100}
            />
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
              maxLength={280}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length}/280</Text>
          </View>

          {/* Country */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowCountryPicker(!showCountryPicker)}
            >
              <Text style={country ? styles.selectText : styles.selectPlaceholder}>
                {country || 'Select your country'}
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>

            {showCountryPicker && (
              <ScrollView style={styles.countryList}>
                {COUNTRIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.countryItem}
                    onPress={() => {
                      setCountry(c);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text style={styles.countryText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 32,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameSpinner: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  selectButton: {
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#ffffff',
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#6b7280',
  },
  selectArrow: {
    fontSize: 12,
    color: '#9ca3af',
  },
  countryList: {
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    maxHeight: 200,
    marginTop: 4,
  },
  countryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  countryText: {
    fontSize: 16,
    color: '#ffffff',
  },
  nextButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
