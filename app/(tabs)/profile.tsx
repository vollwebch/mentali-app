import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Modal, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useThoughts } from '../../components/ThoughtsContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TREE_LEVELS } from '../../constants/Prizes';

const CONTENT_MAX_WIDTH = 600;
const SIDEBAR_WIDTH = 280;

const ProfileScreen = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const colors = Colors[theme];
  const { allThoughts, privateThoughts, userStats, levelUpInfo, clearLevelUp } = useThoughts();
  const [showPrize, setShowPrize] = useState(false);
  const [treeScale] = useState(new Animated.Value(1));
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 1200;

  useEffect(() => {
    if (levelUpInfo) {
      setShowPrize(true);
      Animated.sequence([
        Animated.spring(treeScale, { toValue: 1.15, useNativeDriver: true }),
        Animated.spring(treeScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [levelUpInfo]);

  const handleClosePrizeModal = () => {
    setShowPrize(false);
    clearLevelUp();
  };

  const currentLevel = userStats.level;
  const levelData = TREE_LEVELS.find(l => l.level === currentLevel) || TREE_LEVELS[0];
  const nextLevelData = TREE_LEVELS.find(l => l.level === currentLevel + 1);

  const progress = useMemo(() => {
    if (!nextLevelData) return 1;
    const { requiredThoughts, requiredLikes, requiredDays } = nextLevelData;
    const { thoughts, likes, days } = userStats;
    if (requiredThoughts === 0 && requiredLikes === 0 && requiredDays === 0) return 0;
    let totalProgress = 0;
    let numMetrics = 0;
    if (requiredThoughts > 0) { totalProgress += Math.min(thoughts / requiredThoughts, 1); numMetrics++; }
    if (requiredLikes > 0) { totalProgress += Math.min(likes / requiredLikes, 1); numMetrics++; }
    if (requiredDays > 0) { totalProgress += Math.min((days - 1) / (requiredDays - 1), 1); numMetrics++; }
    return numMetrics > 0 ? totalProgress / numMetrics : 0;
  }, [userStats, nextLevelData]);

  const missing = useMemo(() => {
    if (!nextLevelData) return null;
    return {
      thoughts: Math.max(0, nextLevelData.requiredThoughts - userStats.thoughts),
      likes: Math.max(0, nextLevelData.requiredLikes - userStats.likes),
      days: Math.max(0, nextLevelData.requiredDays - userStats.days),
      special: nextLevelData.requiredSpecial,
    };
  }, [userStats, nextLevelData]);

  const now = new Date();
  const publicHistory = allThoughts.filter(t => {
    const created = new Date(t.createdAt);
    const expires = new Date(created.getTime() + t.expiresInHours * 60 * 60 * 1000);
    return expires <= now;
  });

  const predominantEmotion = useMemo(() => {
    if (allThoughts.length === 0) return 'Ninguna';
    const emotionCounts = allThoughts.reduce((acc, thought) => {
      acc[thought.emotionLabel] = (acc[thought.emotionLabel] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    return Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);
  }, [allThoughts]);

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  // Stats cards data
  const statsCards = [
    { icon: 'pencil', label: 'Pensamientos', value: userStats.thoughtsWritten, color: '#8B5CF6' },
    { icon: 'fire', label: 'Racha', value: `${userStats.streak} días`, color: '#F59E0B' },
    { icon: 'heart', label: 'Likes', value: userStats.likesReceived, color: '#EC4899' },
    { icon: 'star', label: 'XP', value: userStats.xp, color: '#10B981' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={darkMode ? '#0A0A0A' : '#FFFFFF'} />
      
      <View style={styles.mainContainer}>
        {/* Left Sidebar - Desktop Only */}
        {isLargeScreen && (
          <View style={[styles.sidebar, { 
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
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)')}>
                <MaterialCommunityIcons name="home-outline" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Inicio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/premios')}>
                <MaterialCommunityIcons name="trophy-outline" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Premios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/psicologo')}>
                <MaterialCommunityIcons name="brain" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Psicólogo IA</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navItem, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.12)' : '#F0EBFF' }]} onPress={() => router.push('/(tabs)/profile')}>
                <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
                <Text style={[styles.navText, { color: colors.primary }]}>Perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Main Content */}
        <View style={styles.contentArea}>
          <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32, maxWidth: isLargeScreen ? CONTENT_MAX_WIDTH : '100%', width: '100%', alignSelf: 'center' }}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Tu Espacio</Text>
              <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: darkMode ? '#161616' : '#F5F3FF' }]}>
                <Feather name="settings" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
              <View style={styles.profileHeader}>
                <LinearGradient
                  colors={['#8B5CF6', '#A855F7']}
                  style={styles.profileAvatar}
                >
                  <MaterialCommunityIcons name="account" size={36} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]}>Usuario Anónimo</Text>
                  <View style={styles.levelBadge}>
                    <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
                    <Text style={styles.levelText}>Nivel {currentLevel}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {statsCards.map((stat, index) => (
                <View key={index} style={[styles.statCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
                  <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                    <MaterialCommunityIcons name={stat.icon} size={22} color={stat.color} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Emotional Tree Card */}
            <LinearGradient 
              colors={darkMode ? ['#052E16', '#14532D'] : ['#ECFDF5', '#D1FAE5']} 
              style={styles.treeCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.treeHeader}>
                <Animated.View style={[styles.treeIconContainer, { transform: [{ scale: treeScale }] }]}>
                  <MaterialCommunityIcons name="tree" size={32} color="#10B981" />
                </Animated.View>
                <View style={styles.treeTitleContainer}>
                  <Text style={[styles.treeTitle, { color: darkMode ? '#FFFFFF' : '#065F46' }]}>Árbol Emocional</Text>
                  <Text style={[styles.treeLevel, { color: '#10B981' }]}>{levelData.label}</Text>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: darkMode ? 'rgba(255,255,255,0.7)' : '#065F46' }]}>Progreso al siguiente nivel</Text>
                  <Text style={[styles.progressPercent, { color: '#10B981' }]}>{Math.round(progress * 100)}%</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: darkMode ? 'rgba(255,255,255,0.15)' : '#A7F3D0' }]}>
                  <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>
              </View>
              
              {/* Requirements */}
              {missing && (
                <View style={styles.requirementsRow}>
                  {missing.thoughts > 0 && (
                    <View style={[styles.requirementBadge, { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#FFFFFF' }]}>
                      <MaterialCommunityIcons name="pencil" size={14} color="#A78BFA" />
                      <Text style={[styles.requirementText, { color: darkMode ? '#FFFFFF' : '#065F46' }]}>{missing.thoughts} más</Text>
                    </View>
                  )}
                  {missing.likes > 0 && (
                    <View style={[styles.requirementBadge, { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#FFFFFF' }]}>
                      <MaterialCommunityIcons name="heart" size={14} color="#F472B6" />
                      <Text style={[styles.requirementText, { color: darkMode ? '#FFFFFF' : '#065F46' }]}>{missing.likes} likes</Text>
                    </View>
                  )}
                  {missing.days > 0 && (
                    <View style={[styles.requirementBadge, { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : '#FFFFFF' }]}>
                      <MaterialCommunityIcons name="calendar" size={14} color="#38BDF8" />
                      <Text style={[styles.requirementText, { color: darkMode ? '#FFFFFF' : '#065F46' }]}>{missing.days} días</Text>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity onPress={() => router.push('/premios')} style={styles.viewPrizesBtn}>
                <Text style={[styles.viewPrizesText, { color: '#10B981' }]}>Ver todos los premios</Text>
                <Feather name="arrow-right" size={16} color="#10B981" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Emotion Analysis */}
            <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF' }]}>
                  <MaterialCommunityIcons name="chart-pie" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Análisis Emocional</Text>
              </View>
              <View style={[styles.emotionBadge, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.12)' : '#F5F3FF' }]}>
                <Text style={styles.emotionEmoji}>🎭</Text>
                <Text style={[styles.emotionLabel, { color: colors.text }]}>Emoción predominante: </Text>
                <Text style={[styles.emotionValue, { color: colors.primary }]}>{predominantEmotion}</Text>
              </View>
            </View>

            {/* Private History */}
            <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: darkMode ? 'rgba(236, 72, 153, 0.15)' : '#FDF2F8' }]}>
                  <MaterialCommunityIcons name="lock" size={20} color="#EC4899" />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Historial Privado</Text>
              </View>
              {privateThoughts.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="note-off-outline" size={36} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>No hay pensamientos privados</Text>
                </View>
              ) : (
                privateThoughts.slice(0, 2).map(t => (
                  <View key={t.id} style={[styles.historyItem, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
                    <View style={styles.historyHeader}>
                      <Text style={[styles.historyDate, { color: colors.textMuted }]}>{new Date(t.createdAt).toLocaleDateString()}</Text>
                      <View style={[styles.historyTag, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF' }]}>
                        <Text style={[styles.historyTagText, { color: colors.primary }]}>{t.emotionLabel}</Text>
                      </View>
                    </View>
                    <Text style={[styles.historyText, { color: colors.text }]} numberOfLines={2}>{t.text}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Actions */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
                <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.actionBtnGradient}>
                  <MaterialCommunityIcons name="download" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Exportar Datos</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Level Up Modal */}
      <Modal visible={showPrize} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#161616' : '#FFFFFF' }]}>
            {levelUpInfo && (
              <>
                <View style={[styles.levelUpIconContainer, { backgroundColor: darkMode ? 'rgba(251, 191, 36, 0.15)' : '#FEF3C7' }]}>
                  <MaterialCommunityIcons name={levelUpInfo.reward.icon} size={48} color="#FBBF24" />
                </View>
                <Text style={[styles.levelUpTitle, { color: colors.text }]}>¡Nivel {levelUpInfo.level}!</Text>
                <Text style={[styles.levelUpDesc, { color: colors.textSecondary }]}>{levelUpInfo.reward.text}</Text>
                <TouchableOpacity onPress={handleClosePrizeModal} style={styles.levelUpBtn}>
                  <Text style={styles.levelUpBtnText}>¡Genial!</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContainer: { flex: 1, flexDirection: 'row' },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  logoGradient: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: '800', marginLeft: 12 },
  navSection: { gap: 4 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 16, gap: 14 },
  navText: { fontSize: 16, fontWeight: '600' },
  contentArea: { flex: 1, alignItems: 'center' },
  scrollView: { flex: 1, width: '100%' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '800' },
  settingsBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileCard: { borderRadius: 20, borderWidth: 1, padding: 20, marginHorizontal: 16, marginBottom: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileAvatar: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  levelText: { fontSize: 14, fontWeight: '700', color: '#FBBF24' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 12, gap: 10, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '45%', borderRadius: 18, borderWidth: 1, padding: 16, alignItems: 'center' },
  statIconContainer: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12 },
  treeCard: { borderRadius: 24, padding: 20, marginHorizontal: 16, marginBottom: 16 },
  treeHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  treeIconContainer: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(16, 185, 129, 0.2)', alignItems: 'center', justifyContent: 'center' },
  treeTitleContainer: { flex: 1 },
  treeTitle: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  treeLevel: { fontSize: 14, fontWeight: '700' },
  progressSection: { marginBottom: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressLabel: { fontSize: 13, fontWeight: '500' },
  progressPercent: { fontSize: 16, fontWeight: '800' },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#10B981', borderRadius: 4 },
  requirementsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  requirementBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 },
  requirementText: { fontSize: 12, fontWeight: '600' },
  viewPrizesBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  viewPrizesText: { fontSize: 14, fontWeight: '700' },
  sectionCard: { borderRadius: 20, borderWidth: 1, padding: 18, marginHorizontal: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  sectionIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  emotionBadge: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, gap: 8 },
  emotionEmoji: { fontSize: 20 },
  emotionLabel: { fontSize: 14 },
  emotionValue: { fontSize: 14, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14, textAlign: 'center' },
  historyItem: { borderRadius: 14, padding: 14, marginBottom: 8 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  historyDate: { fontSize: 11, fontWeight: '500' },
  historyTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  historyTagText: { fontSize: 11, fontWeight: '600' },
  historyText: { fontSize: 14, lineHeight: 20 },
  actionButtons: { marginHorizontal: 16, marginTop: 8 },
  actionBtn: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  actionBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  actionBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 28, padding: 32, alignItems: 'center', width: 300 },
  levelUpIconContainer: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  levelUpTitle: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
  levelUpDesc: { fontSize: 15, textAlign: 'center', marginBottom: 24 },
  levelUpBtn: { backgroundColor: '#8B5CF6', borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  levelUpBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});

export default ProfileScreen;
