import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, fonts, radius } from '../theme/theme';
import Avatar from '../components/Avatar';
import { professionals, chatMessages } from '../data/mockData';

export default function ChatScreen({ route, navigation }) {
  const { proId } = route.params;
  const pro = professionals.find((p) => p.id === proId) ?? professionals[0];

  const [messages, setMessages] = useState(chatMessages);
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMessage = {
      id: `m${Date.now()}`,
      from: 'me',
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft('');
    // Acá es donde iría la llamada real: enviar a Firestore/WebSocket
    // y dejar que la respuesta del profesional llegue por un listener,
    // no simulada como en este mock.
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Avatar initials={pro.initials} size={38} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cname}>{pro.name}</Text>
            <View style={styles.statusRow}>
              <View style={styles.dot} />
              <Text style={styles.cstatus}>En línea</Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.orderCard}>
              <View style={styles.orderPin}>
                <Text style={{ fontSize: 15 }}>📍</Text>
              </View>
              <View>
                <Text style={styles.orderTitle}>Changa: {pro.oficio}</Text>
                <Text style={styles.orderSubtitle}>Con {pro.name}</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.bubbleRow, item.from === 'me' && styles.bubbleRowMe]}>
              <View style={{ maxWidth: '78%' }}>
                <View style={[styles.bubble, item.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={item.from === 'me' ? styles.bubbleTextMe : styles.bubbleTextThem}>
                    {item.text}
                  </Text>
                </View>
                <Text style={[styles.time, item.from === 'me' && styles.timeMe]}>{item.time}</Text>
              </View>
            </View>
          )}
        />

        <View style={styles.inputBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Escribir un mensaje…"
            placeholderTextColor={colors.inkFaint}
            style={styles.input}
            multiline
          />
          <Pressable onPress={handleSend} style={styles.sendBtnWrap}>
            <View style={styles.sendBtn}>
              <Text style={styles.sendIcon}>➤</Text>
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.navyDeep,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: { fontSize: 18, color: colors.inkOnNavyFaint },
  cname: { fontFamily: fonts.displaySemi, fontSize: 14, color: '#fff' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3ED87F' },
  cstatus: { fontFamily: fonts.body, fontSize: 10.5, color: '#7FD9A8' },
  list: { padding: 16, paddingBottom: 8, gap: 10 },
  orderCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  orderPin: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.orangeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderTitle: { fontFamily: fonts.bodySemi, fontSize: 11.5, color: colors.navyDeep },
  orderSubtitle: { fontFamily: fonts.body, fontSize: 10.5, color: colors.inkFaint, marginTop: 1 },
  bubbleRow: { flexDirection: 'row', marginBottom: 10 },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubble: { paddingHorizontal: 13, paddingVertical: 10, borderRadius: 16 },
  bubbleThem: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderBottomLeftRadius: 4,
  },
  bubbleMe: { backgroundColor: colors.navyDeep, borderBottomRightRadius: 4 },
  bubbleTextThem: { fontFamily: fonts.body, fontSize: 12.5, color: colors.ink, lineHeight: 18 },
  bubbleTextMe: { fontFamily: fonts.body, fontSize: 12.5, color: '#fff', lineHeight: 18 },
  time: { fontFamily: fonts.body, fontSize: 9.5, color: colors.inkFaint, marginTop: 4 },
  timeMe: { textAlign: 'right', color: colors.inkOnNavyFaint },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ink,
    maxHeight: 100,
  },
  sendBtnWrap: { marginBottom: 2 },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { color: '#1A1000', fontWeight: '700' },
});
