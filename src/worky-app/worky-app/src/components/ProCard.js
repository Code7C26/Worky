import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../theme/theme';
import Avatar from './Avatar';
import VerifiedBadge from './VerifiedBadge';

export default function ProCard({ pro, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Avatar initials={pro.initials} size={48} />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{pro.name}</Text>
          {pro.verified && <VerifiedBadge />}
        </View>
        <Text style={styles.oficio}>{pro.oficio}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.stars}>★ {pro.rating.toFixed(1)}</Text>
          {pro.distanceKm != null && <Text style={styles.metaDim}>· {pro.distanceKm} km</Text>}
          <Text style={styles.metaDim}>· {pro.availability}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  info: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.ink },
  oficio: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  stars: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.amber },
  metaDim: { fontFamily: fonts.body, fontSize: 11, color: colors.inkFaint },
});
