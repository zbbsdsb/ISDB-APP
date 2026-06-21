import React from 'react';
import Svg, {Path, Circle, type SvgProps} from 'react-native-svg';
import {useTheme} from '../../hooks/use-theme';

type IconSize = 'sm' | 'md' | 'lg' | number;

interface IconProps extends Omit<SvgProps, 'width' | 'height'> {
  name: IconName;
  size?: IconSize;
  color?: string;
}

export type IconName =
  | 'github'
  | 'discord'
  | 'google'
  | 'home'
  | 'swipe'
  | 'projects'
  | 'matches'
  | 'profile'
  | 'back'
  | 'close'
  | 'share'
  | 'settings'
  | 'arrowRight'
  | 'arrowLeft'
  | 'send'
  | 'search'
  | 'plus'
  | 'check'
  | 'bell'
  | 'logout'
  | 'arrowDown';

const sizeMap: Record<string, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

function getSize(s: IconSize): number {
  if (typeof s === 'number') {
    return s;
  }
  return sizeMap[s] ?? 24;
}

/**
 * ISDB App Icon component — SVG brand icons via react-native-svg.
 * All icons use currentColor fill (or explicit color prop) to adapt to theme.
 */
export function Icon({name, size = 'md', color, ...svgProps}: IconProps) {
  const {colors} = useTheme();
  const s = getSize(size);
  const fill = color ?? colors.onBackground;

  const icon = renderIcon(name, fill);

  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none" {...svgProps}>
      {icon}
    </Svg>
  );
}

function renderIcon(name: IconName, fill: string) {
  const props = {fill};

  switch (name) {
    // ── Brand Icons ──
    case 'github':
      return (
        <Path
          {...props}
          d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
        />
      );

    case 'discord':
      return (
        <Path
          {...props}
          d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
        />
      );

    case 'google':
      return (
        <>
          <Path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <Path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <Path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <Path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </>
      );

    // ── Tab Icons ──
    case 'home':
      return (
        <Path fill={fill} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      );

    case 'swipe':
      return (
        <>
          <Path
            d="M6 3l-3 3 3 3"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M18 3l3 3-3 3"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Circle
            cx="12"
            cy="12"
            r="3"
            stroke={fill}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M12 3v2m0 14v2"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
        </>
      );

    case 'projects':
      return (
        <Path
          d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'matches':
      return (
        <Path
          d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'profile':
      return (
        <>
          <Circle
            cx="12"
            cy="8"
            r="4"
            stroke={fill}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M20 21a8 8 0 00-16 0"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
        </>
      );

    // ── Action Icons ──
    case 'back':
    case 'arrowLeft':
      return (
        <Path
          d="M19 12H5m7 7l-7-7 7-7"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'arrowRight':
      return (
        <Path
          d="M5 12h14m-7-7l7 7-7 7"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'close':
      return (
        <Path
          d="M18 6L6 18M6 6l12 12"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'share':
      return (
        <>
          <Circle
            cx="18"
            cy="5"
            r="3"
            stroke={fill}
            strokeWidth={2}
            fill="none"
          />
          <Circle
            cx="6"
            cy="12"
            r="3"
            stroke={fill}
            strokeWidth={2}
            fill="none"
          />
          <Circle
            cx="18"
            cy="19"
            r="3"
            stroke={fill}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
        </>
      );

    case 'settings':
      return (
        <Path
          d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'send':
      return (
        <Path
          d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'search':
      return (
        <>
          <Circle
            cx="11"
            cy="11"
            r="8"
            stroke={fill}
            strokeWidth={2}
            fill="none"
          />
          <Path
            d="M21 21l-4.35-4.35"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
        </>
      );

    case 'arrowDown':
      return (
        <Path
          d="M6 9l6 6 6-6"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'plus':
      return (
        <Path
          d="M12 5v14m-7-7h14"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'check':
      return (
        <Path
          d="M20 6L9 17l-5-5"
          stroke={fill}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'bell':
      return (
        <>
          <Path
            d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M13.73 21a2 2 0 01-3.46 0"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      );

    case 'logout':
      return (
        <>
          <Path
            d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M16 17l5-5-5-5M21 12H9"
            stroke={fill}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      );

    default:
      return <Circle cx="12" cy="12" r="8" fill={fill} opacity={0.3} />;
  }
}
