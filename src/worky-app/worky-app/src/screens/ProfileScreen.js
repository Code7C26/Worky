import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { colors, fonts, radius } from '../theme/theme';
import Avatar from '../components/Avatar';
import GradientButton from '../components/GradientButton';
import { professionals } from '../data/mockData';

export default function ProfileScreen({ route, navigation }) {
  const { proId } = route.params;
  const pro = professionals.find((p) => p.id === proId) ?? professionals[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.hero}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Volver</Text>
          </Pressable>
          <View style={styles.topRow}>
            <Avatar initials={pro.initials} size={64} />
            <View>
              <Text style={styles.name}>{pro.name}</Text>
              <Text style={styles.oficio}>{pro.oficio} · {pro.location}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <Stat n={pro.rating} l="Calificación" />
            <View style={styles.statDivider} />
            <Stat n={pro.jobsDone} l="Changas" />
            <View style={styles.statDivider} />
            <Stat n={`${pro.experienceYears} años`} l="Experiencia" />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.badgeRow}>
            {pro.skills.map((s) => (
              <View key={s} style={styles.badge}>
                <Text style={styles.badgeText}>{s}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.about}>{pro.about}</Text>

          <View style={styles.priceBox}>
            <View>
              <Text style={styles.priceLabel}>Precio de referencia</Text>
              <Text style={styles.priceValue}>{pro.priceRef}</Text>
            </View>
            <Text style={styles.starsFull}>★★★★★</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.cta}>
        <GradientButton
          label="Solicitar changa"
          onPress={() => navigation.navigate('CreateJob', { proId: pro.id })}
        />
      </View>
    </SafeAreaView>
  );
}

function Stat({ n, l }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statL}>{l}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: { backgroundColor: colors.navyDeep, padding: 20 },
  back: { fontFamily: fonts.body, fontSize: 13, color: colors.inkOnNavyFaint, marginBottom: 18 },
  topRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  name: { fontFamily: fonts.displaySemi, fontSize: 17, color: '#fff' },
  oficio: { fontFamily: fonts.body, fontSize: 12, color: colors.inkOnNavyFaint, marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
    backgroundColor: colors.navySoft,
    borderRadius: 12,
    paddingVertical: 12,
  },
  statDivider: { width: 1, backgroundColor: colors.navyLine },
  statN: { fontFamily: fonts.displaySemi, fontSize: 15, color: '#fff' },
  statL: { fontFamily: fonts.body, fontSize: 10, color: colors.inkOnNavyFaint, marginTop: 2 },
  body: { padding: 20 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  badge: {
    backgroundColor: '#EEF1F5',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { fontFamily: fonts.bodySemi, fontSize: 11, color: colors.navyDeep },
  about: { fontFamily: fonts.body, fontSize: 12.5, color: colors.inkSoft, lineHeight: 20, marginBottom: 18 },
  priceBox: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.inkSoft },
  priceValue: { fontFamily: fonts.displaySemi, fontSize: 16, color: colors.navyDeep, marginTop: 2 },
  starsFull: { color: colors.amber, fontWeight: '700', fontSize: 16 },
  cta: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
  },
});
