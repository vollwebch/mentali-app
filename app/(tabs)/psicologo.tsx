import React, { useCallback, useState } from 'react';
import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Platform, View, StyleSheet, Text, SafeAreaView, StatusBar, KeyboardAvoidingView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = '/api/chat';

export default function PsicologoChat() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const darkMode = theme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 768;

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

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: darkMode ? '#1F1F1F' : '#F3F4F6',
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
        left: { color: darkMode ? '#F5F5F5' : '#1F2937', fontSize: 15 },
        right: { color: '#FFFFFF', fontSize: 15 },
      }}
      timeTextStyle={{
        left: { color: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 10 },
        right: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props} containerStyle={{ justifyContent: 'center', marginRight: 8, marginBottom: 4 }}>
      <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.sendButton}>
        <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
      </LinearGradient>
    </Send>
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF',
        borderTopWidth: 0,
        padding: 8,
      }}
      primaryStyle={{
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: darkMode ? '#161616' : '#F3F4F6',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: darkMode ? '#252525' : '#E5E7EB',
      }}
    />
  );

  const quickReplies = [
    { emoji: '😔', text: 'Me siento triste' },
    { emoji: '😰', text: 'Tengo ansiedad' },
    { emoji: '💪', text: 'Necesito motivación' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={darkMode ? '#0A0A0A' : '#FFFFFF'} />
      
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: darkMode ? '#1A1A1A' : '#F3F4F6' }]}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.avatarContainer}>
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
          <View style={[styles.badge, { backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5' }]}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#10B981" />
            <Text style={[styles.badgeText, { color: '#10B981' }]}>Seguro</Text>
          </View>
        </View>

        {/* Chat */}
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
            paddingBottom: isLargeScreen ? 20 : 60
          }}
          listViewProps={{
            style: { backgroundColor: darkMode ? '#0A0A0A' : '#FFFFFF' },
            contentContainerStyle: { paddingHorizontal: 8 },
          }}
          textInputStyle={{
            color: darkMode ? '#F5F5F5' : '#1F2937',
            backgroundColor: 'transparent',
            borderRadius: 18,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 15,
          }}
          renderAvatar={null}
          minInputToolbarHeight={52}
        />

        {/* Quick Replies */}
        <View style={[styles.quickReplies, { borderTopColor: darkMode ? '#1A1A1A' : '#F3F4F6' }]}>
          {quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickReplyBtn, { backgroundColor: darkMode ? '#161616' : '#F3F4F6', borderColor: darkMode ? '#252525' : '#E5E7EB' }]}
              onPress={() => {
                onSend([{
                  _id: Date.now(),
                  text: reply.text,
                  createdAt: new Date(),
                  user: { _id: 1 },
                }]);
              }}
            >
              <Text style={styles.quickReplyEmoji}>{reply.emoji}</Text>
              <Text style={[styles.quickReplyText, { color: darkMode ? '#D1D5DB' : '#4B5563' }]}>{reply.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {Platform.OS === 'web' && <KeyboardAvoidingView behavior="padding" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1, maxWidth: 720, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarContainer: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 22 },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  headerSubtitle: { fontSize: 11, fontWeight: '600', color: '#10B981' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  sendButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickReplies: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderTopWidth: 1, marginBottom: 60 },
  quickReplyBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1, gap: 5 },
  quickReplyEmoji: { fontSize: 13 },
  quickReplyText: { fontSize: 11, fontWeight: '500' },
});
