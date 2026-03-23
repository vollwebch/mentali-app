import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { useTheme } from '../../ThemeContext';
import EmotionFilter from '../../components/EmotionFilter';
import NavigationBar from '../../components/NavigationBar';
import ThoughtCard from '../../components/ThoughtCard';
import { useThoughts } from '../../components/ThoughtsContext';
import { Colors } from '../../constants/Colors';

const MAX_WIDTH = 720;

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
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

  const filteredPosts = selectedEmotion === 'all'
    ? thoughts
    : thoughts.filter(p => p.emotion === selectedEmotion);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar 
        barStyle={darkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' }}>
          
          {/* Header */}
          <NavigationBar
            onMapPress={() => router.push('../../emotional-map')}
            onProfilePress={() => router.push('/(tabs)/profile')}
          />

          {/* Stories / Filter Section */}
          <EmotionFilter selected={selectedEmotion} onSelect={setSelectedEmotion} />

          {/* Feed */}
          <FlatList
            data={filteredPosts}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons 
                  name="thought-bubble-outline" 
                  size={48} 
                  color={colors.textMuted} 
                />
                <View style={styles.emptyContent}>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    Sin pensamientos aún
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                    ¡Sé el primero en compartir!
                  </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <ThoughtCard
                emotion={item.emotion}
                emotionEmoji={item.emotionEmoji}
                emotionLabel={item.emotionLabel}
                text={item.text}
                createdAt={item.createdAt}
                expiresInHours={item.expiresInHours}
                reactions={item.reactions}
                aiResponse={item.aiResponse}
              />
            )}
          />

          {/* FAB */}
          <Animated.View 
            style={[
              styles.fabContainer, 
              { transform: [{ scale: pulse }] }
            ]}
          >
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
                <MaterialCommunityIcons name="plus" size={32} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 90,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  fabTouchable: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
