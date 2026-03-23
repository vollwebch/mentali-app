import React, { useCallback, useState } from 'react';
import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Platform, View, StyleSheet, Text, SafeAreaView, StatusBar, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
const MAX_WIDTH = 480;

export default function PsicologoChat() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 900;

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
            backgroundColor: darkMode ? '#252525' : '#F0F0F0',
            borderRadius: 20,
            padding: 4,
            marginLeft: -4,
          },
          right: {
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 4,
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
            color: 'rgba(255,255,255,0.6)',
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
        <View style={[styles.sendButton, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
        </View>
      </Send>
    );
  };

  // Custom input toolbar for dark mode
  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: darkMode ? '#161616' : '#FFFFFF',
          borderTopWidth: 0,
          padding: 8,
          paddingBottom: Platform.OS === 'ios' ? 12 : 8,
        }}
        primaryStyle={{
          alignItems: 'center',
          borderRadius: 24,
          backgroundColor: darkMode ? '#1F1F1F' : '#F5F5F5',
          marginLeft: 8,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }]}>
      <StatusBar 
        barStyle={darkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={darkMode ? '#0A0A0A' : '#FFFFFF'} 
      />
      
      {/* Header */}
      <View style={[
        styles.header, 
        { 
          backgroundColor: darkMode ? '#161616' : '#FFFFFF',
          borderBottomColor: darkMode ? '#252525' : '#F0F0F0'
        }
      ]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatarContainer, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
            <Text style={styles.avatarEmoji}>🧠</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Mentali</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.headerSubtitle, { color: '#10B981' }]}>En línea</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.badge, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF' }]}>
            <MaterialCommunityIcons name="shield-check" size={16} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>Seguro</Text>
          </View>
        </View>
      </View>

      {/* Chat Container */}
      <View style={styles.chatWrapper}>
        <View style={[styles.chatContainer, { maxWidth: isLargeScreen ? MAX_WIDTH : '100%' }]}>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
