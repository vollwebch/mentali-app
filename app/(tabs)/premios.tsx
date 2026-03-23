import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Modal, Animated, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThoughts } from '../../components/ThoughtsContext';
import { useTheme } from '../../ThemeContext';
import { Colors } from '../../constants/Colors';
import { PRIZES } from '../../constants/Prizes';
import { useRouter } from 'expo-router';

const CONTENT_MAX_WIDTH = 600;
const SIDEBAR_WIDTH = 280;

const HowToWinItem = ({ icon, text, themeColors, darkMode, index }) => (
  <View style={[styles.howToWinItem, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
    <View style={[styles.howToWinNumber, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
      <Text style={[styles.howToWinNumberText, { color: themeColors.primary }]}>{index + 1}</Text>
    </View>
    <MaterialCommunityIcons name={icon} size={22} color={themeColors.primary} style={styles.howToWinIcon} />
    <Text style={[styles.howToWinText, { color: themeColors.text }]}>{text}</Text>
  </View>
);

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
  const isLargeScreen = screenWidth > 1200;
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

  const closeSettings = () => setSettingsVisible(false);
  const closeStats = () => setShowStats(false);

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
            <TouchableOpacity style={styles.logoContainer} onPress={() => router.push('/')}>
              <LinearGradient colors={['#8B5CF6', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoGradient}>
                <MaterialCommunityIcons name="brain" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.logoText, { color: colors.text }]}>Mentali</Text>
            </TouchableOpacity>

            <View style={styles.navSection}>
              <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)')}>
                <MaterialCommunityIcons name="home-outline" size={24} color={colors.textMuted} />
                <Text style={[styles.navText, { color: colors.textMuted }]}>Inicio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navItem, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.12)' : '#F0EBFF' }]} onPress={() => router.push('/(tabs)/premios')}>
                <MaterialCommunityIcons name="trophy" size={24} color={colors.primary} />
                <Text style={[styles.navText, { color: colors.primary }]}>Premios</Text>
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
          </View>
        )}

        {/* Main Content */}
        <View style={styles.contentArea}>
          <ScrollView contentContainerStyle={{ paddingBottom: 32, maxWidth: isLargeScreen ? CONTENT_MAX_WIDTH : '100%', width: '100%', alignSelf: 'center' }}>
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
            <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: darkMode ? 'rgba(251, 191, 36, 0.15)' : '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="medal" size={20} color="#FBBF24" />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Desbloqueados</Text>
                <Text style={[styles.sectionCount, { color: colors.textMuted }]}>{unlockedPrizes.length}</Text>
              </View>
              {unlockedPrizes.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="trophy-outline" size={40} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>Aún no tienes premios</Text>
                </View>
              ) : (
                <View style={styles.prizesGrid}>
                  {visibleUnlockedPrizes.map(prize => {
                    const isIconName = typeof prize.icon === 'string' && prize.icon.length > 2;
                    return (
                      <View key={prize.id} style={[styles.prizeCard, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
                        <View style={[styles.prizeIconContainer, { backgroundColor: prize.color + '20' }]}>
                          {isIconName ? (
                            <MaterialCommunityIcons name={prize.icon} size={28} color={prize.color} />
                          ) : (
                            <Text style={styles.prizeIcon}>{prize.icon}</Text>
                          )}
                        </View>
                        <Text style={[styles.prizeTitle, { color: colors.text }]} numberOfLines={1}>{prize.title}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
              {unlockedPrizes.length > 8 && (
                <TouchableOpacity onPress={() => setShowAllUnlocked(!showAllUnlocked)} style={styles.viewMoreBtn}>
                  <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                    {showAllUnlocked ? 'Ver menos' : `Ver todos (${unlockedPrizes.length})`}
                  </Text>
                  <Feather name={showAllUnlocked ? 'chevron-up' : 'chevron-down'} size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Locked Prizes */}
            <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: darkMode ? '#252525' : '#F3F4F6' }]}>
                  <MaterialCommunityIcons name="lock" size={20} color={colors.textMuted} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Por Desbloquear</Text>
                <Text style={[styles.sectionCount, { color: colors.textMuted }]}>{lockedPrizes.length}</Text>
              </View>
              <View style={styles.prizesGrid}>
                {visibleLockedPrizes.map(prize => (
                  <View key={prize.id} style={[styles.prizeCardLocked, { backgroundColor: darkMode ? '#1A1A1A' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
                    <View style={styles.lockedIconContainer}>
                      <MaterialCommunityIcons name="lock" size={18} color={colors.textMuted} />
                    </View>
                    <Text style={[styles.prizeTitleLocked, { color: colors.textMuted }]} numberOfLines={1}>{prize.title}</Text>
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
            <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#EBEBEB' }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: darkMode ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE' }]}>
                  <MaterialCommunityIcons name="lightbulb" size={20} color="#38BDF8" />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>¿Cómo ganar?</Text>
              </View>
              {howToWinItems.map((item, index) => (
                <HowToWinItem key={index} icon={item.icon} text={item.text} themeColors={colors} darkMode={darkMode} index={index} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Settings Modal */}
      <Modal transparent visible={settingsVisible} onRequestClose={closeSettings} animationType="none">
        <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPressOut={closeSettings}>
          <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }], backgroundColor: darkMode ? '#161616' : '#FFFFFF' }]}>
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: colors.text }]}>Ajustes</Text>
              <TouchableOpacity onPress={closeSettings} style={styles.closeBtn}>
                <Feather name="x" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={[styles.drawerOptionRow, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons name="vibrate" size={22} color={colors.primary} />
                <Text style={[styles.drawerOptionLabel, { color: colors.text }]}>Vibración Háptica</Text>
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
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Stats Modal */}
      <Modal transparent visible={showStats} onRequestClose={closeStats} animationType="fade">
        <TouchableOpacity style={styles.centeredOverlay} activeOpacity={1} onPressOut={closeStats}>
          <Animated.View style={[styles.modalView, { backgroundColor: darkMode ? '#161616' : '#FFFFFF', opacity: opacityAnim }]}>
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: colors.text }]}>Estadísticas</Text>
              <TouchableOpacity onPress={closeStats} style={styles.closeBtn}>
                <Feather name="x" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.statSection}>
              <Text style={[styles.statSectionTitle, { color: colors.primary }]}>Actividad</Text>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: colors.textSecondary }]}>Pensamientos</Text>
                <Text style={[styles.statValueModal, { color: colors.text }]}>{userStats.thoughtsWritten}</Text>
              </View>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: colors.textSecondary }]}>Racha</Text>
                <Text style={[styles.statValueModal, { color: colors.text }]}>{userStats.streak} días</Text>
              </View>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: colors.textSecondary }]}>Likes recibidos</Text>
                <Text style={[styles.statValueModal, { color: colors.text }]}>{userStats.likesReceived}</Text>
              </View>
            </View>
            <View style={styles.statSection}>
              <Text style={[styles.statSectionTitle, { color: colors.primary }]}>Progreso</Text>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: colors.textSecondary }]}>Nivel actual</Text>
                <Text style={[styles.statValueModal, { color: colors.text }]}>{userStats.level}</Text>
              </View>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: colors.textSecondary }]}>XP Actual</Text>
                <Text style={[styles.statValueModal, { color: colors.text }]}>{userStats.xp}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContainer: { flex: 1, flexDirection: 'row' },
  sidebar: { width: SIDEBAR_WIDTH, borderRightWidth: 1, paddingVertical: 20, paddingHorizontal: 16 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  logoGradient: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: '800', marginLeft: 12 },
  navSection: { gap: 4 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 16, gap: 14 },
  navText: { fontSize: 16, fontWeight: '600' },
  contentArea: { flex: 1, alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '800' },
  headerButtons: { flexDirection: 'row', gap: 10 },
  headerBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statsBanner: { borderRadius: 24, padding: 24, marginHorizontal: 16, alignItems: 'center', marginBottom: 16 },
  statsBannerIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statsBannerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statsBannerDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center' },
  statBox: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  statNumber: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 4 },
  sectionCard: { borderRadius: 20, borderWidth: 1, padding: 18, marginHorizontal: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  sectionIconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', flex: 1 },
  sectionCount: { fontSize: 14, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 28, gap: 8 },
  emptyText: { fontSize: 14 },
  prizesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  prizeCard: { width: '23%', aspectRatio: 1, borderRadius: 16, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  prizeCardLocked: { width: '23%', aspectRatio: 1, borderRadius: 16, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  prizeIconContainer: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  prizeIcon: { fontSize: 26 },
  prizeTitle: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  prizeTitleLocked: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  lockedIconContainer: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  viewMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14, gap: 6, paddingVertical: 10 },
  viewMoreText: { fontSize: 14, fontWeight: '600' },
  howToWinItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, marginBottom: 8, gap: 12 },
  howToWinNumber: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  howToWinNumberText: { fontSize: 12, fontWeight: '800' },
  howToWinIcon: { width: 24 },
  howToWinText: { fontSize: 14, flex: 1 },
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  drawer: { position: 'absolute', top: 0, right: 0, width: '80%', maxWidth: 360, height: '100%', padding: 24, paddingTop: 48 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  drawerTitle: { fontSize: 22, fontWeight: '800' },
  closeBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
  drawerOptionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16 },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  drawerOptionLabel: { fontSize: 16, fontWeight: '600' },
  centeredOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { borderRadius: 24, padding: 24, width: 320, maxWidth: '90%' },
  statSection: { marginBottom: 24 },
  statSectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  statRowModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingVertical: 8 },
  statLabelModal: { fontSize: 15 },
  statValueModal: { fontSize: 15, fontWeight: '700' },
});
