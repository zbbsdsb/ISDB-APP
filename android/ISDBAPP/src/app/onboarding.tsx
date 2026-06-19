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
import { supabase } from '../services/supabase';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation';

type OnboardingScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'Onboarding'>;
};

type Step = 'basic' | 'skills' | 'interests' | 'goal' | 'ceremony';

type GoalOption = 'seeking' | 'recruiting' | 'both';

interface FormData {
  username: string;
  display_name: string;
  bio: string;
  country: string;
  skills: string[];
  interests: string[];
  goal?: GoalOption | null;
}

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const { user } = useAuth();
  const { createProfile, getProfile, checkProfileComplete } = useProfile();
  const { tags, loading: tagsLoading } = useTags();
  
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [submitting, setSubmitting] = useState(false);
  const [builderId, setBuilderId] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);

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

  const handleInterestsNext = () => {
    setCurrentStep('goal');
  };

  const handleGoalComplete = async () => {
    // Build complete data object from current state + goal
    const finalData: FormData = {
      ...formData,
      goal: selectedGoal ?? null,
    };
    setFormData(finalData);
    await handleSubmit(finalData);
  };

  const handleSubmit = async (finalData: FormData) => {
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      // Create / update profile with upsert
      const success = await createProfile(user.id, {
        username: finalData.username,
        display_name: finalData.display_name || undefined,
        bio: finalData.bio || undefined,
        country: finalData.country || undefined,
        skills: finalData.skills,
        interests: finalData.interests,
        goal: (finalData.goal as string) || undefined,
      });

      if (success) {
        // Step 1: Call RPC to ensure official identity_number is allocated
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'ensure_identity_number',
          { p_user_id: user.id }
        );

        if (rpcError) {
          console.error('[onboarding] ensure_identity_number RPC error:', rpcError);
        }

        // Step 2: Fallback chain — RPC result → existing profile field → error
        let identityNumber: number;
        if (rpcError || !rpcData) {
          // RPC failed — try reading from existing profile
          const existingProfile = await getProfile(user.id);
          identityNumber = (existingProfile as any)?.identity_number || 1;
        } else {
          identityNumber = (rpcData as number) || 1;
        }

        // Step 3: Write identity_number back to profiles table for consistency
        await supabase
          .from('profiles')
          .update({ identity_number: identityNumber })
          .eq('id', user.id);

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
      case 'goal':
        setCurrentStep('interests');
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
      case 'goal': return 4;
      case 'ceremony': return 4;
      default: return 1;
    }
  };

  const totalSteps = currentStep === 'ceremony' ? 4 : 4;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {currentStep !== 'ceremony' && (
        <View style={styles.header}>
          <StepIndicator totalSteps={totalSteps} currentStep={getStepNumber()} />
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
              onTagsChange={(tags) => {
                setFormData(prev => ({ ...prev, interests: tags }));
              }}
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
                  styles.nextButton,
                  formData.interests.length < 1 && styles.nextButtonDisabled,
                ]}
                onPress={handleInterestsNext}
                disabled={formData.interests.length < 1}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStep === 'goal' && (
          <View style={styles.goalStep}>
            <Text style={styles.title}>What's your goal?</Text>
            <Text style={styles.subtitle}>
              Tell us what you're looking for
            </Text>

            <View style={styles.goalOptions}>
              {([
                { value: 'seeking', label: 'Find a Project', desc: 'I want to join an existing project' },
                { value: 'recruiting', label: 'Recruit Teammates', desc: 'I have a project and need collaborators' },
                { value: 'both', label: 'Open to Both', desc: "I'm flexible — happy to join or recruit" },
              ] as { value: GoalOption; label: string; desc: string }[]).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.goalOption,
                    selectedGoal === option.value && styles.goalOptionSelected,
                  ]}
                  onPress={() => setSelectedGoal(option.value)}
                >
                  <Text style={styles.goalLabel}>{option.label}</Text>
                  <Text style={styles.goalDesc}>{option.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.completeButton,
                  !selectedGoal && styles.nextButtonDisabled,
                ]}
                onPress={handleGoalComplete}
                disabled={!selectedGoal || submitting}
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
  goalStep: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  goalOptions: {
    gap: 12,
  },
  goalOption: {
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  goalOptionSelected: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
