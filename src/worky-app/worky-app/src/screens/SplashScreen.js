import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '../theme/theme';
import GradientButton from '../components/GradientButton';
import GhostButton from '../components/GhostButton';

function WorkyPin({ size = 64 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <SvgGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.orange} />
          <Stop offset="1" stopColor="#C7280A" />
        </SvgGradient>
      </Defs>
      <Circle cx="76" cy="24" r="16" fill={colors.amber} />
      <Path
        d="M10 30 L35 30 L50 55 L65 30 L90 30 L60 90 L40 90 Z"
        fill="url(#pinGrad)"
      />
    </Svg>
  );
}

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.pinWrap}>
          <WorkyPin />
        </View>
        <Text style={styles.title}>worky</Text>
        <Text style={styles.tag}>RED DE OFICIOS</Text>
        <Text style={styles.claim}>
          Encontrá profesionales verificados de albañilería, electricidad, plomería y gas cerca tuyo.
        </Text>

        <GradientButton
          label="Buscar un profesional"
          onPress={() => navigation.navigate('Home')}
          style={{ width: '100%', marginBottom: 12 }}
        />
        <GhostButton
          label="Soy profesional de oficio"
          onPress={() => {}}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navyDeep },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  pinWrap: { marginBottom: 22 },
  title: {
    fontFamily: fonts.display,
    color: '#fff',
    fontSize: 30,
    marginBottom: 6,
  },
  tag: {
    fontFamily: fonts.bodySemi,
    color: colors.inkOnNavyFaint,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 30,
  },
  claim: {
    fontFamily: fonts.body,
    color: colors.inkOnNavy,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 40,
  },
});
