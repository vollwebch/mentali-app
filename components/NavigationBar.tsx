import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/Colors';

interface NavigationBarProps {
  onMapPress?: () => void;
  onProfilePress?: () => void;
}

export default function NavigationBar({ onMapPress, onProfilePress }: NavigationBarProps) {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';
  const colors = Colors[theme];

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        borderBottomColor: darkMode ? '#2D2D2D' : '#F3F4F6'
      }
    ]}>
      {/* Logo */}
      <View style={styles.leftSection}>
        <View style={[
          styles.logoContainer, 
          { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }
        ]}>
          <MaterialCommunityIcons name="brain" size={22} color={colors.primary} />
        </View>
        <Text style={[styles.brandName, { color: colors.text }]}>Mentali</Text>
      </View>

      {/* Actions */}
      <View style={styles.rightSection}>
        <TouchableOpacity 
          onPress={toggleTheme} 
          style={[
            styles.iconButton, 
            { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={darkMode ? 'white-balance-sunny' : 'weather-night'}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onMapPress} 
          style={[
            styles.iconButton, 
            { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }
          ]}
          activeOpacity={0.7}
        >
          <Feather name="globe" size={20} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onProfilePress} 
          style={[
            styles.iconButton, 
            { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }
          ]}
          activeOpacity={0.7}
        >
          <Feather name="user" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
