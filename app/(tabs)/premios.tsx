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

const MAX_WIDTH = 480;

const HowToWinItem = ({ icon, text, themeColors, darkMode }) => (
  <View style={[styles.howToWinItem, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
    <View style={[styles.howToWinIcon, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
      <MaterialCommunityIcons name={icon} size={20} color={themeColors.primary} />
    </View>
    <Text style={[styles.howToWinText, { color: themeColors.text }]}>{text}</Text>
  </View>
);

export default function PremiosScreen() {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const styles = getStyles(Colors[theme], darkMode);
  const router = useRouter();
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAllUnlocked, setShowAllUnlocked] = useState(false);
  const [showAllLocked, setShowAllLocked] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 900;
  const slideAnim = useState(new Animated.Value(screenWidth))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];
  const { userStats } = useThoughts();

  useEffect(() => {
    if (settingsVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [settingsVisible]);

  useEffect(() => {
    if (showStats) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showStats]);

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  const closeStats = () => {
    setShowStats(false);
  };

  const ALL_PRIZES = PRIZES.map(prize => ({
    ...prize,
    unlocked: prize.isUnlocked ? prize.isUnlocked(userStats) : false,
    color: prize.color || '#8B5CF6',
  }));

  const unlockedPrizes = ALL_PRIZES.filter(p => p.unlocked);
  const lockedPrizes = ALL_PRIZES.filter(p => !p.unlocked);
  const visibleUnlockedPrizes = showAllUnlocked ? unlockedPrizes : unlockedPrizes.slice(0, 8);
  const visibleLockedPrizes = showAllLocked ? lockedPrizes : lockedPrizes.slice(0, 8);

  return (
    <SafeAreaView style={[styles.bg, { backgroundColor: darkMode ? '#0A0A0A' : Colors[theme].background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={darkMode ? '#0A0A0A' : Colors[theme].background} />
      
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32, maxWidth: MAX_WIDTH, width: '100%', alignSelf: 'center' }}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setShowStats(true)}>
              <Feather name="bar-chart-2" size={20} color={Colors[theme].text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mis Premios</Text>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setSettingsVisible(true)}>
              <Feather name="settings" size={20} color={Colors[theme].text} />
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
              <MaterialCommunityIcons name="trophy-award" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.welcomeTitle}>Tu Colección de Premios</Text>
            <Text style={styles.welcomeDesc}>Celebra tus logros y crecimiento emocional</Text>
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
          <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : Colors[theme].card, borderColor: darkMode ? '#252525' : '#F0F0F0' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="medal" size={22} color="#FBBF24" />
              <Text style={[styles.sectionTitle, { color: '#FBBF24' }]}>Premios Desbloqueados</Text>
            </View>
            {unlockedPrizes.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="trophy-outline" size={48} color={Colors[theme].textMuted} />
                <Text style={[styles.emptyText, { color: Colors[theme].textMuted }]}>
                  Aún no has desbloqueado premios
                </Text>
                <Text style={[styles.emptySubtext, { color: Colors[theme].textMuted }]}>
                  ¡Sigue participando para ganar!
                </Text>
              </View>
            ) : (
              <View style={styles.prizesGrid}>
                {visibleUnlockedPrizes.map(prize => {
                  const isIconName = typeof prize.icon === 'string' && prize.icon.length > 2;
                  return (
                    <View key={prize.id} style={[styles.prizeCard, { backgroundColor: darkMode ? '#1F1F1F' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#ECECEC' }]}>
                      <View style={[styles.prizeIconContainer, { backgroundColor: prize.color + '20' }]}>
                        {isIconName ? (
                          <MaterialCommunityIcons name={prize.icon} size={28} color={prize.color} />
                        ) : (
                          <Text style={styles.prizeIcon}>{prize.icon}</Text>
                        )}
                      </View>
                      <Text style={[styles.prizeTitle, { color: Colors[theme].text }]} numberOfLines={1}>{prize.title}</Text>
                    </View>
                  );
                })}
              </View>
            )}
            {unlockedPrizes.length > 8 && (
              <TouchableOpacity onPress={() => setShowAllUnlocked(!showAllUnlocked)} style={styles.viewMoreBtn}>
                <Text style={[styles.viewMoreText, { color: Colors[theme].primary }]}>
                  {showAllUnlocked ? 'Ver menos' : `Ver todos (${unlockedPrizes.length})`}
                </Text>
                <Feather name={showAllUnlocked ? 'chevron-up' : 'chevron-down'} size={18} color={Colors[theme].primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Locked Prizes */}
          <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : Colors[theme].card, borderColor: darkMode ? '#252525' : '#F0F0F0' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="lock" size={22} color={Colors[theme].textMuted} />
              <Text style={[styles.sectionTitle, { color: Colors[theme].textMuted }]}>Por Desbloquear</Text>
            </View>
            <View style={styles.prizesGrid}>
              {visibleLockedPrizes.map(prize => (
                <View key={prize.id} style={[styles.prizeCardLocked, { backgroundColor: darkMode ? '#1A1A1A' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#ECECEC' }]}>
                  <View style={styles.lockedIconContainer}>
                    <MaterialCommunityIcons name="lock" size={20} color={Colors[theme].textMuted} />
                  </View>
                  <Text style={[styles.prizeTitleLocked, { color: Colors[theme].textMuted }]} numberOfLines={1}>{prize.title}</Text>
                </View>
              ))}
            </View>
            {lockedPrizes.length > 8 && (
              <TouchableOpacity onPress={() => setShowAllLocked(!showAllLocked)} style={styles.viewMoreBtn}>
                <Text style={[styles.viewMoreText, { color: Colors[theme].primary }]}>
                  {showAllLocked ? 'Ver menos' : `Ver todos (${lockedPrizes.length})`}
                </Text>
                <Feather name={showAllLocked ? 'chevron-up' : 'chevron-down'} size={18} color={Colors[theme].primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* How to Win Card */}
          <View style={[styles.sectionCard, { backgroundColor: darkMode ? '#161616' : Colors[theme].card, borderColor: darkMode ? '#252525' : '#F0F0F0' }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="help-circle" size={22} color="#38BDF8" />
              <Text style={[styles.sectionTitle, { color: '#38BDF8' }]}>¿Cómo ganar premios?</Text>
            </View>
            <HowToWinItem icon="pencil" text="Escribiendo pensamientos cada día" themeColors={Colors[theme]} darkMode={darkMode} />
            <HowToWinItem icon="heart" text="Recibiendo 'me gusta' de la comunidad" themeColors={Colors[theme]} darkMode={darkMode} />
            <HowToWinItem icon="calendar-check" text="Manteniendo una racha de días activos" themeColors={Colors[theme]} darkMode={darkMode} />
            <HowToWinItem icon="arrow-up-bold-circle" text="Subiendo de nivel tu árbol emocional" themeColors={Colors[theme]} darkMode={darkMode} />
            <HowToWinItem icon="star" text="Participando en eventos especiales" themeColors={Colors[theme]} darkMode={darkMode} />
            <TouchableOpacity onPress={() => router.push('/prizes/how-to-unlock')} style={styles.viewMoreBtn}>
              <Text style={[styles.viewMoreText, { color: Colors[theme].primary }]}>Ver todos los detalles</Text>
              <Feather name="arrow-right" size={18} color={Colors[theme].primary} />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>

      {/* Settings Modal */}
      <Modal
        transparent={true}
        visible={settingsVisible}
        onRequestClose={closeSettings}
        animationType="none"
      >
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPressOut={closeSettings}
        >
          <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }], backgroundColor: darkMode ? '#161616' : Colors[theme].card }]}>
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: Colors[theme].text }]}>Ajustes</Text>
              <TouchableOpacity onPress={closeSettings} style={styles.closeBtn}>
                <Feather name="x" size={22} color={Colors[theme].textMuted} />
              </TouchableOpacity>
            </View>
            <View style={[styles.drawerOptionRow, { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' }]}>
              <View style={styles.optionLeft}>
                <MaterialCommunityIcons name="vibrate" size={22} color={Colors[theme].primary} />
                <Text style={[styles.drawerOptionLabel, { color: Colors[theme].text }]}>Vibración Háptica</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={(value) => {
                  setVibrationEnabled(value);
                  if (value) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                trackColor={{ false: '#767577', true: Colors[theme].primary + '80' }}
                thumbColor={vibrationEnabled ? Colors[theme].primary : '#F4F3F4'}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Stats Modal */}
      <Modal
        transparent={true}
        visible={showStats}
        onRequestClose={closeStats}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.centeredOverlay}
          activeOpacity={1}
          onPressOut={closeStats}
        >
          <Animated.View style={[styles.modalView, { backgroundColor: darkMode ? '#161616' : Colors[theme].card, opacity: opacityAnim }]}>
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: Colors[theme].text }]}>Estadísticas</Text>
              <TouchableOpacity onPress={closeStats} style={styles.closeBtn}>
                <Feather name="x" size={22} color={Colors[theme].textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.statSection}>
              <Text style={[styles.statSectionTitle, { color: Colors[theme].primary }]}>Actividad</Text>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: Colors[theme].textSecondary }]}>Pensamientos</Text>
                <Text style={[styles.statValueModal, { color: Colors[theme].text }]}>{userStats.thoughtsWritten}</Text>
              </View>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: Colors[theme].textSecondary }]}>Racha</Text>
                <Text style={[styles.statValueModal, { color: Colors[theme].text }]}>{userStats.streak} días</Text>
              </View>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: Colors[theme].textSecondary }]}>Likes recibidos</Text>
                <Text style={[styles.statValueModal, { color: Colors[theme].text }]}>{userStats.likesReceived}</Text>
              </View>
            </View>
            <View style={styles.statSection}>
              <Text style={[styles.statSectionTitle, { color: Colors[theme].primary }]}>Progreso</Text>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: Colors[theme].textSecondary }]}>Nivel actual</Text>
                <Text style={[styles.statValueModal, { color: Colors[theme].text }]}>{userStats.level}</Text>
              </View>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: Colors[theme].textSecondary }]}>XP Actual</Text>
                <Text style={[styles.statValueModal, { color: Colors[theme].text }]}>{userStats.xp}</Text>
              </View>
              <View style={styles.statRowModal}>
                <Text style={[styles.statLabelModal, { color: Colors[theme].textSecondary }]}>Siguiente nivel</Text>
                <Text style={[styles.statValueModal, { color: Colors[theme].text }]}>{userStats.xpForNextLevel} XP</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (themeColors, darkMode) => StyleSheet.create({
  bg: { flex: 1 },
  contentWrapper: { flex: 1 },
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
    textAlign: 'center',
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
    marginBottom: 20 
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    width: '100%',
    alignItems: 'center',
  },
  statBox: { 
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: { 
    color: '#FFFFFF', 
    fontSize: 28, 
    fontWeight: '800' 
  },
  statLabel: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 12, 
    marginTop: 4 
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
  },
  prizesGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10,
  },
  prizeCard: { 
    width: '23%',
    aspectRatio: 1,
    borderRadius: 16, 
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  prizeCardLocked: { 
    width: '23%',
    aspectRatio: 1,
    borderRadius: 16, 
    padding: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  prizeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  prizeIcon: { fontSize: 28 },
  prizeTitle: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  prizeTitleLocked: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  lockedIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: darkMode ? '#252525' : '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
    paddingVertical: 12,
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
  howToWinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    gap: 12,
  },
  howToWinIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  howToWinText: {
    fontSize: 14,
    flex: 1,
  },
  drawerOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  drawer: { 
    position: 'absolute', 
    top: 0, 
    right: 0, 
    width: '80%', 
    maxWidth: 360,
    height: '100%', 
    padding: 24,
    paddingTop: 48,
  },
  drawerHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 24 
  },
  drawerTitle: { fontSize: 22, fontWeight: '800' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: darkMode ? '#252525' : '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerOptionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerOptionLabel: { fontSize: 16, fontWeight: '600' },
  statSection: { marginBottom: 24 },
  statSectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  statRowModal: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8,
    paddingVertical: 8,
  },
  statLabelModal: { fontSize: 15 },
  statValueModal: { fontSize: 15, fontWeight: '700' },
  modalView: {
    borderRadius: 24,
    padding: 24,
    width: 320,
    maxWidth: '90%',
  },
  centeredOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
