import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../../ThemeContext';
import EmotionFilter from '../../components/EmotionFilter';
import NavigationBar from '../../components/NavigationBar';
import ThoughtCard from '../../components/ThoughtCard';
import { useThoughts } from '../../components/ThoughtsContext';
import { Colors } from '../../constants/Colors';

// Professional social network layout widths
const CONTENT_MAX_WIDTH = 600;
const SIDEBAR_WIDTH = 280;
const RIGHT_SIDEBAR_WIDTH = 300;

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
  const { thoughts, userStats } = useThoughts();
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [pulse] = useState(new Animated.Value(1));
  const router = useRouter();
  
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 1200;
  const isMediumScreen = screenWidth > 900 && screenWidth <= 1200;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const filteredPosts = selectedEmotion === 'all'
    ? thoughts
    : thoughts.filter(p => p.emotion === selectedEmotion);

  // Trending topics for sidebar
  const trendingTopics = [
    { emoji: '😊', label: 'Alegría', count: 234 },
    { emoji: '😢', label: 'Tristeza', count: 156 },
    { emoji: '🙏', label: 'Gratitud', count: 189 },
    { emoji: '💪', label: 'Motivación', count: 145 },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar 
        barStyle={darkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <View style={styles.mainContainer}>
        {/* Left Sidebar - Desktop Only */}
        {isLargeScreen && (
          <View style={[styles.leftSidebar, { 
            backgroundColor: darkMode ? '#0F0F0F' : '#FAFAFA',
            borderRightColor: darkMode ? '#1A1A1A' : '#EBEBEB'
          }]}>
            {/* Logo */}
            <TouchableOpacity style={styles.logoContainer} onPress={() => router.push('/')}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <MaterialCommunityIcons name="brain" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.logoText, { color: colors.text }]}>Mentali</Text>
            </TouchableOpacity>

            {/* Navigation */}
            <View style={styles.navSection}>
              <TouchableOpacity style={[styles.navItem, styles.navItemActive, { 
                backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.12)' : '#F0EBFF'
              }]} onPress={() => router.push('/(tabs)')}>
                <MaterialCommunityIcons name="home" size={24} color={colors.primary} />
                <Text style={[styles.navText, { color: colors.primary }]}>Inicio</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/premios')}>
                <MaterialCommunityIcons name="trophy-outline" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Premios</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/psicologo')}>
                <MaterialCommunityIcons name="brain" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Psicólogo IA</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/profile')}>
                <MaterialCommunityIcons name="account-outline" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Perfil</Text>
              </TouchableOpacity>
            </View>

            {/* Create Post Button */}
            <TouchableOpacity 
              style={styles.createPostBtn}
              onPress={() => router.push('/compose')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#8B5CF6', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createPostGradient}
              >
                <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" />
                <Text style={styles.createPostText}>Nuevo Pensamiento</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* User Stats Mini */}
            <View style={[styles.statsMini, { 
              backgroundColor: darkMode ? '#161616' : '#FFFFFF',
              borderColor: darkMode ? '#252525' : '#EBEBEB'
            }]}>
              <View style={styles.statsMiniRow}>
                <View style={styles.statsMiniItem}>
                  <Text style={[styles.statsMiniValue, { color: colors.primary }]}>{userStats.level}</Text>
                  <Text style={[styles.statsMiniLabel, { color: colors.textMuted }]}>Nivel</Text>
                </View>
                <View style={styles.statsMiniItem}>
                  <Text style={[styles.statsMiniValue, { color: colors.primary }]}>{userStats.streak}</Text>
                  <Text style={[styles.statsMiniLabel, { color: colors.textMuted }]}>Racha</Text>
                </View>
                <View style={styles.statsMiniItem}>
                  <Text style={[styles.statsMiniValue, { color: colors.primary }]}>{userStats.xp}</Text>
                  <Text style={[styles.statsMiniLabel, { color: colors.textMuted }]}>XP</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Main Content Feed */}
        <View style={styles.contentArea}>
          <View style={[styles.feedContainer, { maxWidth: isLargeScreen ? CONTENT_MAX_WIDTH : (isMediumScreen ? 550 : '100%') }]}>
            {/* Mobile Header */}
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
              ListHeaderComponent={
                isLargeScreen ? (
                  <TouchableOpacity 
                    style={[styles.createThoughtCard, { 
                      backgroundColor: darkMode ? '#161616' : '#FFFFFF',
                      borderColor: darkMode ? '#252525' : '#EBEBEB'
                    }]}
                    onPress={() => router.push('/compose')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.createThoughtAvatar, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
                      <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.createThoughtPlaceholder, { color: colors.textMuted }]}>
                      ¿Qué estás pensando hoy?
                    </Text>
                    <View style={[styles.createThoughtBtn, { backgroundColor: colors.primary }]}>
                      <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={[styles.emptyIconContainer, { 
                    backgroundColor: darkMode ? '#161616' : '#F5F3FF',
                    borderColor: darkMode ? '#252525' : '#E9E5FF'
                  }]}>
                    <MaterialCommunityIcons 
                      name="thought-bubble-outline" 
                      size={56} 
                      color={colors.primary} 
                    />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    No hay pensamientos aún
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                    ¡Sé el primero en compartir cómo te sientes!
                  </Text>
                  <TouchableOpacity 
                    style={styles.emptyButton}
                    onPress={() => router.push('/compose')}
                  >
                    <LinearGradient
                      colors={['#8B5CF6', '#A855F7']}
                      style={styles.emptyButtonGradient}
                    >
                      <MaterialCommunityIcons name="pencil" size={18} color="#FFFFFF" />
                      <Text style={styles.emptyButtonText}>Crear pensamiento</Text>
                    </LinearGradient>
                  </TouchableOpacity>
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

            {/* FAB - Only on mobile/tablet */}
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
                    colors={['#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                  >
                    <MaterialCommunityIcons name="pencil" size={26} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Right Sidebar - Desktop Only */}
        {isLargeScreen && (
          <View style={[styles.rightSidebar, { 
            backgroundColor: darkMode ? '#0F0F0F' : '#FAFAFA',
            borderLeftColor: darkMode ? '#1A1A1A' : '#EBEBEB'
          }]}>
            {/* Search */}
            <View style={[styles.searchBox, { 
              backgroundColor: darkMode ? '#161616' : '#FFFFFF',
              borderColor: darkMode ? '#252525' : '#EBEBEB'
            }]}>
              <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
              <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>Buscar...</Text>
            </View>

            {/* Trending Section */}
            <View style={[styles.trendingCard, { 
              backgroundColor: darkMode ? '#161616' : '#FFFFFF',
              borderColor: darkMode ? '#252525' : '#EBEBEB'
            }]}>
              <Text style={[styles.trendingTitle, { color: colors.text }]}>Tendencias</Text>
              {trendingTopics.map((topic, index) => (
                <TouchableOpacity key={index} style={styles.trendingItem}>
                  <Text style={styles.trendingEmoji}>{topic.emoji}</Text>
                  <View style={styles.trendingInfo}>
                    <Text style={[styles.trendingLabel, { color: colors.text }]}>{topic.label}</Text>
                    <Text style={[styles.trendingCount, { color: colors.textMuted }]}>{topic.count} pensamientos</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Daily Quote */}
            <View style={[styles.quoteCard, { 
              backgroundColor: darkMode ? '#161616' : '#FFFFFF',
              borderColor: darkMode ? '#252525' : '#EBEBEB'
            }]}>
              <LinearGradient
                colors={darkMode ? ['rgba(139, 92, 246, 0.15)', 'rgba(236, 72, 153, 0.15)'] : ['rgba(139, 92, 246, 0.08)', 'rgba(236, 72, 153, 0.08)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quoteGradient}
              >
                <MaterialCommunityIcons name="format-quote-open" size={24} color={colors.primary} />
                <Text style={[styles.quoteText, { color: colors.text }]}>
                  "Cada día es una nueva oportunidad para crecer y ser mejor."
                </Text>
                <Text style={[styles.quoteAuthor, { color: colors.textMuted }]}>— Mentali</Text>
              </LinearGradient>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={[styles.quickActionBtn, { 
                backgroundColor: darkMode ? '#161616' : '#FFFFFF',
                borderColor: darkMode ? '#252525' : '#EBEBEB'
              }]} onPress={() => router.push('/(tabs)/psicologo')}>
                <View style={[styles.quickActionIcon, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
                  <MaterialCommunityIcons name="robot-happy" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Hablar con IA</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftSidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  navSection: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 14,
  },
  navItemActive: {
    borderRadius: 16,
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createPostBtn: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  createPostGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  createPostText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  statsMini: {
    marginTop: 'auto',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  statsMiniRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsMiniItem: {
    alignItems: 'center',
  },
  statsMiniValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statsMiniLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
  },
  feedContainer: {
    flex: 1,
    width: '100%',
  },
  createThoughtCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  createThoughtAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createThoughtPlaceholder: {
    flex: 1,
    fontSize: 15,
  },
  createThoughtBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 10,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 90,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
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
  rightSidebar: {
    width: RIGHT_SIDEBAR_WIDTH,
    borderLeftWidth: 1,
    padding: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 16,
  },
  searchPlaceholder: {
    fontSize: 15,
  },
  trendingCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  trendingTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 14,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  trendingEmoji: {
    fontSize: 22,
  },
  trendingInfo: {
    flex: 1,
  },
  trendingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendingCount: {
    fontSize: 12,
    marginTop: 2,
  },
  quoteCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  quoteGradient: {
    padding: 18,
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    marginTop: 10,
  },
  quoteAuthor: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: '600',
  },
  quickActions: {
    gap: 10,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
