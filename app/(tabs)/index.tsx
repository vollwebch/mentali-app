import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, FlatList, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../ThemeContext';
import EmotionFilter from '../../components/EmotionFilter';
import NavigationBar from '../../components/NavigationBar';
import ThoughtCard from '../../components/ThoughtCard';
import { useThoughts } from '../../components/ThoughtsContext';
import { Colors } from '../../constants/Colors';

const MAX_WIDTH = 700; // Ahora el feed es más ancho en desktop/web
const CARD_MARGIN = 12;

export default function HomeScreen() {
  const { theme } = useTheme();
    const colors = Colors[theme];
  const { thoughts } = useThoughts();
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [pulse] = useState(new Animated.Value(1));
  const router = useRouter();

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Filtrado de posts por emoción
  const filteredPosts = selectedEmotion === 'all'
    ? thoughts
    : thoughts.filter(p => p.emotion === selectedEmotion);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.background }}>
        <View style={{ flex: 1, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', backgroundColor: colors.background }}>
          {/* Cabecera sticky */}
          <View style={{ position: 'sticky', top: 0, zIndex: 20, backgroundColor: colors.background }}>
            <NavigationBar
              onMapPress={() => router.push('../../emotional-map')}
              onProfilePress={() => router.push('/(tabs)/profile')}
            />
            <EmotionFilter selected={selectedEmotion} onSelect={setSelectedEmotion} />
          </View>
          <FlatList
            data={filteredPosts}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 0, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ paddingHorizontal: CARD_MARGIN, width: '100%', alignItems: 'center' }}>
                <View style={{ width: '100%', maxWidth: MAX_WIDTH - CARD_MARGIN * 2, minWidth: 0 }}>
                  <ThoughtCard
                    emotion={item.emotion}
                    emotionEmoji={item.emotionEmoji}
                    emotionLabel={item.emotionLabel}
                    text={item.text}
                    createdAt={item.createdAt}
                    expiresInHours={item.expiresInHours}
                    reactions={item.reactions}
                    aiResponse={item.aiResponse}
                    big // Prop extra para fuentes/paddings grandes
                  />
                </View>
              </View>
            )}
          />
          <Animated.View style={[styles.fabContainer, { transform: [{ scale: pulse }], right: 32, bottom: 36 }]}> 
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.fabTouchable}
              onPress={() => router.push('/compose')}
            >
              <LinearGradient
                colors={colors.fabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fabGradient}
              >
                <MaterialCommunityIcons name="pencil" size={36} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  fabTouchable: {
    borderRadius: 34,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabTouchableNoBg: {
    borderRadius: 999,
    padding: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
}); 