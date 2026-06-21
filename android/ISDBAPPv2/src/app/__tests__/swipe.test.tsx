/** SwipeScreen component tests */
import React from 'react';
import renderer from 'react-test-renderer';
import { it, describe, expect, jest, beforeEach } from '@jest/globals';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
jest.mock('@react-navigation/native-stack', () => ({}));

const mockColors = {
  primary: '#6750A4', onPrimary: '#FFFFFF', background: '#FFFBFE',
  onBackground: '#1C1B1F', surface: '#FFFBFE', onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F', error: '#B3261E',
  secondaryContainer: '#E8DEF8', onSecondaryContainer: '#1D192B',
};

jest.mock('../../hooks/use-theme', () => ({ useTheme: () => ({ colors: mockColors, isDark: false }) }));
jest.mock('../../hooks/use-toast', () => ({ useToast: () => ({ show: jest.fn(), ToastComponent: null }) }));

const mockSubmitSwipe = jest.fn();
const mockLoadProjects = jest.fn();
const mockUndoLastSwipe = jest.fn();

interface MockState { projects: any[]; loading: boolean; error: string | null; currentIndex: number; canUndo: boolean; }
let mockState: MockState = { projects: [], loading: false, error: null, currentIndex: 0, canUndo: false };

jest.mock('../../hooks/use-swipe', () => ({
  useSwipe: () => ({
    ...mockState, loadProjects: mockLoadProjects, submitSwipe: mockSubmitSwipe,
    undoLastSwipe: mockUndoLastSwipe, hasMore: true, loadingMore: false,
  }),
}));

jest.mock('../../constants/m3-typography', () => ({
  m3Typography: {
    headlineSmall: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    titleMedium: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    titleSmall: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    labelLarge: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
    labelMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    labelSmall: { fontSize: 11, fontWeight: '500', lineHeight: 16 },
  },
}));
jest.mock('../../constants/m3-spacing', () => ({
  m3Spacing: { none: 0, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },
}));
jest.mock('../../constants/m3-shape', () => ({ m3Shape: { small: 8, medium: 12, large: 16 } }));
jest.mock('../../components/ui', () => ({
  Button: ({ title, onPress, disabled }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return <TouchableOpacity onPress={onPress} disabled={disabled}><Text>{title}</Text></TouchableOpacity>;
  },
  Card: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
  Icon: () => null,
}));

import { SwipeScreen } from '../swipe';

describe('SwipeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = { projects: [], loading: false, error: null, currentIndex: 0, canUndo: false };
  });

  // ── UI State Tests ──
  it('renders Discover title', () => {
    const tree = renderer.create(<SwipeScreen />);
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'Discover')).toBeTruthy();
  });

  it('shows loading state', () => {
    mockState.loading = true;
    const tree = renderer.create(<SwipeScreen />);
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'Loading projects...')).toBeTruthy();
  });

  it('shows error state with retry button', () => {
    mockState.error = 'Something went wrong';
    const tree = renderer.create(<SwipeScreen />);
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'Something went wrong')).toBeTruthy();
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'Retry')).toBeTruthy();
  });

  it('shows empty state when no projects', () => {
    const tree = renderer.create(<SwipeScreen />);
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'No more projects to discover!')).toBeTruthy();
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'Refresh')).toBeTruthy();
  });

  it('shows project card when projects available', () => {
    mockState.projects = [{ id: 'p1', title: 'Test Project', description: 'A test description', tags: ['react'], required_skills: [], owner: { username: 'u1', display_name: 'User 1' } }];
    const tree = renderer.create(<SwipeScreen />);
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'Test Project')).toBeTruthy();
  });

  it('shows Undo button when canUndo is true', () => {
    mockState = { projects: [{ id: 'p1', title: 'P', description: 'D', tags: [], required_skills: [], owner: { username: 'u1' } }], loading: false, error: null, currentIndex: 0, canUndo: true };
    const tree = renderer.create(<SwipeScreen />);
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'Undo')).toBeTruthy();
  });

  // ── Integration Behavior Tests ──
  it('calls loadProjects on mount', () => {
    renderer.create(<SwipeScreen />);
    expect(mockLoadProjects).toHaveBeenCalledTimes(1);
  });

  it('handles missing owner display_name gracefully', () => {
    mockState.projects = [{ id: 'p1', title: 'No Name', description: 'D', tags: [], required_skills: [], owner: { username: 'uname' } }];
    const tree = renderer.create(<SwipeScreen />);
    expect(tree.root.find((el: any) => el.type === 'Text' && el.props.children === 'No Name')).toBeTruthy();
  });
});