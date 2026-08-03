import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/theme';

export default function VerifiedBadge() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>✓ VERIFICADO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  text: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.success,
    letterSpacing: 0.3,
  },
});
