import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: darkMode ? '#0F0F0F' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: darkMode ? '#2D2D2D' : '#E5E7EB',
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOpacity: darkMode ? 0.3 : 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarInactiveTintColor: darkMode ? '#6B7280' : '#9CA3AF',
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="premios"
        options={{
          title: 'Premios',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={24} name="trophy-award" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="psicologo"
        options={{
          title: 'Psicólogo',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="brain" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={24} name="person.crop.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
