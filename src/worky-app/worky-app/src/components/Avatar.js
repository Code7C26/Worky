import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../theme/theme';

export default function Avatar({ initials, size = 48 }) {
  return (
    <LinearGradient
      colors={colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size * 0.25 },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.32 }]}>{initials}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fonts.display, color: '#1A1000' },
});
