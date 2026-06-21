import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../hooks/use-auth';
import {useTheme} from '../hooks/use-theme';
import {useProfile} from '../hooks/use-profile';
import {useTags} from '../hooks/use-tags';
import {BasicInfoForm} from '../components/onboarding/basic-info-form';
import {TagSelector} from '../components/onboarding/tag-selector';
import {IdentityCeremony} from '../components/onboarding/identity-ceremony';
import {StepIndicator} from '../components/onboarding/step-indicator';
import {Button} from '../components/ui';
import {m3Typography} from '../constants/m3-typography';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

type Step = 'basic' | 'skills' | 'interests' | 'ceremony';

interface FormData {
  username: string;
  display_name: string;
  bio: string;
  country: string;
  skills: string[];
  interests: string[];
}

export default function OnboardingScreen({navigation}: OnboardingScreenProps) {
  const {colors} = useTheme();
  const {user} = useAuth();
  const {createProfile, getProfile, checkProfileComplete} = useProfile();
  const {tags, loading: tagsLoading} = useTags();

  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [submitting, setSubmitting] = useState(false);
  const [builderId, setBuilderId] = useState<number>(1);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    display_name: '',
    bio: '',
    country: '',
    skills: [],
    interests: [],
  });

  // Check if user already has a complete profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) {return;}

      const profile = await getProfile(user.id);
      if (profile && checkProfileComplete(profile)) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      }
    };

    checkExistingProfile();
  }, [user, checkProfileComplete, getProfile, navigation]);

  const handleBasicInfoNext = (data: {
    username: string;
    display_name: string;
    bio: string;
    country: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
    setCurrentStep('skills');
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({...prev, skills}));
  };

  const handleInterestsChange = (interests: string[]) => {
    setFormData(prev => ({...prev, interests}));
  };

  const handleSkillsNext = () => {
    setCurrentStep('interests');
  };

  const handleInterestsComplete = async () => {
    const completeData: FormData = {
      ...formData,
    };
    await handleSubmit(completeData);
  };

  const handleSubmit = async (finalData: FormData) => {
    if (!user) {return;}

    setSubmitting(true);

    try {
      const success = await createProfile(user.id, {
        username: finalData.username,
        display_name: finalData.display_name || undefined,
        bio: finalData.bio || undefined,
        country: finalData.country || undefined,
        skills: finalData.skills,
        interests: finalData.interests,
      });

      if (success) {
        const profile = await getProfile(user.id);
        const identityNumber = profile?.id
          ? parseInt(profile.id.split('-')[0], 16) % 1000000 || 1
          : Math.floor(Math.random() * 1000000) + 1;

        setBuilderId(identityNumber);
        setCurrentStep('ceremony');
      } else {
        Alert.alert('Error', 'Failed to create profile. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCeremonyComplete = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Main'}],
    });
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'skills':
        setCurrentStep('basic');
        break;
      case 'interests':
        setCurrentStep('skills');
        break;
    }
  };

  if (!user) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const getStepNumber = (): number => {
    switch (currentStep) {
      case 'basic':
        return 1;
      case 'skills':
        return 2;
      case 'interests':
        return 3;
      case 'ceremony':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      {currentStep !== 'ceremony' && (
        <View style={styles.header}>
          <StepIndicator totalSteps={3} currentStep={getStepNumber()} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {currentStep === 'basic' && (
          <BasicInfoForm onNext={handleBasicInfoNext} />
        )}

        {currentStep === 'skills' && (
          <View style={styles.tagForm}>
            <Text style={[styles.title, {color: colors.onBackground}]}>
              What are your skills?
            </Text>
            <Text style={[styles.subtitle, {color: colors.onSurfaceVariant}]}>
              Select the technologies and skills you're experienced in
            </Text>

            <TagSelector
              label="Skills"
              selectedTags={formData.skills}
              availableTags={tags}
              onTagsChange={handleSkillsChange}
              minTags={1}
              maxTags={10}
              placeholder="Search skills..."
              loading={tagsLoading}
            />

            <View style={styles.buttonRow}>
              <Button title="Back" onPress={handleBack} variant="text" />
              <Button
                title="Next"
                onPress={handleSkillsNext}
                variant="filled"
                disabled={formData.skills.length < 1}
              />
            </View>
          </View>
        )}

        {currentStep === 'interests' && (
          <View style={styles.tagForm}>
            <Text style={[styles.title, {color: colors.onBackground}]}>
              What are your interests?
            </Text>
            <Text style={[styles.subtitle, {color: colors.onSurfaceVariant}]}>
              Select topics and areas you're interested in
            </Text>

            <TagSelector
              label="Interests"
              selectedTags={formData.interests}
              availableTags={tags}
              onTagsChange={handleInterestsChange}
              minTags={1}
              maxTags={5}
              placeholder="Search interests..."
              loading={tagsLoading}
            />

            <View style={styles.buttonRow}>
              <Button title="Back" onPress={handleBack} variant="text" />
              <Button
                title={submitting ? 'Saving...' : 'Complete Setup'}
                onPress={handleInterestsComplete}
                variant="filled"
                disabled={formData.interests.length < 1 || submitting}
                loading={submitting}
              />
            </View>
          </View>
        )}

        {currentStep === 'ceremony' && (
          <IdentityCeremony
            builderId={builderId}
            username={formData.username}
            onComplete={handleCeremonyComplete}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  content: {
    flex: 1,
  },
  tagForm: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  title: {
    ...m3Typography.headlineLarge,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 24,
  },
});
