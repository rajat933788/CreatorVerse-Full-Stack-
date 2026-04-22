import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const ThemeContext = createContext(null);

export function ThemeProvider({ children, user, updateProfile }) {
  // Load theme from MongoDB user object (no localStorage)
  const [theme, setTheme] = useState(user?.theme || 'light');

  // Sync when user object loads from server
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
    }
  }, [user?.theme]);

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    updateProfile({ theme: next }); // update local state
    try {
      await api.put('/auth/profile', { theme: next }); // save to MongoDB
    } catch {
      // silently fail — UI already updated
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
