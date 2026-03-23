import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Modal, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThoughts } from '../../components/ThoughtsContext';
import { useTheme } from '../../ThemeContext';
import { Colors } from '../../constants/Colors';
import { PRIZES } from '../../constants/Prizes';
import { useRouter } from 'expo-router';

const HowToWinItem = ({ icon, text, themeColors }) => (
  <View style={getStyles(themeColors).howToWinItem}>
    <MaterialCommunityIcons name={icon} size={24} color={themeColors.secondaryText} style={{ marginRight: 12 }} />
    <Text style={getStyles(themeColors).howToWinText}>{text}</Text>
  </View>
);

export default function PremiosScreen() {
  const { theme } = useTheme();
  const styles = getStyles(Colors[theme]);
  const router = useRouter();
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAllUnlocked, setShowAllUnlocked] = useState(false);
  const [showAllLocked, setShowAllLocked] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useState(new Animated.Value(screenWidth))[0]; // For settings drawer
  const opacityAnim = useState(new Animated.Value(0))[0]; // For stats popup
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
    color: prize.color || '#6d28d9',
  }));

  const unlockedPrizes = ALL_PRIZES.filter(p => p.unlocked);
  const lockedPrizes = ALL_PRIZES.filter(p => !p.unlocked);
  const visibleUnlockedPrizes = showAllUnlocked ? unlockedPrizes : unlockedPrizes.slice(0, 10);
  const visibleLockedPrizes = showAllLocked ? lockedPrizes : lockedPrizes.slice(0, 10);

  // ... (useEffect for confetti and other functions remain the same) ...

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowStats(true)}><Feather name="bar-chart-2" size={22} color={Colors[theme].text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Premios</Text>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setSettingsVisible(true)}><Feather name="settings" size={22} color={Colors[theme].text} /></TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <LinearGradient colors={["#3a2a5d", "#4b256a"]} style={styles.card}>
          <View style={styles.cardIconCircle}><MaterialCommunityIcons name="trophy-award" size={36} color="#fff" /></View>
          <Text style={styles.cardTitleText}>Tu Colección de Premios</Text>
          <Text style={styles.cardDesc}>Celebra tus logros y crecimiento emocional</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}><Text style={styles.statNumber}>{unlockedPrizes.length}</Text><Text style={styles.statLabel}>Desbloqueados</Text></View>
            <View style={styles.statBox}><Text style={styles.statNumber}>{ALL_PRIZES.length}</Text><Text style={styles.statLabel}>Total</Text></View>
            <View style={styles.statBox}><Text style={styles.statNumber}>{userStats.level}</Text><Text style={styles.statLabel}>Nivel</Text></View>
          </View>
        </LinearGradient>

        {/* Unlocked Prizes */}
        <View style={[styles.card, { marginTop: 18 }]}>
          <View style={styles.cardRow}><MaterialCommunityIcons name="medal" size={22} color="#fbbf24" style={{ marginRight: 8 }} /><Text style={[styles.cardTitleText, { color: '#fbbf24', fontSize: 18 }]}>Premios Desbloqueados</Text></View>
          {unlockedPrizes.length === 0 ? (
            <Text style={styles.noPrizesText}>Aún no has desbloqueado ningún premio. ¡Sigue participando!</Text>
          ) : (
            <View style={styles.prizesGrid}>
              {visibleUnlockedPrizes.map(prize => {
                const isIconName = typeof prize.icon === 'string' && prize.icon.length > 2;
                return (
                  <LinearGradient key={prize.id} colors={[prize.color, '#23243a']} style={styles.prizeCard}>
                    {isIconName ? <MaterialCommunityIcons name={prize.icon} size={32} color="#fff" style={{ marginBottom: 8 }} /> : <Text style={styles.prizeIcon}>{prize.icon}</Text>}
                    <Text style={styles.prizeTitle} numberOfLines={1} ellipsizeMode="tail">{prize.title}</Text>
                  </LinearGradient>
                );
              })}
            </View>
          )}
          {unlockedPrizes.length > 10 && (
            <TouchableOpacity onPress={() => setShowAllUnlocked(!showAllUnlocked)} style={{ width: '100%' }}>
              <LinearGradient colors={["#3a2a5d", "#4b256a"]} style={styles.viewMoreBtn}>
                <Text style={styles.viewMoreBtnText}>{showAllUnlocked ? 'Ver menos' : 'Ver más'}</Text>
                <Feather name={showAllUnlocked ? 'chevron-up' : 'chevron-down'} size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Locked Prizes */}
        <View style={[styles.card, { marginTop: 18 }]}>
          <View style={styles.cardRow}><MaterialCommunityIcons name="lock" size={22} color="#64748b" style={{ marginRight: 8 }} /><Text style={[styles.cardTitleText, { color: '#64748b', fontSize: 18 }]}>Premios por Desbloquear</Text></View>
          <View style={styles.prizesGrid}>
            {visibleLockedPrizes.map(prize => (
              <View key={prize.id} style={styles.prizeCardLocked}>
                <View style={styles.lockedIcon}><MaterialCommunityIcons name="lock" size={24} color="#64748b" /></View>
                <Text style={styles.prizeTextLocked}>{prize.title}</Text>
              </View>
            ))}
          </View>
          {lockedPrizes.length > 10 && (
            <TouchableOpacity onPress={() => setShowAllLocked(!showAllLocked)} style={{ width: '100%' }}>
              <LinearGradient colors={["#3a2a5d", "#4b256a"]} style={styles.viewMoreBtn}>
                <Text style={styles.viewMoreBtnText}>{showAllLocked ? 'Ver menos' : 'Ver más'}</Text>
                <Feather name={showAllLocked ? 'chevron-up' : 'chevron-down'} size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* How to Win Card */}
        <View style={[styles.card, { marginTop: 18 }]}>
          <View style={styles.cardRow}><MaterialCommunityIcons name="help-circle-outline" size={22} color="#38bdf8" style={{ marginRight: 8 }} /><Text style={[styles.cardTitleText, { color: '#38bdf8', fontSize: 18 }]}>¿Cómo ganar premios?</Text></View>
          <HowToWinItem icon="pencil-outline" text="Escribiendo pensamientos cada día." themeColors={Colors[theme]} />
          <HowToWinItem icon="heart-multiple-outline" text="Recibiendo 'me gusta' de la comunidad." themeColors={Colors[theme]} />
          <HowToWinItem icon="calendar-check-outline" text="Manteniendo una racha de días activos." themeColors={Colors[theme]} />
          <HowToWinItem icon="arrow-up-bold-circle-outline" text="Subiendo de nivel tu árbol emocional." themeColors={Colors[theme]} />
          <HowToWinItem icon="emoticon-happy-outline" text="Registrando rachas de emociones específicas." themeColors={Colors[theme]} />
          <HowToWinItem icon="star-outline" text="Participando en días y eventos especiales." themeColors={Colors[theme]} />
          <TouchableOpacity onPress={() => router.push('/prizes/how-to-unlock')} style={{ width: '100%' }}>
            <LinearGradient colors={["#3a2a5d", "#4b256a"]} style={styles.viewMoreBtn}>
              <Text style={styles.viewMoreBtnText}>Ver todos los detalles</Text>
              <Feather name="arrow-right-circle" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </ScrollView>

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
            <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Ajustes</Text>
                    <TouchableOpacity onPress={closeSettings}>
                        <Feather name="x" size={24} color={Colors[theme].text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.drawerOptionRow}>
                    <Text style={styles.drawerOptionLabel}>Vibración Háptica</Text>
                    <Switch
                        value={vibrationEnabled}
                        onValueChange={(value) => {
                            setVibrationEnabled(value);
                            if (value) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={vibrationEnabled ? "#f5dd4b" : "#f4f3f4"}
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
            <Animated.View style={[styles.modalView, { opacity: opacityAnim }]}>
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Estadísticas</Text>
                    <TouchableOpacity onPress={closeStats}>
                        <Feather name="x" size={24} color={Colors[theme].text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.statSection}>
                    <Text style={styles.statSectionTitle}>Actividad</Text>
                    <View style={styles.statRowModal}><Text style={styles.statLabelModal}>Pensamientos escritos</Text><Text style={styles.statValueModal}>{userStats.thoughtsWritten}</Text></View>
                    <View style={styles.statRowModal}><Text style={styles.statLabelModal}>Días de racha</Text><Text style={styles.statValueModal}>{userStats.streak}</Text></View>
                    <View style={styles.statRowModal}><Text style={styles.statLabelModal}>Me gustas recibidos</Text><Text style={styles.statValueModal}>{userStats.likesReceived}</Text></View>
                </View>
                <View style={styles.statSection}>
                    <Text style={styles.statSectionTitle}>Nivel</Text>
                    <View style={styles.statRowModal}><Text style={styles.statLabelModal}>Nivel actual</Text><Text style={styles.statValueModal}>{userStats.level}</Text></View>
                    <View style={styles.statRowModal}><Text style={styles.statLabelModal}>XP Actual</Text><Text style={styles.statValueModal}>{userStats.xp}</Text></View>
                    <View style={styles.statRowModal}><Text style={styles.statLabelModal}>XP para siguiente nivel</Text><Text style={styles.statValueModal}>{userStats.xpForNextLevel}</Text></View>
                </View>
            </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const getStyles = (themeColors) => StyleSheet.create({
  // ... (existing styles) ...
  howToWinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  howToWinText: {
    color: themeColors.text,
    fontSize: 15,
    flex: 1,
  },
  noPrizesText: {
    color: themeColors.secondaryText,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 16,
  },
  // ... (rest of the styles) ...
  bg: { flex: 1, backgroundColor: themeColors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 32, paddingBottom: 18 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: themeColors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: themeColors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  card: { borderRadius: 18, padding: 22, marginHorizontal: 16, marginTop: 8, marginBottom: 0, alignItems: 'center', shadowColor: themeColors.cardShadow, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, backgroundColor: themeColors.card },
  cardIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#6d28d9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardTitleText: { color: themeColors.text, fontSize: 19, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  cardDesc: { color: themeColors.secondaryText, fontSize: 15, textAlign: 'center', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginTop: 8 },
  statBox: { alignItems: 'center', minWidth: 80 },
  statNumber: { color: '#a7f3d0', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: themeColors.secondaryText, fontSize: 12, marginTop: 2 },
  prizesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  prizeCard: { width: '48%', height: 120, marginBottom: 12, borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  prizeCardLocked: { width: '48%', height: 120, marginBottom: 12, borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder },
  lockedIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: themeColors.cardBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  prizeIcon: { fontSize: 32, marginBottom: 8 },
  prizeTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 4 },
  prizeTextLocked: { fontSize: 14, fontWeight: 'bold', color: themeColors.secondaryText, textAlign: 'center', marginBottom: 4 },
  prizeLevel: { fontSize: 12, color: '#a7f3d0', fontWeight: '600' },
  prizeLevelLocked: { fontSize: 12, color: themeColors.secondaryText, fontWeight: '600' },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, alignSelf: 'flex-start' },
  drawerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 },
  drawer: { position: 'absolute', top: 0, right: 0, width: '80%', height: '100%', backgroundColor: themeColors.card, padding: 24, zIndex: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: -2, height: 0 }, elevation: 10 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  drawerTitle: { color: themeColors.text, fontSize: 20, fontWeight: 'bold' },
  drawerOptionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  drawerOptionLabel: { color: themeColors.secondaryText, fontSize: 16 },
  statSection: { marginBottom: 24 },
  statSectionTitle: { color: '#a78bfa', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  statRowModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  statLabelModal: { color: themeColors.secondaryText, fontSize: 16 },
  statValueModal: { color: '#a7f3d0', fontSize: 16, fontWeight: 'bold' },
  modalView: {
    backgroundColor: themeColors.card,
    borderRadius: 18,
    padding: 24,
    width: 320,
  },
  centeredOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewMoreBtn: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  viewMoreBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});