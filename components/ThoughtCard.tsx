import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import { Animated, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/Colors';

dayjs.extend(relativeTime);

const EMOTION_CONFIG: Record<string, { color: string; bg: string }> = {
  joy: { color: '#F59E0B', bg: '#FEF3C7' },
  sadness: { color: '#3B82F6', bg: '#DBEAFE' },
  fear: { color: '#8B5CF6', bg: '#EDE9FE' },
  anger: { color: '#EF4444', bg: '#FEE2E2' },
  love: { color: '#EC4899', bg: '#FCE7F3' },
  anxiety: { color: '#F97316', bg: '#FFEDD5' },
  hope: { color: '#10B981', bg: '#D1FAE5' },
  calm: { color: '#6366F1', bg: '#E0E7FF' },
  default: { color: '#8B5CF6', bg: '#EDE9FE' },
};

interface ThoughtCardProps {
  emotion?: string;
  emotionEmoji?: string;
  emotionLabel?: string;
  text: string;
  createdAt: string;
  expiresInHours: number;
  reactions?: { heart?: number; message?: number; fire?: number; brain?: number };
  aiResponse?: string;
}

type Comment = { id: number; text: string; createdAt: string; likes: number; liked: boolean };

function timeAgo(date: string) {
  return dayjs(date).fromNow();
}

function timeUntilExpiry(date: string, hours: number) {
  const expiry = dayjs(date).add(hours, 'hour');
  const now = dayjs();
  if (expiry.isBefore(now)) return 'Expirado';
  const diff = expiry.diff(now, 'hour');
  if (diff < 1) return 'Expira pronto';
  return `${diff}h restantes`;
}

export default function ThoughtCard({
  emotion = 'joy',
  emotionEmoji = '😊',
  emotionLabel = 'Alegría',
  text,
  createdAt,
  expiresInHours,
  reactions = {},
  aiResponse,
}: ThoughtCardProps) {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const colors = Colors[theme];
  const emotionStyle = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.default;

  const [localReactions, setLocalReactions] = useState({
    heart: reactions.heart || 0,
    message: reactions.message || 0,
    fire: reactions.fire || 0,
    brain: reactions.brain || 0,
  });
  const [reacted, setReacted] = useState({ heart: false, message: false, fire: false, brain: false });
  const [scales, setScales] = useState({
    heart: new Animated.Value(1),
    message: new Animated.Value(1),
    fire: new Animated.Value(1),
    brain: new Animated.Value(1),
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleReact = (type: keyof typeof localReactions) => {
    setLocalReactions(prev => ({
      ...prev,
      [type]: reacted[type] ? Math.max(prev[type] - 1, 0) : prev[type] + 1,
    }));
    setReacted(prev => ({ ...prev, [type]: !prev[type] }));
    Animated.sequence([
      Animated.timing(scales[type], { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scales[type], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const REACTIONS = [
    { key: 'heart', emoji: '❤️', label: 'Me gusta' },
    { key: 'message', emoji: '💬', label: 'Comentar' },
    { key: 'fire', emoji: '🔥', label: 'Ánimo' },
    { key: 'brain', emoji: '🧠', label: 'Insight' },
  ] as const;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <View style={[styles.avatar, { backgroundColor: darkMode ? '#2D2D2D' : '#F3F4F6' }]}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View>
            <Text style={[styles.authorName, { color: colors.text }]}>Anónimo</Text>
            <Text style={[styles.timeAgo, { color: colors.textMuted }]}>{timeAgo(createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.expiryBadge, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : emotionStyle.bg }]}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={emotionStyle.color} />
          <Text style={[styles.expiryText, { color: emotionStyle.color }]}>{timeUntilExpiry(createdAt, expiresInHours)}</Text>
        </View>
      </View>

      {/* Emotion Tag */}
      <View style={[styles.emotionTag, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.15)' : emotionStyle.bg }]}>
        <Text style={styles.emotionTagEmoji}>{emotionEmoji}</Text>
        <Text style={[styles.emotionTagText, { color: emotionStyle.color }]}>{emotionLabel}</Text>
      </View>

      {/* Content */}
      <Text style={[styles.content, { color: colors.text }]}>{text}</Text>

      {/* Reactions */}
      <View style={styles.reactionsContainer}>
        {REACTIONS.map(({ key, emoji }) => (
          <Animated.View key={key} style={{ transform: [{ scale: scales[key] }] }}>
            <TouchableOpacity
              style={[
                styles.reactionButton,
                { backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB' },
                reacted[key] && { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.2)' : '#EDE9FE' },
              ]}
              onPress={() => key === 'message' ? setShowComments(true) : handleReact(key)}
              activeOpacity={0.7}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
              <Text style={[styles.reactionCount, { color: colors.textSecondary }]}>
                {key === 'message' ? comments.length : localReactions[key]}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* AI Response */}
      {aiResponse && (
        <View style={[styles.aiResponse, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.1)' : '#F5F3FF', borderColor: darkMode ? 'rgba(139, 92, 246, 0.2)' : '#E9D5FF' }]}>
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons name="robot-outline" size={18} color={colors.primary} />
            <Text style={[styles.aiLabel, { color: colors.primary }]}>Insight de Mentali</Text>
          </View>
          <Text style={[styles.aiText, { color: colors.text }]}>{aiResponse}</Text>
        </View>
      )}

      {/* Comments Modal */}
      <Modal visible={showComments} animationType="slide" transparent onRequestClose={() => setShowComments(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Comentarios</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={comments}
              keyExtractor={item => item.id.toString()}
              style={{ flex: 1 }}
              ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textMuted }]}>Sé el primero en comentar 💬</Text>}
              renderItem={({ item }) => (
                <View style={[styles.commentItem, { borderBottomColor: colors.cardBorder }]}>
                  <View style={[styles.commentAvatar, { backgroundColor: darkMode ? '#2D2D2D' : '#F3F4F6' }]}>
                    <Text>👤</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.commentAuthor, { color: colors.primary }]}>Anónimo</Text>
                    <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
                    <Text style={[styles.commentTime, { color: colors.textMuted }]}>{timeAgo(item.createdAt)}</Text>
                  </View>
                </View>
              )}
            />
            
            <View style={[styles.commentInputContainer, { borderTopColor: colors.cardBorder }]}>
              <TextInput
                style={[styles.commentInput, { backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB', color: colors.text }]}
                placeholder="Escribe un comentario..."
                placeholderTextColor={colors.textMuted}
                value={commentText}
                onChangeText={setCommentText}
                maxLength={240}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  if (commentText.trim()) {
                    setComments(prev => [{ id: Date.now(), text: commentText, createdAt: new Date().toISOString(), likes: 0, liked: false }, ...prev]);
                    setCommentText('');
                  }
                }}
              >
                <MaterialCommunityIcons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 13,
    marginTop: 2,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emotionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 14,
  },
  emotionTagEmoji: {
    fontSize: 16,
  },
  emotionTagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 16,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  reactionEmoji: {
    fontSize: 18,
  },
  reactionCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  aiResponse: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  aiText: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
