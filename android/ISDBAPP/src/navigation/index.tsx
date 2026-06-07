import { useEffect, useRef, useState } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme, ThemeProvider } from '../hooks/use-theme';
import { useAuth } from '../hooks/use-auth';
import { useProfile } from '../hooks/use-profile';
import { DEEP_LINK_SCHEME } from '../constants';
import {
  LandingScreen,
  HomeScreen,
  SwipeScreen,
  ProjectsScreen,
  MatchesScreen,
  ProfileScreen,
  LoginScreen,
  AuthCallbackScreen,
  OnboardingScreen,
} from '../app';

// Type definitions
export type RootStackParamList = {
  Landing: undefined;
  Auth: undefined;
  AuthCallback: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  AuthCallback: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Swipe: undefined;
  Projects: undefined;
  Matches: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [`${DEEP_LINK_SCHEME}://`],
  config: {
    screens: {
      Landing: 'landing',
      Auth: {
        screens: {
          Login: 'auth/login',
          AuthCallback: 'auth/callback',
        },
      },
      Onboarding: 'onboarding',
      Main: {
        screens: {
          Home: 'home',
          Swipe: 'swipe',
          Projects: 'projects',
          Matches: 'matches',
          Profile: 'profile',
        },
      },
    },
  },
};

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Swipe: '👆',
    Projects: '📁',
    Matches: '💬',
    Profile: '👤',
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={{ fontSize: focused ? 24 : 20 }}>{icons[name] || '•'}</Text>
    </View>
  );
}

function AuthNavigator() {
  const { colors } = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="AuthCallback" component={AuthCallbackScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  const { colors } = useTheme();

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Swipe" component={SwipeScreen} />
      <MainTab.Screen name="Projects" component={ProjectsScreen} />
      <MainTab.Screen name="Matches" component={MatchesScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading, initialized } = useAuth();
  const { getProfile, checkProfileComplete } = useProfile();
  const { colors, isDark } = useTheme();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const onboardingCheckRef = useRef(false);

  // Show loading screen while initializing
  if (!initialized) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Check if user needs onboarding
  useEffect(() => {
    // Mark this effect run as stale when cleanup runs
    onboardingCheckRef.current = false;

    const checkOnboarding = async () => {
      if (!user) {
        setNeedsOnboarding(false);
        return;
      }

      const profile = await getProfile(user.id);
      // Guard: if this effect run is stale, skip state update
      if (onboardingCheckRef.current) return;
      const isComplete = checkProfileComplete(profile);
      setNeedsOnboarding(!isComplete);
    };

    if (user) {
      checkOnboarding();
    }

    return () => {
      onboardingCheckRef.current = true;
    };
  }, [user, getProfile, checkProfileComplete]);

  if (needsOnboarding === null) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Determine initial route based on auth status and profile completeness
  let initialRouteName: keyof RootStackParamList = 'Landing';
  if (user) {
    initialRouteName = needsOnboarding ? 'Onboarding' : 'Main';
  }

  return (
    <RootStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade_from_bottom',
      }}
    >
      <RootStack.Screen name="Landing" component={LandingScreen} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="AuthCallback" component={AuthCallbackScreen} />
      <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  );
}

export function Navigation() {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer
      linking={linking}
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
