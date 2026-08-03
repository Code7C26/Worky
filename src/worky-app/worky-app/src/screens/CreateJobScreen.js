import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { colors, fonts, radius } from '../theme/theme';
import GradientButton from '../components/GradientButton';
import { professionals } from '../data/mockData';

const CATEGORIES = ['Gas', 'Plomería', 'Electricidad', 'Albañilería'];

export default function CreateJobScreen({ route, navigation }) {
  const { proId } = route.params;
  const pro = professionals.find((p) => p.id === proId) ?? professionals[0];

  // Los 3 campos obligatorios del endpoint POST /api/v1/trabajos:
  // ubicación, categoría y precio ofrecido. Si falta uno, no se publica.
  const [location, setLocation] = useState('Av. Sarmiento 1240, Alta Gracia');
  const [category, setCategory] = useState('Gas');
  const [price, setPrice] = useState('15.000');
  const [detail, setDetail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!location.trim() || !category || !price.trim()) {
      setError('Ubicación, categoría y precio ofrecido son obligatorios.');
      return;
    }
    setError('');
    navigation.navigate('Confirmation', { proId: pro.id, category, price, location });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Solicitar changa</Text>
          <Text style={styles.subtitle}>
            Completá los datos para que {pro.name.split(' ')[0]} reciba tu pedido
          </Text>
        </View>

        <View style={styles.body}>
          <Field label="Ubicación" required>
            <TextInput
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              placeholder="Dirección"
            />
          </Field>

          <Field label="Categoría" required>
            <View style={styles.catGrid}>
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.catOpt, category === c && styles.catOptSel]}
                >
                  <Text style={[styles.catOptText, category === c && styles.catOptTextSel]}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Precio ofrecido" required>
            <View style={styles.input}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, color: colors.ink }}
              />
            </View>
          </Field>

          <Field label="Detalle del trabajo">
            <TextInput
              value={detail}
              onChangeText={setDetail}
              placeholder="Ej: pérdida de gas en la cocina"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
              multiline
            />
          </Field>

          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>

      <View style={styles.cta}>
        <GradientButton label="Publicar changa" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}

function Field({ label, required, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label.toUpperCase()} {required && <Text style={styles.req}>obligatorio</Text>}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20 },
  title: { fontFamily: fonts.displaySemi, fontSize: 18, color: colors.navyDeep },
  subtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, marginTop: 4 },
  body: { paddingHorizontal: 20 },
  field: { marginBottom: 16 },
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
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catOpt: {
    width: '48%',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  catOptSel: { borderColor: colors.orange, backgroundColor: colors.orangeBg },
  catOptText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.inkSoft },
  catOptTextSel: { color: colors.orange },
  error: { fontFamily: fonts.body, fontSize: 12, color: '#C0392B', marginTop: 4 },
  cta: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
  },
});
