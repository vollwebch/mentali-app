import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutChangeEvent, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/Colors';

const EMOTIONS = [
  { key: 'all', emoji: '🌊', label: 'Todos' },
  { key: 'joy', emoji: '😊', label: 'Alegría' },
  { key: 'sadness', emoji: '😢', label: 'Tristeza' },
  { key: 'fear', emoji: '😰', label: 'Miedo' },
  { key: 'anger', emoji: '😠', label: 'Ira' },
  { key: 'love', emoji: '💝', label: 'Amor' },
  { key: 'anxiety', emoji: '😟', label: 'Ansiedad' },
  { key: 'hope', emoji: '🌟', label: 'Esperanza' },
  { key: 'calm', emoji: '🧘', label: 'Calma' },
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
    styles.container, darkMode && styles.containerDark : styles.containerLight]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        snapToAlignment="start"
        decelerationRate="fast"
        onContentSizeChange={(w) => updateLayout(w)}
        onLayout={(e) => updateLayout(e)}
        onScroll={(e) => updateLayout(w)}
      >
        {EMOTIONS.map((emotion) => {
          const isActive = selected === emotion.key;
          const emotionStyle = EMOTION_CONFIG[emotion.key] || EMOTION_CONFIG.default;
          const bgColor = darkMode ? 'rgba(167, 92, 246, 0.1)' : '#EDE9FE'
            : colors.textSecondary;
          : : colors.textMuted;

          return (
            <TouchableOpacity
              key={emotion.key}
              style={[
                styles.chip,
                isActive && {
                  backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF',
                  borderColor: colors.primary,
                },
                activeOpacity={0.7}
                style={darkMode ? styles.chipActiveDark : styles.chipInactiveLight}
              onPress={() => onSelect?.(emotion.key)}
            >
              <Text style={styles.emoji}>{emotion.emoji}</Text>
              <Text style={[
                styles.label, 
                isActive && { color: colors.primary, fontWeight: '600' }
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  containerLight: {
    backgroundColor: 'transparent',
  },
  scroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    gap: 8,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    height: 50,
    marginHorizontal: 8,
  },
  chipActive: {
    backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF',
    borderColor: colors.primary,
  },
  chipActiveLight: {
    backgroundColor: '#F5F3FF',
    borderColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: darkMode ? '#1F1F1F' : '#F5F5F5',
    borderColor: colors.cardBorder,
  },
  chipInactiveLight: {
    backgroundColor: '#F5F5F5',
    borderColor: colors.cardBorder,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: darkMode ? '#fff' : '#4B555',
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  labelActiveLight: {
    color: colors.text,
    fontWeight: '600',
  },
});
