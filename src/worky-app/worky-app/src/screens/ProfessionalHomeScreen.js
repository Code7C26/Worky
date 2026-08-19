import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { colors, fonts, radius } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

export default function ProfessionalHomeScreen({ navigation }) {
  const { usuario, logout } = useAuth();
  const primerNombre = usuario?.nombre?.split(' ')[0] || 'Profesional';

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
  };

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
        <Text style={styles.tag}>Panel de profesional</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate('ProfessionalProfileEdit')}
        >
          <View style={styles.cardIcon}>
            <Text style={{ fontSize: 20 }}>🛠️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Mi perfil profesional</Text>
            <Text style={styles.cardSubtitle}>
              Matrícula, categoría, precio y experiencia — esto es lo que ven tus clientes
            </Text>
          </View>
          <Text style={styles.cardArrow}>→</Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => navigation.navigate('ProfessionalJobs')}
        >
          <View style={styles.cardIcon}>
            <Text style={{ fontSize: 20 }}>📋</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Changas disponibles</Text>
            <Text style={styles.cardSubtitle}>Ver pedidos de tu categoría y las que ya aceptaste</Text>
          </View>
          <Text style={styles.cardArrow}>→</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.navyDeep, padding: 20, paddingBottom: 22 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greet: { fontFamily: fonts.body, color: colors.inkOnNavyFaint, fontSize: 12 },
  name: { fontFamily: fonts.display, color: '#fff', fontSize: 18 },
  logout: { fontFamily: fonts.bodySemi, color: colors.inkOnNavyFaint, fontSize: 12, marginTop: 2 },
  tag: {
    fontFamily: fonts.bodySemi,
    color: colors.amber,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 14,
  },
  body: { padding: 20, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 16,
  },
  cardDisabled: { opacity: 0.55 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.orangeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.ink },
  cardSubtitle: { fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft, marginTop: 3, lineHeight: 16 },
  cardArrow: { fontFamily: fonts.display, fontSize: 16, color: colors.inkFaint },
});
