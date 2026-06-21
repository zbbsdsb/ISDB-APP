import React, {useState} from 'react';
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
import {useTheme} from '../../hooks/use-theme';
import {useProfile} from '../../hooks/use-profile';
import {m3Typography} from '../../constants/m3-typography';
import {m3Spacing} from '../../constants/m3-spacing';
import {m3Shape} from '../../constants/m3-shape';

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

export function BasicInfoForm({initialData, onNext}: BasicInfoFormProps) {
  const {colors} = useTheme();
  const [username, setUsername] = useState(initialData?.username || '');
  const [displayName, setDisplayName] = useState(
    initialData?.display_name || '',
  );
  const [bio, setBio] = useState(initialData?.bio || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const {checkUsernameAvailable} = useProfile();

  const validateUsername = (value: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(value)) {
      setUsernameError(
        'Username must be 3-20 characters (letters, numbers, underscore)',
      );
      return false;
    }
    setUsernameError(null);
    return true;
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    if (value.length >= 3) {
      if (!validateUsername(value)) {return;}
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
    if (usernameError) {return;}
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
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, {color: colors.onBackground}]}>
          Tell us about yourself
        </Text>
        <Text style={[styles.subtitle, {color: colors.onSurfaceVariant}]}>
          This information will be displayed on your public profile
        </Text>

        <View style={styles.form}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.onBackground}]}>
              Username <Text style={{color: colors.error}}>*</Text>
            </Text>
            <View style={styles.usernameContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: usernameError ? colors.error : colors.outline,
                    color: colors.onBackground,
                  },
                  usernameError ? {borderColor: colors.error} : null,
                ]}
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="your_username"
                placeholderTextColor={colors.onSurfaceVariant}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {checkingUsername && (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={styles.usernameSpinner}
                />
              )}
            </View>
            {usernameError && (
              <Text style={[styles.errorText, {color: colors.error}]}>
                {usernameError}
              </Text>
            )}
            <Text style={[styles.hint, {color: colors.onSurfaceVariant}]}>
              3-20 characters, letters, numbers, and underscore only
            </Text>
          </View>

          {/* Display Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.onBackground}]}>
              Display Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.outline,
                  color: colors.onBackground,
                },
              ]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your Display Name"
              placeholderTextColor={colors.onSurfaceVariant}
              maxLength={100}
            />
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.onBackground}]}>
              Bio
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.outline,
                  color: colors.onBackground,
                },
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.onSurfaceVariant}
              multiline
              numberOfLines={4}
              maxLength={280}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, {color: colors.onSurfaceVariant}]}>
              {bio.length}/280
            </Text>
          </View>

          {/* Country */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.onBackground}]}>
              Country
            </Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.outline,
                },
              ]}
              onPress={() => setShowCountryPicker(!showCountryPicker)}>
              <Text
                style={
                  country
                    ? [styles.selectText, {color: colors.onBackground}]
                    : [
                        styles.selectPlaceholder,
                        {color: colors.onSurfaceVariant},
                      ]
                }>
                {country || 'Select your country'}
              </Text>
              <Text style={{color: colors.onSurfaceVariant}}>▼</Text>
            </TouchableOpacity>

            {showCountryPicker && (
              <ScrollView
                style={[
                  styles.countryList,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.outline,
                  },
                ]}>
                {COUNTRIES.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.countryItem,
                      {borderBottomColor: colors.outlineVariant},
                    ]}
                    onPress={() => {
                      setCountry(c);
                      setShowCountryPicker(false);
                    }}>
                    <Text
                      style={[
                        styles.countryText,
                        {color: colors.onBackground},
                      ]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, {backgroundColor: colors.primary}]}
          onPress={handleSubmit}>
          <Text style={[styles.nextButtonText, {color: colors.onPrimary}]}>
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: m3Spacing.lg},
  title: {
    ...m3Typography.headlineSmall,
    fontWeight: '700',
    marginBottom: m3Spacing.xs,
  },
  subtitle: {...m3Typography.bodyMedium, marginBottom: m3Spacing.xl},
  form: {gap: m3Spacing.lg},
  inputGroup: {gap: m3Spacing.xs},
  label: {...m3Typography.labelLarge, fontWeight: '600'},
  input: {
    borderWidth: 1,
    borderRadius: m3Shape.small,
    padding: m3Spacing.sm,
    fontSize: 16,
  },
  usernameContainer: {flexDirection: 'row', alignItems: 'center'},
  usernameSpinner: {marginLeft: m3Spacing.xs},
  errorText: {...m3Typography.bodySmall},
  hint: {...m3Typography.bodySmall},
  textArea: {minHeight: 100, paddingTop: m3Spacing.sm},
  charCount: {...m3Typography.bodySmall, textAlign: 'right'},
  selectButton: {
    borderWidth: 1,
    borderRadius: m3Shape.small,
    padding: m3Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {fontSize: 16},
  selectPlaceholder: {fontSize: 16},
  countryList: {
    borderWidth: 1,
    borderRadius: m3Shape.small,
    maxHeight: 200,
    marginTop: 4,
  },
  countryItem: {
    padding: m3Spacing.sm,
    borderBottomWidth: 1,
  },
  countryText: {fontSize: 16},
  nextButton: {
    borderRadius: m3Shape.small,
    padding: m3Spacing.md,
    alignItems: 'center',
    marginTop: m3Spacing.xl,
  },
  nextButtonText: {...m3Typography.labelLarge, fontWeight: '600'},
});
