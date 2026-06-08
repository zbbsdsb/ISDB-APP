import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { useTags } from '../hooks/use-tags';
import { BasicInfoForm } from '../components/onboarding/basic-info-form';
import { TagSelector } from '../components/onboarding/tag-selector';
import { IdentityCeremony } from '../components/onboarding/identity-ceremony';
import { StepIndicator } from '../components/onboarding/step-indicator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const { user } = useAuth();
  const { createProfile, getProfile, checkProfileComplete } = useProfile();
  const { tags, loading: tagsLoading } = useTags();
  
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
      if (!user) return;
      
      const profile = await getProfile(user.id);
      if (profile && checkProfileComplete(profile)) {
        // User already has complete profile, redirect to home
        navigation.navigate('Main');
      }
    };

    checkExistingProfile();
  }, [user]);

  const handleBasicInfoNext = (data: {
    username: string;
    display_name: string;
    bio: string;
    country: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      username: data.username,
      display_name: data.display_name,
      bio: data.bio,
      country: data.country,
    }));
    setCurrentStep('skills');
  };

  const handleSkillsNext = (skills: string[]) => {
    setFormData(prev => ({
      ...prev,
      skills,
    }));
    setCurrentStep('interests');
  };

  const handleInterestsComplete = async (interests: string[]) => {
    setFormData(prev => ({
      ...prev,
      interests,
    }));
    
    // Submit profile to database
    await handleSubmit({ ...formData, interests });
  };

  const handleSubmit = async (finalData: FormData) => {
    if (!user) return;
    
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
        // Get builder ID from profile (simulated - in real app this would come from database)
        const profile = await getProfile(user.id);
        const identityNumber = profile?.id ? 
          parseInt(profile.id.split('-')[0], 16) % 1000000 || 1 : 
          Math.floor(Math.random() * 1000000) + 1;
        
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
    navigation.navigate('Main');
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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </SafeAreaView>
    );
  }

  const getStepNumber = (): number => {
    switch (currentStep) {
      case 'basic': return 1;
      case 'skills': return 2;
      case 'interests': return 3;
      case 'ceremony': return 4;
      default: return 1;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.title}>What are your skills?</Text>
            <Text style={styles.subtitle}>
              Select the technologies and skills you're experienced in
            </Text>
            
            <TagSelector
              label="Skills"
              selectedTags={formData.skills}
              availableTags={tags}
              onTagsChange={handleSkillsNext}
              minTags={1}
              maxTags={10}
              placeholder="Search skills..."
              loading={tagsLoading}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  formData.skills.length < 1 && styles.nextButtonDisabled,
                ]}
                onPress={() => handleSkillsNext(formData.skills)}
                disabled={formData.skills.length < 1}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 'interests' && (
          <View style={styles.tagForm}>
            <Text style={styles.title}>What are your interests?</Text>
            <Text style={styles.subtitle}>
              Select topics and areas you're interested in
            </Text>
            
            <TagSelector
              label="Interests"
              selectedTags={formData.interests}
              availableTags={tags}
              onTagsChange={handleInterestsComplete}
              minTags={1}
              maxTags={5}
              placeholder="Search interests..."
              loading={tagsLoading}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  formData.interests.length < 1 && styles.nextButtonDisabled,
                ]}
                onPress={() => handleInterestsComplete(formData.interests)}
                disabled={formData.interests.length < 1 || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Text style={styles.completeButtonText}>Complete Setup</Text>
                )}
              </TouchableOpacity>
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
    backgroundColor: '#0f0f0f',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  completeButton: {
    flex: 2,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
