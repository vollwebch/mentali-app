import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import EmotionFilter from '../components/EmotionFilter';
import { ThemedText } from '../components/ThemedText';
import { useThoughts } from '../components/ThoughtsContext';
import { useTheme } from '../ThemeContext';

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
  { label: '24h', value: '24h' },
  { label: '48h', value: '48h' },
  { label: '72h', value: '72h' },
];

export default function ComposeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const { addThought } = useThoughts();

  const [emotion, setEmotion] = useState('joy');
  const [text, setText] = useState('');
  const [duration, setDuration] = useState('24h');
  const [aiReply, setAiReply] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [privateThought, setPrivateThought] = useState(false);

  // Dropdown simple (puedes reemplazar por un select nativo si tienes uno)
  const [showDropdown, setShowDropdown] = useState(false);

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#F6F6FB' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { backgroundColor: darkMode ? 'rgba(31,41,55,0.5)' : 'rgba(243,244,246,0.7)' }] }>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#C084FC" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} type="defaultSemiBold">Comparte tu pensamiento</ThemedText>
        <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
          <ThemedText style={styles.publishBtnText}>Publicar</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <ThemedText style={styles.label}>¿Cómo te sientes?</ThemedText>
          <EmotionFilter selected={emotion} onSelect={setEmotion} />
        </View>
        <View style={styles.section}>
          <TextInput
            style={[
              styles.textarea,
              { color: darkMode ? '#F3F4F6' : '#312E81', borderColor: darkMode ? '#374151' : '#E0E7FF', backgroundColor: darkMode ? 'rgba(31,41,55,0.5)' : '#ECE9F6' },
            ]}
            placeholder="Escribe lo que sientes... Tu identidad permanece completamente anónima."
            placeholderTextColor={darkMode ? '#9CA3AF' : '#6D28D9'}
            multiline
            maxLength={500}
            value={text}
            onChangeText={t => { setText(t); setCharCount(t.length); }}
          />
          <View style={styles.counterRow}>
            <Text style={styles.counterText}>Límite: 500 caracteres</Text>
            <Text style={styles.counterText}>{charCount}/500</Text>
          </View>
          <View style={styles.privacyRow}>
            <Text style={styles.privacyLabel}>Pensamiento privado (solo para mí)</Text>
            <TouchableOpacity
              style={[styles.switch, privateThought ? styles.switchActive : styles.switchInactive]}
              onPress={() => setPrivateThought(!privateThought)}
              activeOpacity={0.8}
            >
              <View style={[styles.switchThumb, privateThought ? styles.switchThumbActive : styles.switchThumbInactive]} />
            </TouchableOpacity>
          </View>
        </View>
        <LinearGradient
          colors={["#9333ea33", "#db277733"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.susurroCard}
        >
          <TouchableOpacity style={styles.susurroBtn}>
            <MaterialCommunityIcons name="microphone" size={22} color="#C084FC" style={{ marginRight: 8 }} />
            <Text style={styles.susurroText}>Modo Susurro - Habla tus sentimientos</Text>
          </TouchableOpacity>
          <Text style={styles.susurroSub}>Tu voz se transcribe automáticamente y se elimina al instante</Text>
        </LinearGradient>
        <View style={styles.section}>
          <View style={styles.cardRow}>
            <View style={styles.durationCard}>
              <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Duración del pensamiento</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDropdown(!showDropdown)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownValue}>{duration}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              {showDropdown && (
                <View style={styles.dropdownList}>
                  {DURATION_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.value}
                      style={styles.dropdownItem}
                      onPress={() => { setDuration(opt.value); setShowDropdown(false); }}
                    >
                      <Text style={styles.dropdownItemText}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <Text style={styles.durationSub}>Tu pensamiento será visible durante este tiempo y luego desaparecerá automáticamente</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.iaCard}>
              <View style={styles.iaRow}>
                <View>
                  <Text style={styles.iaLabel}>Solicitar respuesta de IA</Text>
                  <Text style={styles.iaSub}>Recibe una respuesta empática y comprensiva</Text>
                </View>
                <TouchableOpacity
                  style={[styles.switch, aiReply ? styles.switchActive : styles.switchInactive]}
                  onPress={() => setAiReply(!aiReply)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.switchThumb, aiReply ? styles.switchThumbActive : styles.switchThumbInactive]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55,65,81,0.5)',
  },
  headerBtn: {
    padding: 8,
    borderRadius: 999,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  publishBtn: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
  },
  publishBtnText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  textarea: {
    minHeight: 120,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    marginBottom: 6,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  counterText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  susurroCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
    shadowColor: '#A855F7',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  susurroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 8,
  },
  susurroText: {
    color: '#D8B4FE',
    fontWeight: '500',
    fontSize: 15,
  },
  susurroSub: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  cardRow: {
    marginBottom: 18,
  },
  durationCard: {
    borderRadius: 14,
    backgroundColor: 'rgba(31,41,55,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(55,65,81,0.5)',
    padding: 14,
    marginBottom: 8,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  durationLabel: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dropdownValue: {
    color: '#F3F4F6',
    fontSize: 15,
    marginRight: 4,
  },
  dropdownList: {
    backgroundColor: '#23263a',
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    color: '#F3F4F6',
    fontSize: 15,
  },
  durationSub: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 6,
  },
  iaCard: {
    borderRadius: 14,
    backgroundColor: 'rgba(31,41,55,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(55,65,81,0.5)',
    padding: 14,
  },
  iaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iaLabel: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
  },
  iaSub: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#374151',
    justifyContent: 'center',
    padding: 2,
    marginLeft: 12,
  },
  switchActive: {
    backgroundColor: '#9333ea',
  },
  switchInactive: {
    backgroundColor: '#374151',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 2,
    left: 2,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    transitionProperty: 'left',
    transitionDuration: '150ms',
  },
  switchThumbActive: {
    left: 22,
    backgroundColor: '#fff',
  },
  switchThumbInactive: {
    left: 2,
    backgroundColor: '#fff',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  privacyLabel: {
    color: '#A78BFA',
    fontSize: 15,
    fontWeight: '500',
  },
}); 