import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CONTENT_MAX_WIDTH = 600;

export default function TabLayout() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 1200;

  if (isLargeScreen) {
    // Return empty layout for large screens - sidebar handles navigation
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF',
            borderTopWidth: 0,
            height: 72,
            paddingBottom: Platform.OS === 'ios' ? 24 : 12,
            paddingTop: 10,
            paddingHorizontal: 8,
            shadowColor: '#000',
            shadowOpacity: darkMode ? 0.4 : 0.08,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: -8 },
            elevation: 20,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 4,
            letterSpacing: 0.2,
          },
          tabBarInactiveTintColor: darkMode ? '#4B5563' : '#9CA3AF',
          tabBarItemStyle: {
            paddingVertical: 2,
            gap: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
                <MaterialCommunityIcons name={focused ? "home" : "home-outline"} size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="premios"
          options={{
            title: 'Premios',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
                <MaterialCommunityIcons name={focused ? "trophy" : "trophy-outline"} size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="psicologo"
          options={{
            title: 'Psicólogo',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
                <MaterialCommunityIcons name={focused ? "brain" : "brain"} size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
                <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={24} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    padding: 4,
    borderRadius: 12,
  },
  tabIconActive: {
    // Active state handled by color
  },
});
