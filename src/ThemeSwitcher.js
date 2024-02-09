import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function ThemeSwitcher() {
    const [theme, setTheme] = useState('light');
    const { i18n } = useTranslation();

  const switchTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      setTheme('light');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }

  return (
    <button onClick={switchTheme}>
      {theme === 'light' ? i18n.t('switch_to_dark_mode') : i18n.t('switch_to_light_mode')}
    </button>
  );
}

export default ThemeSwitcher;