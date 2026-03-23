import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform, Dimensions } from 'react-native';
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
  
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 768;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
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
      
      <View style={styles.container}>
        <NavigationBar
          onMapPress={() => router.push('../../emotional-map')}
          onProfilePress={() => router.push('/(tabs)/profile')}
        />

        <EmotionFilter selected={selectedEmotion} onSelect={setSelectedEmotion} />

        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id}
          contentContainerStyle={{ 
            paddingTop: 8, 
            paddingBottom: isLargeScreen ? 40 : 120,
            paddingHorizontal: isLargeScreen ? 24 : 0 
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconContainer, { backgroundColor: darkMode ? '#161616' : '#F5F3FF' }]}>
                <MaterialCommunityIcons 
                  name="thought-bubble-outline" 
                  size={48} 
                  color={colors.primary} 
                />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Sin pensamientos aún
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                ¡Sé el primero en compartir cómo te sientes!
              </Text>
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

        {/* FAB with pencil icon */}
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
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabGradient}
            >
              <MaterialCommunityIcons name="pencil" size={26} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
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
    borderRadius: 24,
    overflow: 'hidden',
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
