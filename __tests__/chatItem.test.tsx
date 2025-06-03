import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ChatItem from '../src/components/ChatItem';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      'chatItem.noName': 'Sin nombre',
      'chatItem.noMessages': 'Sin mensajes',
    }[key] || key),
  }),
}));

describe('ChatItem (UI)', () => {
  const baseProps = {
    id: 'chat123',
    nombre: 'Ana',
    lastMessage: '¡Hola!',
    timestamp: '10:30',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('renderiza correctamente con props básicos', () => {
    const { getByText } = render(<ChatItem {...baseProps} />);
    expect(getByText('Ana')).toBeTruthy();
    expect(getByText('¡Hola!')).toBeTruthy();
    expect(getByText('10:30')).toBeTruthy();
  });

  it('muestra texto por defecto si faltan nombre y mensaje', () => {
    const { getByText } = render(<ChatItem id="c1" />);
    expect(getByText('Sin nombre')).toBeTruthy();
    expect(getByText('Sin mensajes')).toBeTruthy();
  });

  it('llama a onPress si se pasa como prop', () => {
    const mockPress = jest.fn();
    const { getByRole } = render(<ChatItem {...baseProps} onPress={mockPress} />);
    fireEvent.press(getByRole('button'));
    expect(mockPress).toHaveBeenCalled();
  });

  it('usa router.push si no se pasa onPress', () => {
    const { router } = require('expo-router');
    const { getByRole } = render(<ChatItem {...baseProps} />);
    fireEvent.press(getByRole('button'));
    expect(router.push).toHaveBeenCalledWith('/chats/chat123');
  });
});
