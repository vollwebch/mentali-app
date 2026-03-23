import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Modal, Animated, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThoughts } from '../../components/ThoughtsContext';
import { useTheme } from '../../ThemeContext';
import { Colors } from '../../constants/Colors';
import { PRIZES } from '../../constants/Prizes';
import { useRouter } from 'expo-router';

export default function PremiosScreen() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const colors = Colors[theme];
  const router = useRouter();
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAllUnlocked, setShowAllUnlocked] = useState(false);
  const [showAllLocked, setShowAllLocked] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useState(new Animated.Value(screenWidth))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];
  const { userStats } = useThoughts();

  useEffect(() => {
    if (settingsVisible) {
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: screenWidth, duration: 300, useNativeDriver: true }).start();
    }
  }, [settingsVisible]);

  useEffect(() => {
    if (showStats) {
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [showStats]);

  const ALL_PRIZES = PRIZES.map(prize => ({
    ...prize,
    unlocked: prize.isUnlocked ? prize.isUnlocked(userStats) : false,
    color: prize.color || '#8B5CF6',
  }));

  const unlockedPrizes = ALL_PRIZES.filter(p => p.unlocked);
  const lockedPrizes = ALL_PRIZES.filter(p => !p.unlocked);
  const visibleUnlockedPrizes = showAllUnlocked ? unlockedPrizes : unlockedPrizes.slice(0, 8);
  const visibleLockedPrizes = showAllLocked ? lockedPrizes : lockedPrizes.slice(0, 8);

  const howToWinItems = [
    { icon: 'pencil', text: 'Escribe pensamientos cada día' },
    { icon: 'heart', text: 'Recibe apoyo de la comunidad' },
    { icon: 'calendar-check', text: 'Mantén tu racha activa' },
    { icon: 'arrow-up-bold-circle', text: 'Sube de nivel tu árbol' },
    { icon: 'star', text: 'Participa en eventos especiales' },
  ];

  const renderPrize = (prize: any) => {
    const isIconName = typeof prize.icon === 'string' && prize.icon.length > 2;
    return (
      <View key={prize.id} style={[styles.prizeCard, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
        <View style={[styles.prizeIconContainer, { backgroundColor: prize.color + '20' }]}>
          {isIconName ? (
            <MaterialCommunityIcons name={prize.icon as any} size={28} color={prize.color} />
          ) : (
            <Text style={styles.prizeEmoji}>{prize.icon}</Text>
          )}
        </View>
        <Text style={[styles.prizeTitle, { color: colors.text }]} numberOfLines={2}>{prize.title}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={darkMode ? '#0A0A0A' : '#FFFFFF'} />
      
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Premios</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={[styles.headerBtn, { backgroundColor: darkMode ? '#161616' : '#F5F3FF' }]} onPress={() => setShowStats(true)}>
                <Feather name="bar-chart-2" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerBtn, { backgroundColor: darkMode ? '#161616' : '#F5F3FF' }]} onPress={() => setSettingsVisible(true)}>
                <Feather name="settings" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Banner */}
          <LinearGradient 
            colors={darkMode ? ['#1E1B4B', '#312E81'] : ['#6D28D9', '#8B5CF6']} 
            style={styles.statsBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsBannerIcon}>
              <MaterialCommunityIcons name="trophy-award" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.statsBannerTitle}>Tu Colección</Text>
            <Text style={styles.statsBannerDesc}>Celebra tus logros emocionales</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{unlockedPrizes.length}</Text>
                <Text style={styles.statLabel}>Desbloqueados</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{ALL_PRIZES.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{userStats.level}</Text>
                <Text style={styles.statLabel}>Nivel</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Unlocked Prizes */}
          <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="medal" size={22} color="#FBBF24" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Desbloqueados ({unlockedPrizes.length})</Text>
            </View>
            {unlockedPrizes.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="trophy-outline" size={40} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Aún no tienes premios</Text>
              </View>
            ) : (
              <>
                <View style={styles.prizesGrid}>
                  {visibleUnlockedPrizes.map(renderPrize)}
                </View>
                {unlockedPrizes.length > 8 && (
                  <TouchableOpacity onPress={() => setShowAllUnlocked(!showAllUnlocked)} style={styles.viewMoreBtn}>
                    <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                      {showAllUnlocked ? 'Ver menos' : `Ver todos (${unlockedPrizes.length})`}
                    </Text>
                    <Feather name={showAllUnlocked ? 'chevron-up' : 'chevron-down'} size={16} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* Locked Prizes */}
          <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="lock" size={22} color={colors.textMuted} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Por Desbloquear ({lockedPrizes.length})</Text>
            </View>
            <View style={styles.prizesGrid}>
              {visibleLockedPrizes.map(prize => (
                <View key={prize.id} style={[styles.prizeCardLocked, { backgroundColor: darkMode ? '#1A1A1A' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
                  <View style={styles.lockedIconContainer}>
                    <MaterialCommunityIcons name="lock" size={18} color={colors.textMuted} />
                  </View>
                  <Text style={[styles.prizeTitleLocked, { color: colors.textMuted }]} numberOfLines={2}>{prize.title}</Text>
                </View>
              ))}
            </View>
            {lockedPrizes.length > 8 && (
              <TouchableOpacity onPress={() => setShowAllLocked(!showAllLocked)} style={styles.viewMoreBtn}>
                <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                  {showAllLocked ? 'Ver menos' : `Ver todos (${lockedPrizes.length})`}
                </Text>
                <Feather name={showAllLocked ? 'chevron-up' : 'chevron-down'} size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* How to Win */}
          <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#E5E5E5' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="lightbulb" size={22} color="#38BDF8" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>¿Cómo ganar?</Text>
            </View>
            {howToWinItems.map((item, index) => (
              <View key={index} style={[styles.howToWinItem, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
                <View style={[styles.howToWinNumber, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
                  <Text style={[styles.howToWinNumberText, { color: colors.primary }]}>{index + 1}</Text>
                </View>
                <MaterialCommunityIcons name={item.icon as any} size={20} color={colors.primary} />
                <Text style={[styles.howToWinText, { color: colors.text }]}>{item.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Settings Modal */}
      <Modal transparent visible={settingsVisible} onRequestClose={() => setSettingsVisible(false)} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#161616' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Ajustes</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)} style={styles.closeBtn}>
                <Feather name="x" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={[styles.settingRow, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
              <View style={styles.settingLeft}>
                <MaterialCommunityIcons name="vibrate" size={22} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Vibración Háptica</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={(value) => {
                  setVibrationEnabled(value);
                  if (value) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                trackColor={{ false: '#767577', true: colors.primary + '80' }}
                thumbColor={vibrationEnabled ? colors.primary : '#F4F3F4'}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Stats Modal */}
      <Modal transparent visible={showStats} onRequestClose={() => setShowStats(false)} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: darkMode ? '#161616' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Estadísticas</Text>
              <TouchableOpacity onPress={() => setShowStats(false)} style={styles.closeBtn}>
                <Feather name="x" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsSection}>
              <Text style={[styles.statsSectionTitle, { color: colors.primary }]}>Actividad</Text>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pensamientos</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{userStats.thoughtsWritten}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Racha</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{userStats.streak} días</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Likes recibidos</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{userStats.likesReceived}</Text>
              </View>
            </View>
            <View style={styles.statsSection}>
              <Text style={[styles.statsSectionTitle, { color: colors.primary }]}>Progreso</Text>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Nivel actual</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{userStats.level}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP Actual</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{userStats.xp}</Text>
              </View>
            </View>
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
  headerButtons: { flexDirection: 'row', gap: 10 },
  headerBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statsBanner: { borderRadius: 20, padding: 20, marginHorizontal: 16, alignItems: 'center', marginBottom: 16 },
  statsBannerIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statsBannerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  statsBannerDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center' },
  statBox: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  statNumber: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 4 },
  sectionCard: { borderRadius: 20, borderWidth: 1, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14 },
  prizesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  prizeCard: { width: '23%', aspectRatio: 1, borderRadius: 14, padding: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  prizeCardLocked: { width: '23%', aspectRatio: 1, borderRadius: 14, padding: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  prizeIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  prizeEmoji: { fontSize: 24 },
  prizeTitle: { fontSize: 9, fontWeight: '700', textAlign: 'center' },
  prizeTitleLocked: { fontSize: 9, fontWeight: '600', textAlign: 'center' },
  lockedIconContainer: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  viewMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 6, paddingVertical: 10 },
  viewMoreText: { fontSize: 14, fontWeight: '600' },
  howToWinItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, marginBottom: 6, gap: 10 },
  howToWinNumber: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  howToWinNumberText: { fontSize: 11, fontWeight: '800' },
  howToWinText: { fontSize: 13, flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 20, padding: 20, width: 300, maxWidth: '90%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  statsSection: { marginBottom: 20 },
  statsSectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  statLabel: { fontSize: 14 },
  statValue: { fontSize: 14, fontWeight: '700' },
});
