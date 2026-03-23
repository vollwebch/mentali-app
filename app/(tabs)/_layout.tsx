import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Dimensions, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 768;

  // Hide tab bar on large screens
  if (isLargeScreen) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center' }}>
        <View style={{ flex: 1, width: '100%', maxWidth: 720 }}>
          <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 720 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF',
              borderTopWidth: 0,
              height: 70,
              paddingBottom: Platform.OS === 'ios' ? 24 : 12,
              paddingTop: 10,
              shadowColor: '#000',
              shadowOpacity: darkMode ? 0.3 : 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: -6 },
              elevation: 10,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '700',
              marginTop: 4,
            },
            tabBarInactiveTintColor: darkMode ? '#4B5563' : '#9CA3AF',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? "home" : "home-outline"} 
                  size={24} 
                  color={color} 
                />
              ),
            }}
          />
          <Tabs.Screen
            name="premios"
            options={{
              title: 'Premios',
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? "trophy" : "trophy-outline"} 
                  size={24} 
                  color={color} 
                />
              ),
            }}
          />
          <Tabs.Screen
            name="psicologo"
            options={{
              title: 'Psicólogo',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="brain" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? "account" : "account-outline"} 
                  size={24} 
                  color={color} 
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
