import React from 'react';
import {Linking} from 'react-native';
import {Button} from '../ui';
import {m3Spacing} from '../../constants/m3-spacing';

interface CtaBlockProps {
  config: Record<string, any>;
}

export default function CtaBlock({config}: CtaBlockProps) {
  const text: string = config?.text || 'Learn More';
  const url: string = config?.url || '';

  const handlePress = () => {
    if (url) {Linking.openURL(url);}
  };

  if (!url) {return null;}

  return (
    <Button
      title={text}
      onPress={handlePress}
      variant="filled"
      fullWidth
      style={{marginBottom: m3Spacing.md}}
    />
  );
}
