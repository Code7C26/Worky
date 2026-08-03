// Tokens de marca Worky.
// Cualquier color, fuente o radio que se use en la app debería salir de acá,
// para que un cambio de identidad visual se propague desde un solo lugar.

export const colors = {
  navyDeep: '#0B1B2E',
  navy: '#13273F',
  navySoft: '#1C3555',
  navyLine: '#2C4562',

  orange: '#FF6B1A',
  amber: '#FFC42E',
  gradient: ['#FF6B1A', '#FFC42E'], // usar con expo-linear-gradient, start=(0,0) end=(1,1)

  bg: '#F7F5F0',
  card: '#FFFFFF',
  line: '#E7E3DA',

  ink: '#16232F',
  inkSoft: '#5B6B7A',
  inkFaint: '#94A0AB',
  inkOnNavy: '#C9D4DE',
  inkOnNavyFaint: '#8CA0B5',

  success: '#1F9D65',
  successBg: '#E7F5EE',
  orangeBg: '#FFF3EA',
};

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  displayMed: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMed: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 20,
  pill: 999,
};

export const spacing = (n) => n * 4; // spacing(4) === 16

export default { colors, fonts, radius, spacing };
