import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Modal, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useThoughts } from '../../components/ThoughtsContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TREE_LEVELS } from '../../constants/Prizes';

const MAX_WIDTH = 480;

const ProfileScreen = () => {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const styles = getStyles(Colors[theme], darkMode);
  const { allThoughts, privateThoughts, userStats, levelUpInfo, clearLevelUp } = useThoughts();
  const [showPrize, setShowPrize] = useState(false);
  const [treeScale] = useState(new Animated.Value(1));
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 900;

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

  return (
    <SafeAreaView style={[styles.bg, { backgroundColor: darkMode ? '#0A0A0A' : Colors[theme].background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={darkMode ? '#0A0A0A' : Colors[theme].background} />
      
      <ScrollView style={styles.bg} contentContainerStyle={{ paddingBottom: 32, maxWidth: MAX_WIDTH, width: '100%', alignSelf: 'center' }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn}>
            <Feather name="arrow-left" size={20} color={Colors[theme].text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tu Espacio</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Feather name="external-link" size={20} color={Colors[theme].text} />
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <LinearGradient 
          colors={darkMode ? ['#1E1B4B', '#312E81'] : ['#6D28D9', '#8B5CF6']} 
          style={styles.welcomeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.welcomeIconContainer}>
            <MaterialCommunityIcons name="brain" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.welcomeTitle}>Tu Espacio Personal</Text>
          <Text style={styles.welcomeDesc}>Aquí puedes ver tu progreso emocional y patrones personales</Text>
        </LinearGradient>

        {/* Emotional Tree Card */}
        <LinearGradient 
          colors={darkMode ? ['#052E16', '#14532D'] : ['#052E16', '#166534']} 
          style={styles.treeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.treeIconContainer, { transform: [{ scale: treeScale }] }]}>
            <MaterialCommunityIcons name="tree" size={36} color="#4ADE80" />
          </Animated.View>
          <Text style={styles.treeTitle}>Tu Árbol Emocional</Text>
          <Text style={styles.treeLevel}>{levelData.label} - Nivel {currentLevel}</Text>
          <Text style={styles.treeDesc}>{levelData.description}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
          </View>
          
          {/* Requirements */}
          <View style={styles.requirementsRow}>
            {missing?.thoughts > 0 && (
              <View style={styles.requirementBox}>
                <MaterialCommunityIcons name="pencil" size={16} color="#A78BFA" />
                <Text style={styles.requirementText}>{missing.thoughts} pensamientos</Text>
              </View>
            )}
            {missing?.likes > 0 && (
              <View style={styles.requirementBox}>
                <MaterialCommunityIcons name="heart" size={16} color="#F472B6" />
                <Text style={styles.requirementText}>{missing.likes} likes</Text>
              </View>
            )}
            {missing?.days > 0 && (
              <View style={styles.requirementBox}>
                <MaterialCommunityIcons name="calendar" size={16} color="#38BDF8" />
                <Text style={styles.requirementText}>{missing.days} días</Text>
              </View>
            )}
            {missing?.special && (
              <View style={styles.requirementBox}>
                <MaterialCommunityIcons name="star" size={16} color="#FBBF24" />
                <Text style={styles.requirementText}>{missing.special}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity onPress={() => router.push('/premios')} style={styles.viewPrizesBtn}>
            <Text style={styles.viewPrizesText}>Ver mis premios</Text>
            <Feather name="arrow-right" size={18} color="#4ADE80" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Level Up Modal */}
        <Modal visible={showPrize} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: darkMode ? '#161616' : Colors[theme].card }]}>
              {levelUpInfo && (
                <>
                  <View style={styles.levelUpIconContainer}>
                    <MaterialCommunityIcons name={levelUpInfo.reward.icon} size={56} color="#FBBF24" />
                  </View>
                  <Text style={[styles.levelUpTitle, { color: Colors[theme].text }]}>¡Has subido al nivel {levelUpInfo.level}!</Text>
                  <Text style={[styles.levelUpDesc, { color: Colors[theme].textSecondary }]}>{levelUpInfo.reward.text}</Text>
                  <TouchableOpacity onPress={handleClosePrizeModal} style={styles.levelUpBtn}>
                    <Text style={styles.levelUpBtnText}>¡Genial!</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Emotional Analysis Card */}
        <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : Colors[theme].card, borderColor: darkMode ? '#252525' : '#F0F0F0' }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="chart-line" size={22} color="#A78BFA" />
            <Text style={[styles.sectionTitle, { color: '#A78BFA' }]}>Análisis Emocional</Text>
          </View>
          <Text style={[styles.analysisText, { color: Colors[theme].text }]}>
            Emoción predominante: <Text style={{ color: '#A78BFA', fontWeight: '700' }}>{predominantEmotion}</Text>
          </Text>
          <View style={styles.analysisBox}>
            <View style={styles.analysisIconCircle}>
              <MaterialCommunityIcons name="medal" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.analysisPercent, { color: Colors[theme].text }]}>100%</Text>
          </View>
          <Text style={styles.analysisSub}>Patrones detectados</Text>
        </View>

        {/* Private History Card */}
        <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : Colors[theme].card, borderColor: darkMode ? '#252525' : '#F0F0F0' }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="lock" size={22} color="#A78BFA" />
            <Text style={[styles.sectionTitle, { color: '#A78BFA' }]}>Historial Privado</Text>
          </View>
          {privateThoughts.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialCommunityIcons name="note-off-outline" size={40} color={Colors[theme].textMuted} />
              <Text style={[styles.emptyHistoryText, { color: Colors[theme].textMuted }]}>No tienes pensamientos privados aún</Text>
            </View>
          ) : (
            privateThoughts.slice(0, 3).map(t => (
              <View key={t.id} style={[styles.historyItem, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
                <View style={styles.historyRow}>
                  <Text style={[styles.historyDate, { color: Colors[theme].textMuted }]}>{new Date(t.createdAt).toLocaleDateString()}</Text>
                  <View style={[styles.historyTag, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF' }]}>
                    <Text style={[styles.historyTagText, { color: Colors[theme].primary }]}>{t.emotionLabel}</Text>
                  </View>
                </View>
                <Text style={[styles.historyText, { color: Colors[theme].text }]}>{t.text}</Text>
                <View style={styles.historyMetaRow}>
                  <Text style={[styles.historyMeta, { color: Colors[theme].textMuted }]}>❤️ {t.reactions.heart} reacciones</Text>
                  {t.aiResponse && <Text style={[styles.historyMeta, { color: Colors[theme].textMuted }]}>🤖 IA respondió</Text>}
                </View>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.historyBtn}>
            <LinearGradient colors={['#A78BFA', '#7C3AED']} style={styles.historyBtnGradient}>
              <Text style={styles.historyBtnText}>Ver historial completo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Public History Card */}
        <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : Colors[theme].card, borderColor: darkMode ? '#252525' : '#F0F0F0' }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="earth" size={22} color="#38BDF8" />
            <Text style={[styles.sectionTitle, { color: '#38BDF8' }]}>Historial Público</Text>
          </View>
          {publicHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialCommunityIcons name="earth-off" size={40} color={Colors[theme].textMuted} />
              <Text style={[styles.emptyHistoryText, { color: Colors[theme].textMuted }]}>Aún no tienes pensamientos públicos</Text>
            </View>
          ) : (
            publicHistory.slice(0, 3).map(t => (
              <Animated.View key={t.id} style={[styles.historyItem, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA', transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity activeOpacity={0.85} onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ width: '100%' }}>
                  <View style={styles.historyRow}>
                    <Text style={[styles.historyDate, { color: Colors[theme].textMuted }]}>{new Date(t.createdAt).toLocaleDateString()}</Text>
                    <View style={[styles.historyTag, { backgroundColor: darkMode ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE' }]}>
                      <Text style={[styles.historyTagText, { color: '#38BDF8' }]}>{t.emotionLabel}</Text>
                    </View>
                  </View>
                  <Text style={[styles.historyText, { color: Colors[theme].text }]}>{t.text}</Text>
                  <View style={styles.historyMetaRow}>
                    <Text style={[styles.historyMeta, { color: Colors[theme].textMuted }]}>❤️ {t.reactions.heart} reacciones</Text>
                    {t.aiResponse && <Text style={[styles.historyMeta, { color: Colors[theme].textMuted }]}>🤖 IA respondió</Text>}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
          {publicHistory.length > 3 && (
            <TouchableOpacity style={styles.historyBtn}>
              <LinearGradient colors={['#38BDF8', '#A78BFA']} style={styles.historyBtnGradient}>
                <Text style={styles.historyBtnText}>Ver historial público</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.bottomBtn}>
            <LinearGradient colors={['#A78BFA', '#F472B6']} style={styles.bottomBtnGradient}>
              <MaterialCommunityIcons name="download" size={20} color="#fff" />
              <Text style={styles.bottomBtnText}>Exportar</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBtn}>
            <LinearGradient colors={['#38BDF8', '#A78BFA']} style={styles.bottomBtnGradient}>
              <MaterialCommunityIcons name="music" size={20} color="#fff" />
              <Text style={styles.bottomBtnText}>Música</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (themeColors, darkMode) => StyleSheet.create({
  bg: { flex: 1 },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 16 
  },
  headerBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 14, 
    backgroundColor: darkMode ? '#161616' : themeColors.card, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: darkMode ? '#252525' : '#F0F0F0',
  },
  headerTitle: { 
    color: themeColors.text, 
    fontSize: 22, 
    fontWeight: '800', 
  },
  welcomeCard: { 
    borderRadius: 24, 
    padding: 24, 
    marginHorizontal: 16, 
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: '800', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  welcomeDesc: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 14, 
    textAlign: 'center', 
  },
  treeCard: { 
    borderRadius: 24, 
    padding: 24, 
    marginHorizontal: 16, 
    alignItems: 'center',
    marginTop: 16,
  },
  treeIconContainer: { 
    width: 64, 
    height: 64, 
    borderRadius: 20, 
    backgroundColor: 'rgba(74, 222, 128, 0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 16 
  },
  treeTitle: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: '800', 
    textAlign: 'center', 
    marginBottom: 4 
  },
  treeLevel: { 
    color: '#4ADE80', 
    fontSize: 16, 
    fontWeight: '700', 
    marginBottom: 8 
  },
  treeDesc: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 16 
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBarBg: { 
    width: '100%', 
    height: 10, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: { 
    height: 10, 
    backgroundColor: '#4ADE80', 
    borderRadius: 10 
  },
  progressPercent: { 
    color: '#4ADE80', 
    fontSize: 16, 
    fontWeight: '700', 
    marginTop: 8 
  },
  requirementsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: 8,
    marginBottom: 16,
  },
  requirementBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  requirementText: { 
    color: '#FFFFFF', 
    fontSize: 12, 
    fontWeight: '600',
  },
  viewPrizesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  viewPrizesText: { 
    color: '#4ADE80', 
    fontWeight: '700', 
    fontSize: 15 
  },
  sectionCard: { 
    borderRadius: 24, 
    padding: 20, 
    marginHorizontal: 16, 
    marginTop: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  analysisText: { 
    fontSize: 15, 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  analysisBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8,
    gap: 12,
  },
  analysisIconCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: '#A78BFA', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  analysisPercent: { 
    fontSize: 20, 
    fontWeight: '800' 
  },
  analysisSub: { 
    color: '#A78BFA', 
    fontSize: 13, 
    textAlign: 'center' 
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyHistoryText: {
    fontSize: 14,
    textAlign: 'center',
  },
  historyItem: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 10, 
    width: '100%' 
  },
  historyRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
    gap: 10,
  },
  historyDate: { 
    fontSize: 12, 
    fontWeight: '500',
  },
  historyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  historyTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyText: { 
    fontSize: 15, 
    marginBottom: 8,
    lineHeight: 21,
  },
  historyMetaRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  historyMeta: { 
    fontSize: 12 
  },
  historyBtn: { 
    marginTop: 8, 
    width: '100%', 
    borderRadius: 14, 
    overflow: 'hidden' 
  },
  historyBtnGradient: { 
    paddingVertical: 14, 
    alignItems: 'center', 
    borderRadius: 14 
  },
  historyBtnText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 15 
  },
  bottomRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 24, 
    marginHorizontal: 16, 
    gap: 12 
  },
  bottomBtn: { 
    flex: 1, 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  bottomBtnGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 16, 
    gap: 8 
  },
  bottomBtnText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 15 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    borderRadius: 28, 
    padding: 32, 
    alignItems: 'center', 
    width: 320,
    maxWidth: '90%',
  },
  levelUpIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  levelUpTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  levelUpDesc: { 
    fontSize: 15, 
    textAlign: 'center', 
    marginBottom: 24,
    lineHeight: 22,
  },
  levelUpBtn: { 
    backgroundColor: '#A78BFA', 
    borderRadius: 14, 
    paddingHorizontal: 32, 
    paddingVertical: 14 
  },
  levelUpBtnText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16 
  },
});

export default ProfileScreen;
