import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, fonts, radius } from '../theme/theme';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const CATEGORIAS = ['Plomería', 'Electricidad', 'Gas', 'Albañilería', 'Otro'];

export default function ProfessionalProfileEditScreen({ navigation }) {
  const { token } = useAuth();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const [oficio, setOficio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [matricula, setMatricula] = useState('');
  const [precio, setPrecio] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillDraft, setSkillDraft] = useState('');

  // Al entrar, traemos el perfil existente (si ya lo había cargado antes)
  useEffect(() => {
    (async () => {
      try {
        const perfil = await api.getMiPerfilProfesional(token);
        if (perfil) {
          setOficio(perfil.oficio || '');
          setCategoria(perfil.categoria || '');
          setMatricula(perfil.matriculaHabilitante || '');
          setPrecio(perfil.precioReferencia ? String(perfil.precioReferencia) : '');
          setExperiencia(perfil.experienciaAnios ? String(perfil.experienciaAnios) : '');
          setAbout(perfil.about || '');
          setSkills(perfil.skills || []);
        }
      } catch (e) {
        // si no tiene perfil todavía, el backend devuelve null — no es un error real
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const agregarSkill = () => {
    const s = skillDraft.trim();
    if (!s) return;
    if (skills.includes(s)) {
      setSkillDraft('');
      return;
    }
    setSkills((prev) => [...prev, s]);
    setSkillDraft('');
  };

  const quitarSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleGuardar = async () => {
    setError('');
    setExito(false);

    if (!oficio.trim() || !categoria || !precio.trim()) {
      setError('Oficio, categoría y precio de referencia son obligatorios.');
      return;
    }

    setGuardando(true);
    try {
      await api.guardarMiPerfilProfesional(
        {
          oficio: oficio.trim(),
          categoria,
          matriculaHabilitante: matricula.trim(),
          precioReferencia: Number(precio),
          experienciaAnios: Number(experiencia) || 0,
          about: about.trim(),
          skills,
        },
        token
      );
      setExito(true);
    } catch (e) {
      setError(e.message || 'No pudimos guardar tu perfil.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <ActivityIndicator color={colors.orange} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.back}>← Volver</Text>
            </Pressable>
            <Text style={styles.title}>Mi perfil profesional</Text>
            <Text style={styles.subtitle}>
              Esto es lo que van a ver los clientes cuando te busquen
            </Text>
          </View>

          <View style={styles.body}>
            <Field label="Oficio" required>
              <TextInput
                value={oficio}
                onChangeText={setOficio}
                placeholder="Ej: Gasista matriculado"
                placeholderTextColor={colors.inkFaint}
                style={styles.input}
              />
            </Field>

            <Field label="Categoría" required>
              <View style={styles.catGrid}>
                {CATEGORIAS.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCategoria(c)}
                    style={[styles.catOpt, categoria === c && styles.catOptSel]}
                  >
                    <Text style={[styles.catOptText, categoria === c && styles.catOptTextSel]}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Field>

            <Field label="Matrícula habilitante">
              <TextInput
                value={matricula}
                onChangeText={setMatricula}
                placeholder="Si tu oficio la requiere"
                placeholderTextColor={colors.inkFaint}
                style={styles.input}
              />
            </Field>

            <View style={styles.row}>
              <Field label="Precio de referencia" required style={{ flex: 1 }}>
                <View style={styles.input}>
                  <Text style={styles.currency}>$</Text>
                  <TextInput
                    value={precio}
                    onChangeText={setPrecio}
                    keyboardType="numeric"
                    placeholder="15000"
                    placeholderTextColor={colors.inkFaint}
                    style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, color: colors.ink }}
                  />
                </View>
              </Field>
              <View style={{ width: 12 }} />
              <Field label="Años de experiencia" style={{ flex: 1 }}>
                <TextInput
                  value={experiencia}
                  onChangeText={setExperiencia}
                  keyboardType="numeric"
                  placeholder="6"
                  placeholderTextColor={colors.inkFaint}
                  style={styles.input}
                />
              </Field>
            </View>

            <Field label="Sobre vos">
              <TextInput
                value={about}
                onChangeText={setAbout}
                placeholder="Contales a tus clientes tu experiencia y especialidad"
                placeholderTextColor={colors.inkFaint}
                multiline
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              />
            </Field>

            <Field label="Habilidades / especialidades">
              <View style={styles.skillInputRow}>
                <TextInput
                  value={skillDraft}
                  onChangeText={setSkillDraft}
                  onSubmitEditing={agregarSkill}
                  placeholder="Ej: Instalaciones de gas"
                  placeholderTextColor={colors.inkFaint}
                  style={[styles.input, { flex: 1 }]}
                />
                <Pressable onPress={agregarSkill} style={styles.addSkillBtn}>
                  <Text style={styles.addSkillBtnText}>+</Text>
                </Pressable>
              </View>

              {skills.length > 0 && (
                <View style={styles.skillsWrap}>
                  {skills.map((s) => (
                    <Pressable key={s} style={styles.skillChip} onPress={() => quitarSkill(s)}>
                      <Text style={styles.skillChipText}>{s} ✕</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </Field>

            {!!error && <Text style={styles.error}>{error}</Text>}
            {exito && <Text style={styles.success}>✓ Perfil guardado correctamente</Text>}

            {guardando ? (
              <ActivityIndicator color={colors.orange} style={{ marginTop: 8 }} />
            ) : (
              <GradientButton label="Guardar perfil" onPress={handleGuardar} style={{ marginTop: 8 }} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, required, children, style }) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <Text style={styles.fieldLabel}>
        {label.toUpperCase()} {required && <Text style={styles.req}>obligatorio</Text>}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  centered: { alignItems: 'center', justifyContent: 'center' },
  header: { padding: 20 },
  back: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft, marginBottom: 14 },
  title: { fontFamily: fonts.displaySemi, fontSize: 18, color: colors.navyDeep },
  subtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, marginTop: 4 },
  body: { paddingHorizontal: 20 },
  fieldLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    color: colors.inkSoft,
    letterSpacing: 0.4,
    marginBottom: 7,
  },
  req: { color: colors.orange, fontSize: 9, fontFamily: fonts.bodyBold },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: { fontFamily: fonts.body, fontSize: 13, color: colors.ink, marginRight: 6 },
  row: { flexDirection: 'row' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catOpt: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  catOptSel: { borderColor: colors.orange, backgroundColor: colors.orangeBg },
  catOptText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.inkSoft },
  catOptTextSel: { color: colors.orange },
  skillInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addSkillBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.navyDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSkillBtnText: { color: '#fff', fontFamily: fonts.display, fontSize: 18 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  skillChip: {
    backgroundColor: '#EEF1F5',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skillChipText: { fontFamily: fonts.bodySemi, fontSize: 11, color: colors.navyDeep },
  error: { fontFamily: fonts.body, fontSize: 12, color: '#C0392B', marginBottom: 12 },
  success: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.success, marginBottom: 12 },
});
