import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../ThemeContext';
import { useThoughts } from '../../components/ThoughtsContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TREE_LEVELS } from '../../constants/Prizes';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(Colors[theme]);
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

  const handleClosePrizeModal = () => {
    setShowPrize(false);
    clearLevelUp();
  };

  const currentLevel = userStats.level;
  const levelData = TREE_LEVELS.find(l => l.level === currentLevel) || TREE_LEVELS[0];
  const nextLevelData = TREE_LEVELS.find(l => l.level === currentLevel + 1);

  const progress = useMemo(() => {
    if (!nextLevelData) return 1; // Nivel máximo, progreso 100%

    const { requiredThoughts, requiredLikes, requiredDays } = nextLevelData;
    const { thoughts, likes, days } = userStats;

    // Si no se requiere nada para el siguiente nivel, el progreso es 0 hasta que se defina.
    if (requiredThoughts === 0 && requiredLikes === 0 && requiredDays === 0) {
        return 0;
    }

    let totalProgress = 0;
    let numMetrics = 0;

    if (requiredThoughts > 0) {
        totalProgress += Math.min(thoughts / requiredThoughts, 1);
        numMetrics++;
    }
    if (requiredLikes > 0) {
        totalProgress += Math.min(likes / requiredLikes, 1);
        numMetrics++;
    }
    if (requiredDays > 0) {
        // El día inicial cuenta, así que ajustamos el cálculo
        totalProgress += Math.min((days - 1) / (requiredDays -1), 1);
        numMetrics++;
    }

    // Evitar división por cero si no hay métricas
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
  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <ScrollView style={styles.bg} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn}><Feather name="arrow-left" size={22} color={Colors[theme].text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Espacio Personal</Text>
        <TouchableOpacity style={styles.headerBtn}><Feather name="external-link" size={22} color={Colors[theme].text} /></TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <LinearGradient colors={["#3a2a5d", "#4b256a"]} style={styles.card}>
        <View style={styles.cardIconCircle}><MaterialCommunityIcons name="brain" size={36} color="#fff" /></View>
        <Text style={styles.cardTitleText}>Bienvenido a tu espacio personal</Text>
        <Text style={styles.cardDesc}>Aquí puedes ver tu progreso emocional y patrones personales</Text>
      </LinearGradient>

      {/* Emotional Tree Card */}
      <LinearGradient colors={["#183c2b", "#1e293b"]} style={[styles.card, { marginTop: 18 }] }>
        <Animated.View style={[styles.cardIconCircleGreen, { transform: [{ scale: treeScale }] }] }>
          <MaterialCommunityIcons name="tree-outline" size={36} color="#4ade80" />
        </Animated.View>
        <Text style={styles.cardTitleText}>Tu Árbol Emocional</Text>
        <Text style={styles.cardLevel}>{levelData.label} - Nivel {currentLevel}</Text>
        <Text style={styles.cardDescSmall}>{levelData.description}</Text>
        <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} /></View>
        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
        <View style={styles.requirementsRow}>
          {missing?.thoughts > 0 && <View style={styles.requirementBox}><MaterialCommunityIcons name="pencil" size={18} color="#a78bfa" /><Text style={styles.requirementText}>{missing.thoughts} pensamientos</Text></View>}
          {missing?.likes > 0 && <View style={styles.requirementBox}><MaterialCommunityIcons name="heart" size={18} color="#f472b6" /><Text style={styles.requirementText}>{missing.likes} likes</Text></View>}
          {missing?.days > 0 && <View style={styles.requirementBox}><MaterialCommunityIcons name="calendar" size={18} color="#38bdf8" /><Text style={styles.requirementText}>{missing.days} días</Text></View>}
          {missing?.special && <View style={styles.requirementBox}><MaterialCommunityIcons name="star" size={18} color="#fbbf24" /><Text style={styles.requirementText}>{missing.special}</Text></View>}
        </View>
        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => router.push('/premios')}><Text style={{ color: '#a7f3d0', fontWeight: 'bold' }}>Ver mis premios</Text></TouchableOpacity>
      </LinearGradient>

      {/* Level Up Modal */}
      <Modal visible={showPrize} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: '#000a', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.modalView}>
            {levelUpInfo && (
              <>
                <MaterialCommunityIcons name={levelUpInfo.reward.icon} size={54} color="#fbbf24" style={{ marginBottom: 12 }} />
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>¡Has subido al nivel {levelUpInfo.level}!</Text>
                <Text style={{ color: '#a5b4fc', fontSize: 16, textAlign: 'center', marginBottom: 12 }}>{levelUpInfo.reward.text}</Text>
                <TouchableOpacity onPress={handleClosePrizeModal} style={{ marginTop: 10, backgroundColor: '#a78bfa', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 }}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>¡Genial!</Text></TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Emotional Analysis Card */}
      <View style={[styles.card, { marginTop: 18 }] }>
        <View style={styles.cardRow}><MaterialCommunityIcons name="chart-line" size={22} color="#a78bfa" style={{ marginRight: 8 }} /><Text style={[styles.cardTitleText, { color: '#a78bfa', fontSize: 18 }]}>Análisis Emocional</Text></View>
        <Text style={styles.analysisText}>Emoción predominante: <Text style={{ color: '#a78bfa', fontWeight: 'bold' }}>{predominantEmotion}</Text></Text>
        <View style={styles.analysisBox}><View style={styles.analysisIconCircle}><FontAwesome5 name="medal" size={22} color="#fff" /></View><Text style={styles.analysisPercent}>100%</Text></View>
        <Text style={styles.analysisSub}>Patrones detectados</Text>
      </View>

      {/* Private History Card */}
      <View style={[styles.card, { marginTop: 18 }] }>
        <View style={styles.cardRow}><MaterialCommunityIcons name="history" size={22} color="#a78bfa" style={{ marginRight: 8 }} /><Text style={[styles.cardTitleText, { color: '#a78bfa', fontSize: 18 }]}>Tu Historial Privado</Text></View>
        {privateThoughts.length === 0 ? (
          <Text style={{ color: '#a5b4fc', textAlign: 'center', marginTop: 8 }}>No tienes pensamientos privados. ¡Escribe uno y aparecerá aquí!</Text>
        ) : (
          privateThoughts.slice(0, 3).map(t => (
            <View key={t.id} style={styles.historyItem}>
              <View style={styles.historyRow}><Text style={styles.historyDate}>{new Date(t.createdAt).toLocaleDateString()}</Text><Text style={styles.historyTag}>{t.emotionLabel}</Text></View>
              <Text style={styles.historyText}>{t.text}</Text>
              <View style={styles.historyMetaRow}><Text style={styles.historyMeta}>❤️ {t.reactions.heart} reacciones</Text>{t.aiResponse && <Text style={styles.historyMeta}>🤖 IA respondió</Text>}</View>
            </View>
          ))
        )}
        <TouchableOpacity style={styles.historyBtn}><LinearGradient colors={["#a78bfa", "#7c3aed"]} style={styles.historyBtnGradient}><Text style={styles.historyBtnText}>Ver historial completo</Text></LinearGradient></TouchableOpacity>
      </View>

      {/* Public History Card */}
      <View style={[styles.card, { marginTop: 18 }] }>
        <View style={styles.cardRow}><MaterialCommunityIcons name="earth" size={22} color="#38bdf8" style={{ marginRight: 8 }} /><Text style={[styles.cardTitleText, { color: '#38bdf8', fontSize: 18 }]}>Tu Historial Público</Text></View>
        {publicHistory.length === 0 ? (
          <Text style={{ color: '#a5b4fc', textAlign: 'center', marginTop: 8 }}>Aún no tienes pensamientos públicos. ¡Publica uno y aparecerá aquí cuando expire!</Text>
        ) : (
          publicHistory.slice(0, 3).map(t => (
            <Animated.View key={t.id} style={[styles.historyItem, { transform: [{ scale: scaleAnim }] }] }>
              <TouchableOpacity activeOpacity={0.85} onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ width: '100%' }}>
                <View style={styles.historyRow}><Text style={styles.historyDate}>{new Date(t.createdAt).toLocaleDateString()}</Text><Text style={styles.historyTag}>{t.emotionLabel}</Text></View>
                <Text style={styles.historyText}>{t.text}</Text>
                <View style={styles.historyMetaRow}><Text style={styles.historyMeta}>❤️ {t.reactions.heart} reacciones</Text>{t.aiResponse && <Text style={styles.historyMeta}>🤖 IA respondió</Text>}</View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
        {publicHistory.length > 3 && <TouchableOpacity style={styles.historyBtn}><LinearGradient colors={["#38bdf8", "#a78bfa"]} style={styles.historyBtnGradient}><Text style={styles.historyBtnText}>Ver historial público completo</Text></LinearGradient></TouchableOpacity>}
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.bottomBtn}><LinearGradient colors={["#a78bfa", "#f472b6"]} style={styles.bottomBtnGradient}><MaterialCommunityIcons name="download" size={22} color="#fff" /><Text style={styles.bottomBtnText}>Exportar Diario</Text></LinearGradient></TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}><LinearGradient colors={["#38bdf8", "#a78bfa"]} style={styles.bottomBtnGradient}><MaterialCommunityIcons name="music" size={22} color="#fff" /><Text style={styles.bottomBtnText}>Música Emocional</Text></LinearGradient></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getStyles = (themeColors) => StyleSheet.create({
  bg: { flex: 1, backgroundColor: themeColors.background, paddingHorizontal: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 32, paddingBottom: 18 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: themeColors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: themeColors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  card: { borderRadius: 18, padding: 22, marginHorizontal: 16, marginTop: 8, marginBottom: 0, alignItems: 'center', shadowColor: themeColors.cardShadow, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, backgroundColor: themeColors.card },
  cardIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#6d28d9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardIconCircleGreen: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#052e16', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardTitleText: { color: themeColors.text, fontSize: 19, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  cardDesc: { color: themeColors.secondaryText, fontSize: 15, textAlign: 'center', marginBottom: 0 },
  cardLevel: { color: '#a7f3d0', fontSize: 15, marginTop: 4, marginBottom: 8, textAlign: 'center', fontWeight: '600' },
  progressBarBg: { width: '100%', height: 8, backgroundColor: '#334155', borderRadius: 8, marginBottom: 8, marginTop: 2, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#38bdf8', borderRadius: 8 },
  cardDescSmall: { color: themeColors.secondaryText, fontSize: 13, textAlign: 'center', marginTop: 4 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  analysisText: { color: themeColors.text, fontSize: 15, marginBottom: 8, textAlign: 'center' },
  analysisBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  analysisIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#a78bfa', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  analysisPercent: { color: themeColors.text, fontSize: 18, fontWeight: 'bold' },
  analysisSub: { color: '#a78bfa', fontSize: 13, textAlign: 'center', marginTop: 2 },
  historyItem: { backgroundColor: themeColors.card, borderRadius: 12, padding: 12, marginBottom: 10, width: '100%', shadowColor: themeColors.cardShadow, shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  historyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  historyDate: { color: themeColors.secondaryText, fontSize: 13, marginRight: 8 },
  historyTag: { color: '#fbbf24', fontSize: 13, fontWeight: 'bold' },
  historyText: { color: themeColors.text, fontSize: 15, marginBottom: 4 },
  historyMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  historyMeta: { color: themeColors.secondaryText, fontSize: 12 },
  historyBtn: { marginTop: 6, width: '100%', borderRadius: 12, overflow: 'hidden' },
  historyBtnGradient: { paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  historyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 28, marginHorizontal: 16, gap: 12 },
  bottomBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  bottomBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  bottomBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
  progressPercent: { color: '#a7f3d0', fontSize: 15, fontWeight: 'bold', marginTop: 4 },
  requirementsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12, gap: 8 },
  requirementBox: { flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 8, backgroundColor: '#334155' },
  requirementText: { color: '#a7f3d0', fontSize: 13, marginLeft: 4 },
  modalView: { backgroundColor: themeColors.card, borderRadius: 18, padding: 32, alignItems: 'center', width: 300 },
});

export default ProfileScreen;
