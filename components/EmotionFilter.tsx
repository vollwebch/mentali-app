import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/Colors';

const EMOTIONS = [
  { key: 'all', emoji: '✨', label: 'Todos' },
  { key: 'joy', emoji: '😊', label: 'Alegría' },
  { key: 'sadness', emoji: '😢', label: 'Tristeza' },
  { key: 'fear', emoji: '😰', label: 'Miedo' },
  { key: 'anger', emoji: '😠', label: 'Ira' },
  { key: 'love', emoji: '💝', label: 'Amor' },
  { key: 'anxiety', emoji: '😟', label: 'Ansiedad' },
  { key: 'hope', emoji: '🌟', label: 'Esperanza' },
  { key: 'calm', emoji: '🧘', label: 'Calma' },
  { key: 'gratitude', emoji: '🙏', label: 'Gratitud' },
  { key: 'surprise', emoji: '😮', label: 'Sorpresa' },
  { key: 'loneliness', emoji: '🥺', label: 'Soledad' },
  { key: 'stress', emoji: '😫', label: 'Estrés' },
  { key: 'motivation', emoji: '💪', label: 'Motivación' },
];

interface EmotionFilterProps {
  selected?: string;
  onSelect?: (key: string) => void;
}

export default function EmotionFilter({ selected = 'all', onSelect }: EmotionFilterProps) {
  const scrollRef = useRef<ScrollView>(null);
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const colors = Colors[theme];

  return (
    <View style={[
      styles.container, 
      { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }
    ]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        bounces
      >
        {EMOTIONS.map((emotion) => {
          const isActive = selected === emotion.key;
          
          return (
            <TouchableOpacity
              key={emotion.key}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive 
                    ? (darkMode ? 'rgba(167, 139, 250, 0.15)' : '#F5F3FF')
                    : (darkMode ? '#161616' : '#FAFAFA'),
                  borderColor: isActive 
                    ? colors.primary 
                    : (darkMode ? '#252525' : '#ECECEC'),
                  shadowOpacity: isActive ? 0.08 : 0,
                }
              ]}
              onPress={() => onSelect?.(emotion.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{emotion.emoji}</Text>
              <Text style={[
                styles.label, 
                { 
                  color: isActive 
                    ? colors.primary 
                    : (darkMode ? '#9CA3AF' : '#6B7280'),
                  fontWeight: isActive ? '700' : '500'
                }
              ]}>
                {emotion.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: Platform.OS === 'web' ? 0 : 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    minWidth: 75,
    shadowColor: '#8B5CF6',
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  emoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});
