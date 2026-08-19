import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors, fonts, radius } from '../theme/theme';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ route, navigation }) {
  const { rol } = route.params ?? { rol: 'cliente' };
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password) {
      setError('Completá nombre, email y contraseña.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña tiene que tener al menos 6 caracteres.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const usuarioCreado = await register({ nombre: nombre.trim(), email: email.trim(), password, rol });
      const destino = usuarioCreado.rol === 'profesional' ? 'ProfessionalHome' : 'Home';
      navigation.reset({ index: 0, routes: [{ name: destino }] });
    } catch (e) {
      setError(e.message || 'No pudimos crear la cuenta.');
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
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.back}>← Volver</Text>
            </Pressable>
            <Pressable onPress={() => navigation.popToTop()} hitSlop={10}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            {rol === 'profesional'
              ? 'Armá tu perfil para que los clientes te encuentren'
              : 'Registrate para empezar a contratar profesionales'}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>NOMBRE COMPLETO</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
            />
          </View>

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
              placeholder="Mínimo 6 caracteres"
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
              label="Crear cuenta"
              onPress={handleRegister}
              style={{ marginTop: 8 }}
            />
          )}

          <Pressable
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login', { rol })}
          >
            <Text style={styles.loginText}>
              ¿Ya tenés cuenta? <Text style={styles.loginTextStrong}>Iniciar sesión</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
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
  loginLink: { marginTop: 22, alignItems: 'center' },
  loginText: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  loginTextStrong: { fontFamily: fonts.bodyBold, color: colors.orange },
});
