import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, radius } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const CATEGORIA_ICONO = {
  Plomería: '🔧',
  Electricidad: '⚡',
  Gas: '🔥',
  Albañilería: '🧱',
  Otro: '🛠️',
};

export default function ProfessionalJobsScreen({ navigation }) {
  const { token } = useAuth();

  const [tab, setTab] = useState('disponibles'); // 'disponibles' | 'encurso'
  const [disponibles, setDisponibles] = useState([]);
  const [asignadas, setAsignadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState('');
  const [aceptandoId, setAceptandoId] = useState(null);

  const cargarTodo = useCallback(async () => {
    setError('');
    try {
      const [disp, asig] = await Promise.all([
        api.getChangasDisponibles(token),
        api.getMisChangasAsignadas(token),
      ]);
      setDisponibles(disp);
      setAsignadas(asig);
    } catch (e) {
      setError(e.message || 'No pudimos cargar las changas.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [token]);

  // Recarga cada vez que la pantalla vuelve a estar en foco (ej. al volver del chat)
  useFocusEffect(
    useCallback(() => {
      cargarTodo();
    }, [cargarTodo])
  );

  const handleRefresh = () => {
    setRefrescando(true);
    cargarTodo();
  };

  const handleAceptar = async (changaId) => {
    setAceptandoId(changaId);
    try {
      const changaAceptada = await api.aceptarChanga(changaId, token);
      setDisponibles((prev) => prev.filter((c) => c._id !== changaId));
      setAsignadas((prev) => [changaAceptada, ...prev]);
      setTab('encurso');
    } catch (e) {
      setError(e.message || 'No pudimos aceptar esta changa. Puede que ya la haya tomado otro profesional.');
      cargarTodo(); // refrescamos por si ya no está disponible
    } finally {
      setAceptandoId(null);
    }
  };

  const abrirChat = (changa) => {
    navigation.navigate('Chat', {
      changaId: changa._id,
      proNombre: changa.cliente?.nombre || 'Cliente', // el chat solo necesita "el nombre de la otra persona"
    });
  };

  const lista = tab === 'disponibles' ? disponibles : asignadas;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Volver</Text>
        </Pressable>
        <Text style={styles.title}>Changas</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === 'disponibles' && styles.tabActive]}
          onPress={() => setTab('disponibles')}
        >
          <Text style={[styles.tabText, tab === 'disponibles' && styles.tabTextActive]}>
            Disponibles {disponibles.length > 0 ? `(${disponibles.length})` : ''}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'encurso' && styles.tabActive]}
          onPress={() => setTab('encurso')}
        >
          <Text style={[styles.tabText, tab === 'encurso' && styles.tabTextActive]}>
            En curso {asignadas.length > 0 ? `(${asignadas.length})` : ''}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 14 }}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={handleRefresh} />}
      >
        {cargando && <ActivityIndicator color={colors.orange} style={{ marginTop: 20 }} />}

        {!cargando && !!error && <Text style={styles.error}>{error}</Text>}

        {!cargando && !error && lista.length === 0 && (
          <Text style={styles.empty}>
            {tab === 'disponibles'
              ? 'No hay changas disponibles de tu categoría por ahora. Volvé a revisar más tarde.'
              : 'Todavía no aceptaste ninguna changa.'}
          </Text>
        )}

        {!cargando &&
          !error &&
          lista.map((changa) => (
            <View key={changa._id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.catIcon}>
                  <Text style={{ fontSize: 18 }}>{CATEGORIA_ICONO[changa.categoria] || '🛠️'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardCategoria}>{changa.categoria}</Text>
                  <Text style={styles.cardCliente}>Cliente: {changa.cliente?.nombre || '—'}</Text>
                </View>
                <Text style={styles.cardPrecio}>
                  $ {changa.precioOfrecido?.toLocaleString('es-AR')}
                </Text>
              </View>

              <Text style={styles.cardUbicacion}>📍 {changa.ubicacion?.direccionTexto}</Text>
              {!!changa.detalle && <Text style={styles.cardDetalle}>{changa.detalle}</Text>}

              {tab === 'disponibles' ? (
                <Pressable
                  style={styles.acceptBtn}
                  onPress={() => handleAceptar(changa._id)}
                  disabled={aceptandoId === changa._id}
                >
                  {aceptandoId === changa._id ? (
                    <ActivityIndicator color="#1A1000" size="small" />
                  ) : (
                    <Text style={styles.acceptBtnText}>Aceptar changa</Text>
                  )}
                </Pressable>
              ) : (
                <Pressable style={styles.chatBtn} onPress={() => abrirChat(changa)}>
                  <Text style={styles.chatBtnText}>💬 Ir al chat</Text>
                </Pressable>
              )}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, paddingBottom: 10 },
  back: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft, marginBottom: 12 },
  title: { fontFamily: fonts.displaySemi, fontSize: 18, color: colors.navyDeep },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginTop: 6 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.navyDeep, borderColor: colors.navyDeep },
  tabText: { fontFamily: fonts.bodySemi, fontSize: 12.5, color: colors.inkSoft },
  tabTextActive: { color: '#fff' },
  error: { fontFamily: fonts.body, fontSize: 13, color: '#C0392B', marginBottom: 12 },
  empty: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  catIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.orangeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCategoria: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.ink },
  cardCliente: { fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft, marginTop: 1 },
  cardPrecio: { fontFamily: fonts.displaySemi, fontSize: 14, color: colors.navyDeep },
  cardUbicacion: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, marginBottom: 4 },
  cardDetalle: { fontFamily: fonts.body, fontSize: 12, color: colors.inkFaint, marginBottom: 12, lineHeight: 17 },
  acceptBtn: {
    marginTop: 8,
    backgroundColor: colors.amber,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptBtnText: { fontFamily: fonts.displaySemi, fontSize: 13, color: '#1A1000' },
  chatBtn: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: colors.orange,
    backgroundColor: colors.orangeBg,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chatBtnText: { fontFamily: fonts.displaySemi, fontSize: 13, color: colors.orange },
});
