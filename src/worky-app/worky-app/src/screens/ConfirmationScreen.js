import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { colors, fonts, radius } from '../theme/theme';

export default function ConfirmationScreen({ route, navigation }) {
  const { proId, proNombre, changaId } = route.params;
  const primerNombre = proNombre?.split(' ')[0] || 'el profesional';

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable
        style={styles.closeBtn}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        hitSlop={10}
      >
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
      <View style={styles.wrap}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.title}>Changa publicada</Text>
        <Text style={styles.subtitle}>
          Le avisamos a {primerNombre} y a otros profesionales cercanos. Te vamos a
          notificar apenas alguien confirme.
        </Text>

        <TrackRow title="Publicada" subtitle="Recién" />
        <TrackRow
          title="Esperando confirmación"
          subtitle={`${proNombre || 'El profesional'} está viendo tu pedido`}
        />

        <Pressable
          style={styles.chatLink}
          onPress={() => navigation.navigate('Chat', { proId, proNombre, changaId })}
        >
          <Text style={styles.chatLinkText}>💬 Escribirle a {primerNombre}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function TrackRow({ title, subtitle }) {
  return (
    <View style={styles.trackRow}>
      <Text style={styles.trackTitle}>{title}</Text>
      <Text style={styles.trackSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  closeBtn: { position: 'absolute', top: 16, right: 20, zIndex: 10, padding: 6 },
  closeText: { fontFamily: fonts.bodySemi, fontSize: 20, color: colors.inkFaint },
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  checkMark: { color: colors.success, fontSize: 28, fontWeight: '700' },
  title: { fontFamily: fonts.displaySemi, fontSize: 19, color: colors.navyDeep, marginBottom: 8 },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.inkSoft,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 26,
  },
  trackRow: {
    width: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
  },
  trackTitle: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.navyDeep },
  trackSubtitle: { fontFamily: fonts.body, fontSize: 11, color: colors.inkFaint, marginTop: 2 },
  chatLink: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.orange,
    backgroundColor: colors.orangeBg,
    alignItems: 'center',
    marginTop: 4,
  },
  chatLinkText: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.orange },
});
