import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';

const AuthContext = createContext(null);
const STORAGE_KEY = 'worky_session';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Al abrir la app, fijarse si ya había una sesión guardada de una vez anterior.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          setUsuario(saved.usuario);
          setToken(saved.token);
        }
      } catch (e) {
        // si falla la lectura, simplemente arranca sin sesión
      } finally {
        setLoadingSession(false);
      }
    })();
  }, []);

  const persistir = async (usuario, token) => {
    setUsuario(usuario);
    setToken(token);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ usuario, token }));
  };

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    await persistir(data.usuario, data.token);
    return data.usuario;
  };

  const register = async ({ nombre, email, password, rol }) => {
    const data = await api.register({ nombre, email, password, rol });
    await persistir(data.usuario, data.token);
    return data.usuario;
  };

  const logout = async () => {
    setUsuario(null);
    setToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, token, loadingSession, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
