import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Modal, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useThoughts } from '../../components/ThoughtsContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TREE_LEVELS } from '../../constants/Prizes';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const colors = Colors[theme];
  const { allThoughts, privateThoughts, userStats, levelUpInfo, clearLevelUp } = useThoughts();
  const [showPrize, setShowPrize] = useState(false);
  const [treeScale] = useState(new Animated.Value(1));
  const router = useRouter();

  useEffect(() => {
    if (levelUpInfo) {
      setShowPrize(true);
      Animated.sequence([
        Animated.spring(treeScale, { toValue: 1.15, useNativeDriver: true }),
        Animated.spring(treeScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [levelUpInfo]);

  const currentLevel = userStats.level;
  const levelData = TREE_LEVELS.find(l => l.level === currentLevel) || TREE_LEVELS[0];
  const nextLevelData = TREE_LEVELS.find(l => l.level === currentLevel + 1);

  const progress = useMemo(() => {
    if (!nextLevelData) return 1;
    const { requiredThoughts, requiredLikes, requiredDays } = nextLevelData;
    const { thoughts, likes, days } = userStats;
    if (!requiredThoughts && !requiredLikes && !requiredDays) return 0;
    let total = 0, count = 0;
    if (requiredThoughts > 0) { total += Math.min(thoughts / requiredThoughts, 1); count++; }
    if (requiredLikes > 0) { total += Math.min(likes / requiredLikes, 1); count++; }
    if (requiredDays > 0) { total += Math.min((days - 1) / (requiredDays - 1), 1); count++; }
    return count > 0 ? total / count : 0;
  }, [userStats, nextLevelData]);

  const predominantEmotion = useMemo(() => {
    if (allThoughts.length === 0) return 'Ninguna';
    const counts = allThoughts.reduce((acc, t) => {
      acc[t.emotionLabel] = (acc[t.emotionLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }, [allThoughts]);

  const stats = [
    { icon: 'pencil', label: 'Pensamientos', value: userStats.thoughtsWritten, color: '#8B5CF6' },
    { icon: 'fire', label: 'Racha', value: `${userStats.streak} días`, color: '#F59E0B' },
    { icon: 'heart', label: 'Likes', value: userStats.likesReceived, color: '#EC4899' },
    { icon: 'star', label: 'XP', value: userStats.xp, color: '#10B981' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={darkMode ? '#0A0A0A' : '#FFFFFF'} />
      
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Tu Espacio</Text>
            <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: darkMode ? '#161616' : '#F5F3FF' }]}>
              <Feather name="settings" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
            <View style={styles.profileHeader}>
              <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.profileAvatar}>
                <MaterialCommunityIcons name="account" size={32} color="#FFFFFF" />
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
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                  <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Tree Card */}
          <LinearGradient colors={darkMode ? ['#052E16', '#14532D'] : ['#ECFDF5', '#D1FAE5']} style={styles.treeCard}>
            <View style={styles.treeHeader}>
              <Animated.View style={[styles.treeIconContainer, { transform: [{ scale: treeScale }] }]}>
                <MaterialCommunityIcons name="tree" size={28} color="#10B981" />
              </Animated.View>
              <View style={styles.treeTitleContainer}>
                <Text style={[styles.treeTitle, { color: darkMode ? '#FFFFFF' : '#065F46' }]}>Árbol Emocional</Text>
                <Text style={styles.treeLevel}>{levelData.label}</Text>
              </View>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: darkMode ? 'rgba(255,255,255,0.7)' : '#065F46' }]}>Progreso</Text>
                <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: darkMode ? 'rgba(255,255,255,0.15)' : '#A7F3D0' }]}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/premios')} style={styles.viewPrizesBtn}>
              <Text style={styles.viewPrizesText}>Ver todos los premios</Text>
              <Feather name="arrow-right" size={16} color="#10B981" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Emotion Analysis */}
          <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="chart-pie" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Análisis Emocional</Text>
            </View>
            <View style={[styles.emotionBadge, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.12)' : '#F5F3FF' }]}>
              <Text style={styles.emotionEmoji}>🎭</Text>
              <Text style={[styles.emotionLabel, { color: colors.text }]}>Emoción predominante: </Text>
              <Text style={[styles.emotionValue, { color: colors.primary }]}>{predominantEmotion}</Text>
            </View>
          </View>

          {/* Private History */}
          <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="lock" size={20} color="#EC4899" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Historial Privado</Text>
            </View>
            {privateThoughts.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="note-off-outline" size={32} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No hay pensamientos privados</Text>
              </View>
            ) : (
              privateThoughts.slice(0, 2).map(t => (
                <View key={t.id} style={[styles.historyItem, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
                  <Text style={[styles.historyDate, { color: colors.textMuted }]}>{new Date(t.createdAt).toLocaleDateString()}</Text>
                  <Text style={[styles.historyText, { color: colors.text }]} numberOfLines={2}>{t.text}</Text>
                </View>
              ))
            )}
          </View>

          {/* Actions */}
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
            <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.actionBtnGradient}>
              <MaterialCommunityIcons name="download" size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Exportar Datos</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Level Up Modal */}
      <Modal visible={showPrize} transparent animationType="fade" onRequestClose={() => { setShowPrize(false); clearLevelUp(); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#161616' : '#FFFFFF' }]}>
            {levelUpInfo && (
              <>
                <View style={[styles.levelUpIconContainer, { backgroundColor: darkMode ? 'rgba(251, 191, 36, 0.15)' : '#FEF3C7' }]}>
                  <MaterialCommunityIcons name={levelUpInfo.reward.icon as any} size={44} color="#FBBF24" />
                </View>
                <Text style={[styles.levelUpTitle, { color: colors.text }]}>¡Nivel {levelUpInfo.level}!</Text>
                <Text style={[styles.levelUpDesc, { color: colors.textSecondary }]}>{levelUpInfo.reward.text}</Text>
                <TouchableOpacity onPress={() => { setShowPrize(false); clearLevelUp(); }} style={styles.levelUpBtn}>
                  <Text style={styles.levelUpBtnText}>¡Genial!</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1, maxWidth: 520, width: '100%', alignSelf: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  settingsBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  profileAvatar: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  levelText: { fontSize: 13, fontWeight: '700', color: '#FBBF24' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10, gap: 8, marginBottom: 12 },
  statCard: { flex: 1, minWidth: '45%', borderRadius: 16, borderWidth: 1, padding: 14, alignItems: 'center' },
  statIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11 },
  treeCard: { borderRadius: 20, padding: 18, marginHorizontal: 16, marginBottom: 12 },
  treeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  treeIconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.2)', alignItems: 'center', justifyContent: 'center' },
  treeTitleContainer: { flex: 1 },
  treeTitle: { fontSize: 17, fontWeight: '800', marginBottom: 2 },
  treeLevel: { fontSize: 13, fontWeight: '700', color: '#10B981' },
  progressSection: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progressLabel: { fontSize: 12, fontWeight: '500' },
  progressPercent: { fontSize: 14, fontWeight: '800', color: '#10B981' },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#10B981', borderRadius: 4 },
  viewPrizesBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  viewPrizesText: { fontSize: 13, fontWeight: '700', color: '#10B981' },
  sectionCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginHorizontal: 16, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  emotionBadge: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, gap: 6 },
  emotionEmoji: { fontSize: 18 },
  emotionLabel: { fontSize: 13 },
  emotionValue: { fontSize: 13, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 20, gap: 6 },
  emptyText: { fontSize: 13, textAlign: 'center' },
  historyItem: { borderRadius: 12, padding: 12, marginBottom: 6 },
  historyDate: { fontSize: 11, marginBottom: 4 },
  historyText: { fontSize: 13, lineHeight: 18 },
  actionBtn: { marginHorizontal: 16, marginTop: 8, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  actionBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 24, padding: 28, alignItems: 'center', width: 280 },
  levelUpIconContainer: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  levelUpTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  levelUpDesc: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  levelUpBtn: { backgroundColor: '#8B5CF6', borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12 },
  levelUpBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
