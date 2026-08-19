import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { colors, fonts } from '../theme/theme';
import CategoryChip from '../components/CategoryChip';
import ProCard from '../components/ProCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { mapPerfilAPro } from '../utils/mappers';

const CATEGORIES = ['Todos', 'Plomería', 'Electricidad', 'Gas', 'Albañilería'];

export default function HomeScreen({ navigation }) {
  const { usuario, logout } = useAuth();
  const primerNombre = usuario?.nombre?.split(' ')[0] || 'Vecino/a';
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [profesionales, setProfesionales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarProfesionales = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await api.getProfesionales(
        activeCategory !== 'Todos' ? { categoria: activeCategory } : {}
      );
      setProfesionales(data.map(mapPerfilAPro));
    } catch (e) {
      setError(e.message || 'No pudimos cargar los profesionales.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProfesionales();
  }, [activeCategory]);

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return profesionales;
    const q = query.toLowerCase();
    return profesionales.filter(
      (p) => p.name.toLowerCase().includes(q) || p.oficio.toLowerCase().includes(q)
    );
  }, [profesionales, query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greet}>Hola,</Text>
            <Text style={styles.name}>{primerNombre}</Text>
          </View>
          <Pressable onPress={handleLogout} hitSlop={10}>
            <Text style={styles.logout}>Salir</Text>
          </Pressable>
        </View>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar oficio o profesional"
            placeholderTextColor={colors.inkOnNavyFaint}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            active={cat === activeCategory}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Profesionales disponibles</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {cargando && <ActivityIndicator color={colors.orange} style={{ marginTop: 20 }} />}

        {!cargando && !!error && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.error}>{error}</Text>
            <Pressable onPress={cargarProfesionales}>
              <Text style={styles.retry}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {!cargando &&
          !error &&
          filtered.map((pro) => (
            <ProCard
              key={pro.id}
              pro={pro}
              onPress={() => navigation.navigate('Profile', { proId: pro.id })}
            />
          ))}

        {!cargando && !error && filtered.length === 0 && (
          <Text style={styles.empty}>
            Todavía no hay profesionales cargados para esta categoría. Cuando alguien complete su
            perfil, va a aparecer acá.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.navyDeep,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greet: { fontFamily: fonts.body, color: colors.inkOnNavyFaint, fontSize: 12 },
  name: { fontFamily: fonts.display, color: '#fff', fontSize: 18 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logout: { fontFamily: fonts.bodySemi, color: colors.inkOnNavyFaint, fontSize: 12, marginTop: 2 },
  searchBar: {
    marginTop: 16,
    backgroundColor: colors.navySoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontFamily: fonts.body,
    fontSize: 13,
    paddingVertical: 10,
  },
  chips: { paddingHorizontal: 20, paddingVertical: 16 },
  sectionTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 14,
    color: colors.navyDeep,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 19,
  },
  error: { fontFamily: fonts.body, fontSize: 13, color: '#C0392B', marginTop: 16 },
  retry: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.orange, marginTop: 8 },
});
