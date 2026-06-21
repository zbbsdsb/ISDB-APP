import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer, LinkingOptions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../hooks/use-theme';
import {useAuth} from '../hooks/use-auth';
import {useProfile} from '../hooks/use-profile';
import {DEEP_LINK_SCHEME} from '../constants';
import {Icon, type IconName} from '../components/ui';
import {m3Elevation} from '../constants/m3-elevation';
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
  ProjectDetailScreen,
  MessageChatScreen,
  GroupDetailScreen,
  GroupCreateScreen,
  BadgesScreen,
  SettingsScreen,
  ReferralScreen,
  GatheringScreen,
} from '../app';

// Type definitions
export type RootStackParamList = {
  Landing: undefined;
  Auth: undefined;
  AuthCallback: undefined;
  Onboarding: undefined;
  Main: undefined;
  ProjectDetail: {projectId: string};
  MessageChat: {matchId: string; title: string};
  GroupDetail: {groupId: string};
  GroupCreate: undefined;
  Badges: undefined;
  Settings: undefined;
  Referral: undefined;
  Gathering: undefined;
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
      Gathering: 'gathering',
    },
  },
};

// M3 Navigation Bar — replaces emoji TabIcon
const TAB_ICONS: Record<string, IconName> = {
  Home: 'home',
  Swipe: 'swipe',
  Projects: 'projects',
  Matches: 'matches',
  Profile: 'profile',
};

function TabIcon({
  name,
  focused,
  color,
}: {
  name: string;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={styles.tabIcon}>
      <Icon
        name={TAB_ICONS[name] || 'home'}
        size={focused ? 24 : 22}
        color={color}
      />
      {/* Active indicator dot */}
      {focused && <View style={[styles.activeDot, {backgroundColor: color}]} />}
    </View>
  );
}

function AuthNavigator() {
  const {colors} = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="AuthCallback" component={AuthCallbackScreen} />
    </AuthStack.Navigator>
  );
}

// Module-level per-tab icon components (stable references, avoids react/no-unstable-nested-components)
function HomeTabIcon(props: {focused: boolean; color: string}) {
  return <TabIcon name="home" {...props} />;
}
function SwipeTabIcon(props: {focused: boolean; color: string}) {
  return <TabIcon name="swipe" {...props} />;
}
function ProjectsTabIcon(props: {focused: boolean; color: string}) {
  return <TabIcon name="projects" {...props} />;
}
function MatchesTabIcon(props: {focused: boolean; color: string}) {
  return <TabIcon name="matches" {...props} />;
}
function ProfileTabIcon(props: {focused: boolean; color: string}) {
  return <TabIcon name="profile" {...props} />;
}

const TAB_ICON_MAP: Record<
  string,
  React.ComponentType<{focused: boolean; color: string}>
> = {
  Home: HomeTabIcon,
  Swipe: SwipeTabIcon,
  Projects: ProjectsTabIcon,
  Matches: MatchesTabIcon,
  Profile: ProfileTabIcon,
};

function MainNavigator() {
  const {colors} = useTheme();

  const screenOptions = React.useCallback(
    ({route}: {route: {name: string}}) => ({
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBarIcon: ({focused, color}: {focused: boolean; color: string}) => {
        const TabIconComponent = TAB_ICON_MAP[route.name] || HomeTabIcon;
        return <TabIconComponent focused={focused} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.onSurfaceVariant,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500' as const,
        letterSpacing: 0.5,
        marginTop: 2,
      },
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopWidth: 0,
        ...m3Elevation[2],
        height: 80,
        paddingBottom: 8,
        paddingTop: 6,
      },
      headerShown: false,
    }),
    [colors],
  );

  return (
    <MainTab.Navigator screenOptions={screenOptions}>
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Swipe" component={SwipeScreen} />
      <MainTab.Screen name="Projects" component={ProjectsScreen} />
      <MainTab.Screen name="Matches" component={MatchesScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

function RootNavigator() {
  const {user, initialized} = useAuth();
  const {getProfile, checkProfileComplete} = useProfile();
  const {colors} = useTheme();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const onboardingCheckRef = useRef(false);

  // Check if user needs onboarding (must NOT be before any early return)
  useEffect(() => {
    // Mark this effect run as stale when cleanup runs
    onboardingCheckRef.current = false;

    if (!user) {
      setNeedsOnboarding(false);
      return;
    }

    const checkOnboarding = async () => {
      const profile = await getProfile(user.id);
      // Guard: if this effect run is stale, skip state update
      if (onboardingCheckRef.current) {
        return;
      }
      const isComplete = checkProfileComplete(profile);
      setNeedsOnboarding(!isComplete);
    };

    checkOnboarding();

    return () => {
      onboardingCheckRef.current = true;
    };
  }, [user, getProfile, checkProfileComplete]);

  // Determine initial route based on auth status and profile completeness
  let initialRouteName: keyof RootStackParamList = 'Landing';
  if (initialized && user) {
    initialRouteName = needsOnboarding ? 'Onboarding' : 'Main';
  }

  // Show loading screen while initializing auth or checking onboarding
  if (!initialized || needsOnboarding === null) {
    return (
      <View
        style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
        animation: 'fade_from_bottom',
      }}>
      <RootStack.Screen name="Landing" component={LandingScreen} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="AuthCallback" component={AuthCallbackScreen} />
      <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      <RootStack.Screen name="Main" component={MainNavigator} />
      <RootStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <RootStack.Screen name="MessageChat" component={MessageChatScreen} />
      <RootStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <RootStack.Screen name="GroupCreate" component={GroupCreateScreen} />
      <RootStack.Screen name="Badges" component={BadgesScreen} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
      <RootStack.Screen name="Referral" component={ReferralScreen} />
      <RootStack.Screen name="Gathering" component={GatheringScreen} />
    </RootStack.Navigator>
  );
}

export function Navigation() {
  const {colors, isDark} = useTheme();

  return (
    <NavigationContainer
      linking={linking}
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.onBackground,
          border: colors.outline,
          notification: colors.tertiary,
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
      }}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
