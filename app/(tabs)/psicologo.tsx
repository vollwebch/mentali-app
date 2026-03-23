import React, { useCallback, useState } from 'react';
import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Platform, View, StyleSheet, Text, SafeAreaView, StatusBar, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// URL de la API según la plataforma
const getApiUrl = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      if (host.includes('vercel.app') || host.includes('localhost')) {
        return '/api/chat';
      }
    }
    return '/api/chat';
  }
  return 'https://mentali-app.vercel.app/api/chat';
};

const API_URL = getApiUrl();
const CONTENT_MAX_WIDTH = 600;
const SIDEBAR_WIDTH = 280;

export default function PsicologoChat() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 1200;
  const router = useRouter();

  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: 1,
      text: '¡Hola! 🌱 Soy Mentali, tu psicólogo virtual. Estoy aquí para escucharte y apoyarte sin juicios. ¿En qué te gustaría hablar hoy?',
      createdAt: new Date(),
      user: { _id: 2, name: 'Mentali', avatar: '🧠' },
    },
  ]);
  const [loading, setLoading] = useState(false);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    setLoading(true);
    try {
      const userMessages = [...GiftedChat.append([], newMessages), ...messages]
        .reverse()
        .map(m => ({
          role: m.user._id === 1 ? 'user' : 'assistant',
          content: m.text,
        }));

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: userMessages }),
      });
      const data = await res.json();

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [
          {
            _id: Date.now(),
            text: data.response || 'Lo siento, no pude procesar tu mensaje.',
            createdAt: new Date(),
            user: { _id: 2, name: 'Mentali', avatar: '🧠' },
          },
        ])
      );
    } catch (e) {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [
          {
            _id: Date.now(),
            text: 'Lo siento, hubo un error al conectar. Por favor, intenta de nuevo. 🙏',
            createdAt: new Date(),
            user: { _id: 2, name: 'Mentali', avatar: '🧠' },
          },
        ])
      );
    }
    setLoading(false);
  }, [messages]);

  // Custom bubble styles for dark mode
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: darkMode ? '#1F1F1F' : '#F3F4F6',
            borderRadius: 20,
            padding: 4,
            marginLeft: -4,
            marginBottom: 4,
          },
          right: {
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 4,
            marginBottom: 4,
          },
        }}
        textStyle={{
          left: {
            color: darkMode ? '#F5F5F5' : '#1F2937',
            fontSize: 15,
            lineHeight: 22,
          },
          right: {
            color: '#FFFFFF',
            fontSize: 15,
            lineHeight: 22,
          },
        }}
        timeTextStyle={{
          left: {
            color: darkMode ? '#6B7280' : '#9CA3AF',
            fontSize: 10,
          },
          right: {
            color: 'rgba(255,255,255,0.7)',
            fontSize: 10,
          },
        }}
      />
    );
  };

  // Custom send button
  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        containerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          marginBottom: 4,
        }}
      >
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.sendButton}
        >
          <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
        </LinearGradient>
      </Send>
    );
  };

  // Custom input toolbar for dark mode
  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF',
          borderTopWidth: 0,
          padding: 8,
          paddingBottom: Platform.OS === 'ios' ? 12 : 8,
        }}
        primaryStyle={{
          alignItems: 'center',
          borderRadius: 24,
          backgroundColor: darkMode ? '#161616' : '#F3F4F6',
          marginLeft: 8,
          borderWidth: 1,
          borderColor: darkMode ? '#252525' : '#E5E7EB',
        }}
      />
    );
  };

  // Quick suggestions
  const quickSuggestions = [
    { emoji: '😔', text: 'Me siento triste' },
    { emoji: '😰', text: 'Tengo ansiedad' },
    { emoji: '💪', text: 'Necesito motivación' },
    { emoji: '🤔', text: 'Quiero reflexionar' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }]}>
      <StatusBar 
        barStyle={darkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={darkMode ? '#0A0A0A' : '#FFFFFF'} 
      />
      
      <View style={styles.mainContainer}>
        {/* Left Sidebar - Desktop Only */}
        {isLargeScreen && (
          <View style={[styles.sidebar, { 
            backgroundColor: darkMode ? '#0F0F0F' : '#FAFAFA',
            borderRightColor: darkMode ? '#1A1A1A' : '#EBEBEB'
          }]}>
            {/* Logo */}
            <TouchableOpacity style={styles.logoContainer} onPress={() => router.push('/')}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <MaterialCommunityIcons name="brain" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.logoText, { color: colors.text }]}>Mentali</Text>
            </TouchableOpacity>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Conversaciones</Text>
              
              <TouchableOpacity style={[styles.conversationItem, { 
                backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.12)' : '#F0EBFF'
              }]}>
                <View style={[styles.conversationIcon, { backgroundColor: colors.primary }]}>
                  <MaterialCommunityIcons name="robot-happy" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.conversationInfo}>
                  <Text style={[styles.conversationName, { color: colors.text }]}>Mentali</Text>
                  <Text style={[styles.conversationPreview, { color: colors.primary }]}>Chat activo</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Suggestions */}
            <View style={styles.suggestionsSection}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Temas para hablar</Text>
              {quickSuggestions.map((suggestion, index) => (
                <TouchableOpacity key={index} style={[styles.suggestionItem, { 
                  backgroundColor: darkMode ? '#161616' : '#FFFFFF',
                  borderColor: darkMode ? '#252525' : '#EBEBEB'
                }]}>
                  <Text style={styles.suggestionEmoji}>{suggestion.emoji}</Text>
                  <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Chat Container */}
        <View style={styles.chatWrapper}>
          <View style={[styles.chatContainer, { maxWidth: isLargeScreen ? CONTENT_MAX_WIDTH : '100%' }]}>
            {/* Header */}
            <View style={[
              styles.header, 
              { 
                backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF',
                borderBottomColor: darkMode ? '#1A1A1A' : '#F3F4F6'
              }
            ]}>
              <View style={styles.headerLeft}>
                <LinearGradient
                  colors={['#8B5CF6', '#A855F7']}
                  style={styles.avatarContainer}
                >
                  <Text style={styles.avatarEmoji}>🧠</Text>
                </LinearGradient>
                <View>
                  <Text style={[styles.headerTitle, { color: colors.text }]}>Mentali</Text>
                  <View style={styles.statusRow}>
                    <View style={styles.statusDot} />
                    <Text style={styles.headerSubtitle}>En línea</Text>
                  </View>
                </View>
              </View>
              <View style={styles.headerRight}>
                <View style={[styles.badge, { backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5' }]}>
                  <MaterialCommunityIcons name="shield-check" size={14} color="#10B981" />
                  <Text style={[styles.badgeText, { color: '#10B981' }]}>Seguro</Text>
                </View>
              </View>
            </View>

            {/* GiftedChat */}
            <GiftedChat
              messages={messages}
              onSend={(msgs: IMessage[]) => onSend(msgs)}
              user={{ _id: 1 }}
              isTyping={loading}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
              renderUsernameOnMessage={false}
              renderBubble={renderBubble}
              renderInputToolbar={renderInputToolbar}
              renderSend={renderSend}
              messagesContainerStyle={{ 
                backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF',
                paddingBottom: 8,
              }}
              listViewProps={{
                style: { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' },
                contentContainerStyle: { paddingHorizontal: 8 },
              }}
              textInputStyle={{
                color: darkMode ? '#F5F5F5' : '#1F2937',
                backgroundColor: 'transparent',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 15,
                marginRight: 4,
              }}
              renderAvatar={null}
              minInputToolbarHeight={56}
            />

            {/* Quick Replies - Mobile */}
            {!isLargeScreen && (
              <View style={[styles.quickReplies, { 
                backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF',
                borderTopColor: darkMode ? '#1A1A1A' : '#F3F4F6'
              }]}>
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.quickReplyBtn, { 
                      backgroundColor: darkMode ? '#161616' : '#F3F4F6',
                      borderColor: darkMode ? '#252525' : '#E5E7EB'
                    }]}
                    onPress={() => {
                      onSend([{
                        _id: Date.now(),
                        text: suggestion.text,
                        createdAt: new Date(),
                        user: { _id: 1 },
                      }]);
                    }}
                  >
                    <Text style={styles.quickReplyEmoji}>{suggestion.emoji}</Text>
                    <Text style={[styles.quickReplyText, { color: darkMode ? '#D1D5DB' : '#4B5563' }]}>{suggestion.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Keyboard spacer for web */}
      {Platform.OS === 'web' && <KeyboardAvoidingView behavior="padding" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 12,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  conversationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 15,
    fontWeight: '700',
  },
  conversationPreview: {
    fontSize: 12,
    marginTop: 2,
  },
  suggestionsSection: {
    gap: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  suggestionEmoji: {
    fontSize: 18,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chatWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  quickReplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  quickReplyEmoji: {
    fontSize: 14,
  },
  quickReplyText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
