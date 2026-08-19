import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors, fonts, radius } from '../theme/theme';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ route, navigation }) {
  const { rol } = route.params ?? { rol: 'cliente' };
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Completá email y contraseña.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const usuarioLogueado = await login(email.trim(), password);
      const destino = usuarioLogueado.rol === 'profesional' ? 'ProfessionalHome' : 'Home';
      navigation.reset({ index: 0, routes: [{ name: destino }] });
    } catch (e) {
      setError(e.message || 'No pudimos iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.wrap}>
          <View style={styles.topBar}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.back}>← Volver</Text>
            </Pressable>
            <Pressable onPress={() => navigation.popToTop()} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>
            {rol === 'profesional'
              ? 'Entrá para gestionar tus changas y tu perfil'
              : 'Entrá para buscar y contratar profesionales'}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={colors.inkFaint}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.inkFaint}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          {loading ? (
            <ActivityIndicator color={colors.orange} style={{ marginTop: 8 }} />
          ) : (
            <GradientButton
              label="Iniciar sesión"
              onPress={handleLogin}
              style={{ marginTop: 8 }}
            />
          )}

          <Pressable
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register', { rol })}
          >
            <Text style={styles.registerText}>
              ¿No tenés cuenta? <Text style={styles.registerTextStrong}>Crear cuenta</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { flex: 1, padding: 24, justifyContent: 'center' },
  topBar: {
    position: 'absolute',
    top: 8,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  close: { fontFamily: fonts.bodySemi, fontSize: 20, color: colors.inkFaint },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.navyDeep, marginBottom: 6 },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: 28,
    lineHeight: 19,
  },
  field: { marginBottom: 16 },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 0.4,
    marginBottom: 7,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
  },
  error: { fontFamily: fonts.body, fontSize: 12, color: '#C0392B', marginBottom: 12 },
  registerLink: { marginTop: 22, alignItems: 'center' },
  registerText: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  registerTextStrong: { fontFamily: fonts.bodyBold, color: colors.orange },
});
