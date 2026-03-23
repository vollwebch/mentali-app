import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: (Colors[theme] as any).card ?? '#fff',
            borderTopWidth: 0.5,
            borderTopColor: (Colors[theme] as any).cardBorder ?? '#E0E7FF',
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: -2 },
          },
          default: {
            backgroundColor: (Colors[theme] as any).card ?? '#fff',
            borderTopWidth: 0.5,
            borderTopColor: (Colors[theme] as any).cardBorder ?? '#E0E7FF',
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: -2 },
          },
        }),
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarInactiveTintColor: (Colors[theme] as any).secondaryText ?? '#6D28D9',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />, // Casa
        }}
      />
      <Tabs.Screen
        name="premios"
        options={{
          title: 'Premios',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy-award" color={color} />, // Trofeo
        }}
      />
      {/* <Tabs.Screen
        name="psicologo"
        options={{
          title: 'Psicólogo',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="brain" size={28} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />, // Persona
        }}
      />
    </Tabs>
  );
}