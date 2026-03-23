import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions } from 'react-native';
import { useTheme } from '../../ThemeContext';
import EmotionFilter from '../../components/EmotionFilter';
import NavigationBar from '../../components/NavigationBar';
import ThoughtCard from '../../components/ThoughtCard';
import { useThoughts } from '../../components/ThoughtsContext';
import { Colors } from '../../constants/Colors';

// Responsive max width - centered on desktop
const MAX_WIDTH = 480;
const SIDEBAR_WIDTH = 320;

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
  const { thoughts } = useThoughts();
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [pulse] = useState(new Animated.Value(1));
  const router = useRouter();
  
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 900;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const filteredPosts = selectedEmotion === 'all'
    ? thoughts
    : thoughts.filter(p => p.emotion === selectedEmotion);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar 
        barStyle={darkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <View style={styles.mainContainer}>
        {/* Desktop Sidebar */}
        {isLargeScreen && (
          <View style={[styles.sidebar, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF', borderRightColor: darkMode ? '#1F1F1F' : '#F0F0F0' }]}>
            {/* Logo */}
            <View style={styles.sidebarLogo}>
              <View style={[styles.logoCircle, { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }]}>
                <MaterialCommunityIcons name="brain" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.logoText, { color: colors.text }]}>Mentali</Text>
            </View>
            
            {/* Nav Items */}
            <View style={styles.sidebarNav}>
              <TouchableOpacity style={[styles.navItem, styles.navItemActive, { backgroundColor: darkMode ? 'rgba(167, 139, 250, 0.1)' : '#F5F3FF' }]}>
                <MaterialCommunityIcons name="home" size={24} color={colors.primary} />
                <Text style={[styles.navText, { color: colors.primary }]}>Inicio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/premios')}>
                <MaterialCommunityIcons name="trophy" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Premios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/psicologo')}>
                <MaterialCommunityIcons name="brain" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Psicólogo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/profile')}>
                <MaterialCommunityIcons name="account-circle" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Perfil</Text>
              </TouchableOpacity>
            </View>
            
            {/* Create Button */}
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/compose')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createButtonGradient}
              >
                <MaterialCommunityIcons name="pencil" size={22} color="#fff" />
                <Text style={styles.createButtonText}>Nuevo Pensamiento</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Main Content */}
        <View style={styles.contentArea}>
          <View style={[styles.feedContainer, { maxWidth: MAX_WIDTH }]}>
            {/* Header */}
            {!isLargeScreen && (
              <NavigationBar
                onMapPress={() => router.push('../../emotional-map')}
                onProfilePress={() => router.push('/(tabs)/profile')}
              />
            )}

            {/* Stories / Filter Section */}
            <EmotionFilter selected={selectedEmotion} onSelect={setSelectedEmotion} />

            {/* Feed */}
            <FlatList
              data={filteredPosts}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: isLargeScreen ? 40 : 120 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={[styles.emptyIconContainer, { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }]}>
                    <MaterialCommunityIcons 
                      name="thought-bubble-outline" 
                      size={48} 
                      color={colors.primary} 
                    />
                  </View>
                  <View style={styles.emptyContent}>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                      Sin pensamientos aún
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                      ¡Sé el primero en compartir cómo te sientes!
                    </Text>
                  </View>
                </View>
              }
              renderItem={({ item }) => (
                <ThoughtCard
                  emotion={item.emotion}
                  emotionEmoji={item.emotionEmoji}
                  emotionLabel={item.emotionLabel}
                  text={item.text}
                  createdAt={item.createdAt}
                  expiresInHours={item.expiresInHours}
                  reactions={item.reactions}
                  aiResponse={item.aiResponse}
                />
              )}
            />

            {/* FAB - Only on mobile */}
            {!isLargeScreen && (
              <Animated.View 
                style={[
                  styles.fabContainer, 
                  { transform: [{ scale: pulse }] }
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.fabTouchable}
                  onPress={() => router.push('/compose')}
                >
                  <LinearGradient
                    colors={colors.fabGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                  >
                    <MaterialCommunityIcons name="pencil" size={26} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  sidebarLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  sidebarNav: {
    width: '100%',
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 14,
  },
  navItemActive: {
    borderRadius: 14,
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    width: '100%',
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
  },
  feedContainer: {
    flex: 1,
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 20,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 15,
    marginTop: 6,
    opacity: 0.8,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 90,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  fabTouchable: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
