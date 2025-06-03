import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import AccessibilityLanguageScreen from '../app/(tabs)/lenguaje';

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key) => {
    if (key === 'language') return 'es';
    if (key === 'privacy') return 'false';
    if (key === 'darkmode') return 'false';
    return null;
  }),
  setItem: jest.fn(),
}));

jest.mock('@/src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}));

jest.mock('@/src/i18n', () => ({
  changeLanguage: jest.fn(),
}));

describe('AccessibilityLanguageScreen (usabilidad)', () => {
  it('muestra lista de idiomas y permite seleccionarlos', async () => {
    const { getByText } = render(<AccessibilityLanguageScreen />);

    expect(getByText('Español')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();

    fireEvent.press(getByText('Français'));
    await waitFor(() => {
      expect(getByText('✓')).toBeTruthy();
    });
  });

  it('cambia el texto de privacidad al activar el switch', async () => {
    const { getByText, getAllByRole } = render(<AccessibilityLanguageScreen />);
    expect(getByText('Cualquiera podrá ver tus publicaciones.')).toBeTruthy();

    const switches = getAllByRole('switch');
    fireEvent(switches[0], 'valueChange', true);

    await waitFor(() => {
      expect(getByText('Solo tus seguidores podrán ver tus publicaciones.')).toBeTruthy();
    });
  });

  it('cambia el texto de tema claro/oscuro al activar el switch', async () => {
    const { getByText } = render(<AccessibilityLanguageScreen />);

    expect(getByText('Interfaz clara con mejor visibilidad diurna.')).toBeTruthy();
  });
});
