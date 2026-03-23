/**
 * Modern Color Palette for Mentali App
 * Clean, minimal, and soothing colors for mental wellness
 */

export const Colors = {
  light: {
    // Primary
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    
    // Background
    background: '#FAFAFA',
    backgroundSecondary: '#F5F3FF',
    
    // Text
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    
    // Cards & Surfaces
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    cardShadow: 'rgba(139, 92, 246, 0.08)',
    
    // Accent colors
    accent: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    
    // Legacy compatibility
    tint: '#8B5CF6',
    icon: '#8B5CF6',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#8B5CF6',
    secondaryText: '#6B7280',
    divider: '#E5E7EB',
    blurBg: 'rgba(139, 92, 246, 0.05)',
    fabGradient: ['#8B5CF6', '#EC4899'],
  },
  dark: {
    // Primary
    primary: '#A78BFA',
    primaryLight: '#C4B5FD',
    primaryDark: '#8B5CF6',
    
    // Background
    background: '#0F0F0F',
    backgroundSecondary: '#1A1A1A',
    
    // Text
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    
    // Cards & Surfaces
    card: '#1A1A1A',
    cardBorder: '#2D2D2D',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    
    // Accent colors
    accent: '#F472B6',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    
    // Legacy compatibility
    tint: '#A78BFA',
    icon: '#A78BFA',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#A78BFA',
    secondaryText: '#D1D5DB',
    divider: '#2D2D2D',
    blurBg: 'rgba(0, 0, 0, 0.5)',
    fabGradient: ['#8B5CF6', '#EC4899'],
  },
};

// Emotion colors - modern palette
export const EMOTION_COLORS: Record<string, { color: string; gradient: string[] }> = {
  joy: { color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B'] },
  sadness: { color: '#60A5FA', gradient: ['#60A5FA', '#3B82F6'] },
  fear: { color: '#A78BFA', gradient: ['#A78BFA', '#8B5CF6'] },
  anger: { color: '#F87171', gradient: ['#F87171', '#EF4444'] },
  love: { color: '#F472B6', gradient: ['#F472B6', '#EC4899'] },
  anxiety: { color: '#FB923C', gradient: ['#FB923C', '#F97316'] },
  hope: { color: '#34D399', gradient: ['#34D399', '#10B981'] },
  calm: { color: '#818CF8', gradient: ['#818CF8', '#6366F1'] },
  gratitude: { color: '#F472B6', gradient: ['#F472B6', '#EC4899'] },
  surprise: { color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B'] },
  default: { color: '#A78BFA', gradient: ['#A78BFA', '#8B5CF6'] },
};
