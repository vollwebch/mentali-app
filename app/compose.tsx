import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import EmotionFilter from '../components/EmotionFilter';
import { useThoughts } from '../components/ThoughtsContext';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/Colors';

const MAX_WIDTH = 480;

const EMOTION_OPTIONS = [
  { key: 'joy', emoji: '😊', label: 'Alegría' },
  { key: 'sadness', emoji: '😢', label: 'Tristeza' },
  { key: 'fear', emoji: '😰', label: 'Miedo' },
  { key: 'anxiety', emoji: '😟', label: 'Ansiedad' },
  { key: 'love', emoji: '💝', label: 'Amor' },
  { key: 'anger', emoji: '😠', label: 'Ira' },
  { key: 'hope', emoji: '🌟', label: 'Esperanza' },
  { key: 'calm', emoji: '🧘', label: 'Calma' },
];

const DURATION_OPTIONS = [
  { label: '24 horas', value: '24h' },
  { label: '48 horas', value: '48h' },
  { label: '72 horas', value: '72h' },
];

export default function ComposeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const colors = Colors[theme];
  const { addThought } = useThoughts();

  const [emotion, setEmotion] = useState('joy');
  const [text, setText] = useState('');
  const [duration, setDuration] = useState('24h');
  const [aiReply, setAiReply] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [privateThought, setPrivateThought] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 900;

  const handlePublish = () => {
    if (!text.trim()) return;
    addThought({
      emotion,
      emotionEmoji: EMOTION_OPTIONS.find(e => e.key === emotion)?.emoji || '',
      emotionLabel: EMOTION_OPTIONS.find(e => e.key === emotion)?.label || '',
      text,
      expiresInHours: duration === '24h' ? 24 : duration === '48h' ? 48 : 72,
      reactions: { heart: 0, message: 0, fire: 0, brain: 0 },
      private: privateThought,
    });
    setText('');
    setCharCount(0);
    setPrivateThought(false);
    router.push(privateThought ? '/(tabs)/profile' : '/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={darkMode ? '#0A0A0A' : '#FFFFFF'} />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.contentWrapper}>
          <View style={[styles.container, { maxWidth: MAX_WIDTH }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: darkMode ? '#1F1F1F' : '#F0F0F0' }]}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Nuevo Pensamiento</Text>
              <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
                <Text style={styles.publishBtnText}>Publicar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              {/* Emotion Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>¿Cómo te sientes?</Text>
                <EmotionFilter selected={emotion} onSelect={setEmotion} />
              </View>

              {/* Text Input */}
              <View style={styles.section}>
                <View style={[styles.textareaContainer, { backgroundColor: darkMode ? '#161616' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#ECECEC' }]}>
                  <TextInput
                    style={[styles.textarea, { color: colors.text }]}
                    placeholder="Escribe lo que sientes... Tu identidad permanece completamente anónima."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    maxLength={500}
                    value={text}
                    onChangeText={t => { setText(t); setCharCount(t.length); }}
                  />
                </View>
                <View style={styles.counterRow}>
                  <Text style={[styles.counterText, { color: colors.textMuted }]}>Máximo 500 caracteres</Text>
                  <Text style={[styles.counterText, { color: charCount > 450 ? '#EF4444' : colors.textMuted }]}>{charCount}/500</Text>
                </View>
              </View>

              {/* Privacy Toggle */}
              <TouchableOpacity 
                style={[styles.toggleCard, { backgroundColor: darkMode ? '#161616' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#ECECEC' }]}
                onPress={() => setPrivateThought(!privateThought)}
                activeOpacity={0.7}
              >
                <View style={styles.toggleLeft}>
                  <View style={[styles.toggleIconContainer, { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }]}>
                    <MaterialCommunityIcons name={privateThought ? 'lock' : 'earth'} size={22} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>Pensamiento privado</Text>
                    <Text style={[styles.toggleSubtext, { color: colors.textMuted }]}>Solo tú podrás verlo</Text>
                  </View>
                </View>
                <View style={[styles.switch, { backgroundColor: privateThought ? colors.primary : (darkMode ? '#252525' : '#ECECEC') }]}>
                  <View style={[styles.switchThumb, privateThought && styles.switchThumbActive]} />
                </View>
              </TouchableOpacity>

              {/* Voice Mode Card */}
              <LinearGradient
                colors={darkMode ? ['#1E1B4B', '#312E81'] : ['#F5F3FF', '#EDE9FE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.voiceCard}
              >
                <TouchableOpacity style={styles.voiceBtn}>
                  <View style={[styles.voiceIconContainer, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : '#FFFFFF' }]}>
                    <MaterialCommunityIcons name="microphone" size={24} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.voiceText, { color: darkMode ? '#EDE9FE' : '#6D28D9' }]}>Modo Susurro</Text>
                    <Text style={[styles.voiceSubtext, { color: darkMode ? 'rgba(255,255,255,0.7)' : '#7C3AED' }]}>Habla tus sentimientos</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>

              {/* Duration Card */}
              <View style={[styles.optionCard, { backgroundColor: darkMode ? '#161616' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#ECECEC' }]}>
                <View style={styles.optionHeader}>
                  <View style={styles.optionLeft}>
                    <View style={[styles.optionIconContainer, { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }]}>
                      <MaterialCommunityIcons name="clock-outline" size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.optionLabel, { color: colors.text }]}>Duración</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.dropdown, { backgroundColor: darkMode ? '#1F1F1F' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#ECECEC' }]}
                    onPress={() => setShowDropdown(!showDropdown)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dropdownValue, { color: colors.text }]}>{duration}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                {showDropdown && (
                  <View style={[styles.dropdownList, { backgroundColor: darkMode ? '#1F1F1F' : '#FFFFFF', borderColor: darkMode ? '#252525' : '#ECECEC' }]}>
                    {DURATION_OPTIONS.map(opt => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.dropdownItem, duration === opt.value && { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.2)' : '#F5F3FF' }]}
                        onPress={() => { setDuration(opt.value); setShowDropdown(false); }}
                      >
                        <Text style={[styles.dropdownItemText, { color: colors.text }]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <Text style={[styles.optionSubtext, { color: colors.textMuted }]}>Tu pensamiento desaparecerá automáticamente pasado este tiempo</Text>
              </View>

              {/* AI Reply Toggle */}
              <TouchableOpacity 
                style={[styles.optionCard, { backgroundColor: darkMode ? '#161616' : '#FAFAFA', borderColor: darkMode ? '#252525' : '#ECECEC' }]}
                onPress={() => setAiReply(!aiReply)}
                activeOpacity={0.7}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.optionLeft}>
                    <View style={[styles.optionIconContainer, { backgroundColor: darkMode ? '#1F1F1F' : '#F5F3FF' }]}>
                      <MaterialCommunityIcons name="robot-happy" size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.optionLabel, { color: colors.text }]}>Respuesta de Mentali</Text>
                      <Text style={[styles.optionSubtext, { color: colors.textMuted }]}>Recibe una respuesta empática</Text>
                    </View>
                  </View>
                  <View style={[styles.switch, { backgroundColor: aiReply ? colors.primary : (darkMode ? '#252525' : '#ECECEC') }]}>
                    <View style={[styles.switchThumb, aiReply && styles.switchThumbActive]} />
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  publishBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  textareaContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 4,
  },
  textarea: {
    minHeight: 140,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toggleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  toggleSubtext: {
    fontSize: 13,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginLeft: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  switchThumbActive: {
    marginLeft: 22,
  },
  voiceCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  voiceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  voiceSubtext: {
    fontSize: 13,
  },
  optionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionSubtext: {
    fontSize: 12,
    marginTop: 10,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 6,
  },
  dropdownValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  dropdownList: {
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
