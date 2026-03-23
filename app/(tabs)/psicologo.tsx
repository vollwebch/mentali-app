import React, { useCallback, useState } from 'react';
import { GiftedChat, IMessage, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { Platform, View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { Colors } from '../../constants/Colors';

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

export default function PsicologoChat() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';

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
            backgroundColor: darkMode ? '#2D2D2D' : '#F3F4F6',
            borderRadius: 18,
            padding: 4,
          },
          right: {
            backgroundColor: colors.primary,
            borderRadius: 18,
            padding: 4,
          },
        }}
        textStyle={{
          left: {
            color: darkMode ? '#F9FAFB' : '#1F2937',
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
          },
          right: {
            color: 'rgba(255,255,255,0.7)',
          },
        }}
      />
    );
  };

  // Custom input toolbar for dark mode
  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: darkMode ? '#1A1A1A' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: darkMode ? '#2D2D2D' : '#E5E7EB',
          padding: 8,
        }}
        primaryStyle={{
          alignItems: 'center',
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.cardBorder 
      }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatarContainer, { backgroundColor: darkMode ? '#2D2D2D' : '#F5F3FF' }]}>
            <Text style={styles.avatarEmoji}>🧠</Text>
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Mentali</Text>
            <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Psicólogo Virtual</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5' }]}>
          <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.statusText, { color: '#10B981' }]}>En línea</Text>
        </View>
      </View>

      {/* Chat */}
      <GiftedChat
        messages={messages}
        onSend={(msgs: IMessage[]) => onSend(msgs)}
        user={{ _id: 1 }}
        isTyping={loading}
        placeholder="Escribe tu mensaje..."
        placeholderTextColor={colors.textMuted}
        renderUsernameOnMessage={false}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        messagesContainerStyle={{ 
          backgroundColor: colors.background,
          paddingBottom: 8,
        }}
        listViewProps={{
          style: { backgroundColor: colors.background },
        }}
        textInputStyle={{
          color: colors.text,
          backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB',
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 15,
          marginRight: 8,
        }}
        renderAvatar={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
