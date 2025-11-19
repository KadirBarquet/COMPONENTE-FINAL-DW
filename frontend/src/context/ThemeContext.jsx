import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('es');
    const [fontSize, setFontSize] = useState('medium');
    const [compactMode, setCompactMode] = useState(false);

    // Cargar configuración guardada al iniciar
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLanguage = localStorage.getItem('language') || 'es';
        const savedFontSize = localStorage.getItem('fontSize') || 'medium';
        const savedCompactMode = localStorage.getItem('compactMode') === 'true';

        setTheme(savedTheme);
        setLanguage(savedLanguage);
        setFontSize(savedFontSize);
        setCompactMode(savedCompactMode);

        applyTheme(savedTheme);
        applyFontSize(savedFontSize);
    }, []);

    // Aplicar tema al documento
    const applyTheme = useCallback((themeValue) => {
        const html = document.documentElement;
        if (themeValue === 'dark') {
            html.classList.add('dark');
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#ffffff';
        } else {
            html.classList.remove('dark');
            document.body.style.backgroundColor = '#f9fafb';
            document.body.style.color = '#000000';
        }
    }, []);

    // Aplicar tamaño de fuente
    const applyFontSize = useCallback((size) => {
        const html = document.documentElement;
        switch (size) {
            case 'small':
                html.style.fontSize = '14px';
                break;
            case 'large':
                html.style.fontSize = '18px';
                break;
            default:
                html.style.fontSize = '16px';
        }
    }, []);

    // Cambiar tema
    const changeTheme = useCallback((newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }, [applyTheme]);

    // Cambiar idioma
    const changeLanguage = useCallback((newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    }, []);

    // Cambiar tamaño de fuente
    const changeFontSize = useCallback((newSize) => {
        setFontSize(newSize);
        localStorage.setItem('fontSize', newSize);
        applyFontSize(newSize);
    }, [applyFontSize]);

    // Cambiar modo compacto
    const changeCompactMode = useCallback((isCompact) => {
        setCompactMode(isCompact);
        localStorage.setItem('compactMode', isCompact);
    }, []);

    const value = {
        theme,
        language,
        fontSize,
        compactMode,
        changeTheme,
        changeLanguage,
        changeFontSize,
        changeCompactMode,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}