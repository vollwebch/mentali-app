import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Dimensions, View } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MAX_WIDTH = 480;

export default function TabLayout() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 900;

  if (isLargeScreen) {
    // Return empty layout for large screens - sidebar handles navigation
    return <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.background }}>
      <View style={{ flex: 1, width: '100%', maxWidth: MAX_WIDTH }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: darkMode ? '#1F1F1F' : '#F0F0F0',
              height: 72,
              paddingBottom: Platform.OS === 'ios' ? 24 : 14,
              paddingTop: 12,
              paddingHorizontal: 16,
              shadowColor: '#000',
              shadowOpacity: darkMode ? 0.3 : 0.05,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: -6 },
              elevation: 12,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '700',
              marginTop: 6,
              letterSpacing: 0.3,
            },
            tabBarInactiveTintColor: darkMode ? '#6B7280' : '#9CA3AF',
            tabBarItemStyle: {
              paddingVertical: 4,
              gap: 2,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={24} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="premios"
            options={{
              title: 'Premios',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="trophy" size={24} color={color} />
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
                <MaterialCommunityIcons name="account-circle" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
