import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../theme/theme';

export default function GhostButton({ label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.navyLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: '#fff',
  },
});
