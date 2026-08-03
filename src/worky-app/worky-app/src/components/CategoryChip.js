import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../theme/theme';

export default function CategoryChip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.navyDeep,
    borderColor: colors.navyDeep,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.inkSoft,
  },
  labelActive: {
    color: '#fff',
  },
});
