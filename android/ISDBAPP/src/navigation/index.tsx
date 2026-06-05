import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { DEEP_LINK_SCHEME } from '../constants';
import {
  LandingScreen,
  HomeScreen,
  SwipeScreen,
  ProjectsScreen,
  MatchesScreen,
  ProfileScreen,
  LoginScreen,
} from '../app';

// Type definitions
export type RootStackParamList = {
  Landing: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
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
        },
      },
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

interface LandingScreenNavigationProps {
  onLogin: () => void;
}

function LandingScreenWrapper({ navigation }: any) {
  const handleLogin = () => {
    navigation.navigate('Auth');
  };
  return <LandingScreen onLogin={handleLogin} />;
}

export function Navigation() {
  const { colors, isDark } = useTheme();

  // For now, show landing screen
  // In full implementation, this would check auth state
  const initialRouteName: keyof RootStackParamList = 'Landing';

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
      <RootStack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <RootStack.Screen name="Landing" component={LandingScreenWrapper} />
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Main" component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
