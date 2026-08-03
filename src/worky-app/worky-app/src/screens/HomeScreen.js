import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors, fonts } from '../theme/theme';
import CategoryChip from '../components/CategoryChip';
import ProCard from '../components/ProCard';
import { categories, professionals } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return professionals.filter((p) => {
      const matchesCategory =
        activeCategory === 'Todos' || p.oficio.toLowerCase().includes(activeCategory.toLowerCase());
      const matchesQuery =
        query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.oficio.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.greet}>Hola,</Text>
        <Text style={styles.name}>Marcela</Text>
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
        {categories.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            active={cat === activeCategory}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Cerca de tu ubicación</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {filtered.map((pro) => (
          <ProCard
            key={pro.id}
            pro={pro}
            onPress={() => navigation.navigate('Profile', { proId: pro.id })}
          />
        ))}
        {filtered.length === 0 && (
          <Text style={styles.empty}>No encontramos profesionales para esa búsqueda.</Text>
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
  },
});
