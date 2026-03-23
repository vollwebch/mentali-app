import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import { Animated, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/Colors';

dayjs.extend(relativeTime);

const EMOTION_CONFIG: Record<string, { color: string; bgColor: string; gradientColors: string[] }> = {
  joy: { color: '#F59E0B', bgColor: '#FFFBEB', gradientColors: ['#FCD34D', '#F59E0B'] },
  sadness: { color: '#3B82F6', bgColor: '#EFF6FF', gradientColors: ['#60A5FA', '#3B82F6'] },
  fear: { color: '#8B5CF6', bgColor: '#F5F3FF', gradientColors: ['#A78BFA', '#8B5CF6'] },
  anger: { color: '#EF4444', bgColor: '#FEF2F2', gradientColors: ['#F87171', '#EF4444'] },
  love: { color: '#EC4899', bgColor: '#FDF2F8', gradientColors: ['#F472B6', '#EC4899'] },
  anxiety: { color: '#F97316', bgColor: '#FFF7ED', gradientColors: ['#FB923C', '#F97316'] },
  hope: { color: '#10B981', bgColor: '#ECFDF5', gradientColors: ['#34D399', '#10B981'] },
  calm: { color: '#6366F1', bgColor: '#EEF2FF', gradientColors: ['#818CF8', '#6366F1'] },
  gratitude: { color: '#14B8A6', bgColor: '#F0FDFA', gradientColors: ['#2DD4BF', '#14B8A6'] },
  surprise: { color: '#8B5CF6', bgColor: '#F5F3FF', gradientColors: ['#A78BFA', '#8B5CF6'] },
  loneliness: { color: '#6B7280', bgColor: '#F9FAFB', gradientColors: ['#9CA3AF', '#6B7280'] },
  stress: { color: '#F59E0B', bgColor: '#FFFBEB', gradientColors: ['#FCD34D', '#F59E0B'] },
  motivation: { color: '#10B981', bgColor: '#ECFDF5', gradientColors: ['#34D399', '#10B981'] },
  default: { color: '#8B5CF6', bgColor: '#F5F3FF', gradientColors: ['#A78BFA', '#8B5CF6'] },
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
  return `${diff}h`;
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
      Animated.timing(scales[type], { toValue: 1.4, duration: 100, useNativeDriver: true }),
      Animated.timing(scales[type], { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const REACTIONS = [
    { key: 'heart', emoji: '❤️', activeEmoji: '❤️', label: 'Me gusta' },
    { key: 'message', emoji: '💬', activeEmoji: '💬', label: 'Comentar' },
    { key: 'fire', emoji: '🔥', activeEmoji: '🔥', label: 'Apoyar' },
    { key: 'brain', emoji: '🧠', activeEmoji: '🧠', label: 'Entiendo' },
  ] as const;

  const bgCard = darkMode ? '#161616' : '#FFFFFF';
  const borderColor = darkMode ? '#252525' : '#F0F0F0';

  return (
    <View style={[styles.card, { backgroundColor: bgCard, borderColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <View style={[styles.avatar, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View style={styles.authorMeta}>
            <Text style={[styles.authorName, { color: colors.text }]}>Anónimo</Text>
            <View style={styles.metaRow}>
              <Text style={[styles.timeAgo, { color: colors.textMuted }]}>{timeAgo(createdAt)}</Text>
              <Text style={[styles.dot, { color: colors.textMuted }]}>·</Text>
              <View style={[styles.expiryBadge, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.12)' : emotionStyle.bgColor }]}>
                <MaterialCommunityIcons name="clock-outline" size={10} color={emotionStyle.color} />
                <Text style={[styles.expiryText, { color: emotionStyle.color }]}>
                  {timeUntilExpiry(createdAt, expiresInHours)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={[styles.content, { color: colors.text }]}>{text}</Text>

      {/* Emotion Tag */}
      <View style={styles.emotionRow}>
        <View style={[
          styles.emotionTag, 
          { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.12)' : emotionStyle.bgColor }
        ]}>
          <Text style={styles.emotionTagEmoji}>{emotionEmoji}</Text>
          <Text style={[styles.emotionTagText, { color: emotionStyle.color }]}>{emotionLabel}</Text>
        </View>
      </View>

      {/* Reactions */}
      <View style={[styles.reactionsContainer, { borderTopColor: borderColor }]}>
        {REACTIONS.map(({ key, emoji }) => (
          <Animated.View key={key} style={{ transform: [{ scale: scales[key] }] }}>
            <TouchableOpacity
              style={[
                styles.reactionButton,
                { backgroundColor: darkMode ? '#1F1F1F' : '#FAFAFA' },
                reacted[key] && { 
                  backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.2)' : '#EDE9FE',
                },
              ]}
              onPress={() => key === 'message' ? setShowComments(true) : handleReact(key)}
              activeOpacity={0.7}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
              <Text style={[styles.reactionCount, { color: reacted[key] ? colors.primary : colors.textSecondary }]}>
                {key === 'message' ? comments.length : localReactions[key]}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* AI Response */}
      {aiResponse && (
        <View style={[styles.aiResponse, { backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.08)' : '#F5F3FF' }]}>
          <View style={styles.aiHeader}>
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.aiIconContainer}
            >
              <MaterialCommunityIcons name="robot-happy" size={16} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.aiLabel, { color: colors.primary }]}>Mentali</Text>
            <View style={[styles.aiBadge, { backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5' }]}>
              <Text style={[styles.aiBadgeText, { color: '#10B981' }]}>IA</Text>
            </View>
          </View>
          <Text style={[styles.aiText, { color: colors.text }]}>{aiResponse}</Text>
        </View>
      )}

      {/* Comments Modal */}
      <Modal visible={showComments} animationType="slide" transparent onRequestClose={() => setShowComments(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={[styles.modalContent, { backgroundColor: bgCard }]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Comentarios</Text>
              <TouchableOpacity onPress={() => setShowComments(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={comments}
              keyExtractor={item => item.id.toString()}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingVertical: 8 }}
              ListEmptyComponent={
                <View style={styles.emptyComments}>
                  <View style={[styles.emptyCommentsIcon, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
                    <MaterialCommunityIcons name="comment-outline" size={32} color={colors.primary} />
                  </View>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    Sé el primero en comentar
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={[styles.commentItem, { borderBottomColor: borderColor }]}>
                  <View style={[styles.commentAvatar, { backgroundColor: darkMode ? '#252525' : '#F5F3FF' }]}>
                    <Text>👤</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.commentAuthor, { color: colors.primary }]}>Anónimo</Text>
                    <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
                    <Text style={[styles.commentTime, { color: colors.textMuted }]}>
                      {timeAgo(item.createdAt)}
                    </Text>
                  </View>
                </View>
              )}
            />
            
            <View style={[styles.commentInputContainer, { borderTopColor: borderColor }]}>
              <TextInput
                style={[
                  styles.commentInput, 
                  { 
                    backgroundColor: darkMode ? '#1F1F1F' : '#F5F5F5', 
                    color: colors.text 
                  }
                ]}
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
                    setComments(prev => [
                      { id: Date.now(), text: commentText, createdAt: new Date().toISOString(), likes: 0, liked: false }, 
                      ...prev
                    ]);
                    setCommentText('');
                  }
                }}
              >
                <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
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
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  authorMeta: {
    gap: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeAgo: {
    fontSize: 12,
  },
  dot: {
    fontSize: 12,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  expiryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  content: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 12,
  },
  emotionRow: {
    marginBottom: 12,
  },
  emotionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  emotionTagEmoji: {
    fontSize: 14,
  },
  emotionTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 5,
  },
  reactionEmoji: {
    fontSize: 15,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  aiResponse: {
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  aiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  aiText: {
    fontSize: 14,
    lineHeight: 21,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '80%',
    minHeight: 400,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyCommentsIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
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
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 11,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    marginTop: 12,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
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
