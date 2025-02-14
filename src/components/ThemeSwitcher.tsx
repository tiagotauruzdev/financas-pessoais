import { useState, useEffect } from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

export function ThemeSwitcher() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Update document class and localStorage when theme changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setDarkMode(false)}
        className={`p-2 rounded-lg transition-colors ${
          !darkMode
            ? 'bg-yellow-100 text-yellow-600'
            : 'hover:bg-gray-200 text-gray-500 dark:hover:bg-gray-700 dark:text-gray-400'
        }`}
        title="Tema Claro"
      >
        <MdLightMode size={24} />
      </button>
      <button
        onClick={() => setDarkMode(true)}
        className={`p-2 rounded-lg transition-colors ${
          darkMode
            ? 'bg-navy-800 text-yellow-500'
            : 'hover:bg-gray-200 text-gray-500 dark:hover:bg-gray-700 dark:text-gray-400'
        }`}
        title="Tema Escuro"
      >
        <MdDarkMode size={24} />
      </button>
    </div>
  );
}
