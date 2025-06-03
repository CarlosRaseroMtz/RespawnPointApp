import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import ChatScreen from '..//app/(tabs)/chats/[id]';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'chat123', chatId: 'chat123' }),
}));

jest.mock('@/src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'user1' } }),
}));

jest.mock('@/src/hooks/useMarcarMensajesLeidos', () => ({
  useMarcarMensajesLeidos: () => ({
    marcarMensajesComoLeidos: jest.fn(),
  }),
}));

jest.mock('firebase/firestore', () => {
  return {
    collection: jest.fn(),
    doc: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    serverTimestamp: () => 'MOCK_TIMESTAMP',
    Timestamp: { now: () => 'NOW' },
    query: jest.fn(),
    orderBy: jest.fn(),
    onSnapshot: (_q: any, callback: any) => {
      callback({ docs: [] }); // no hay mensajes iniciales
      return () => {};
    },
  };
});

describe('ChatScreen', () => {
  it('permite escribir y enviar un mensaje', async () => {
    const { getByPlaceholderText, getByText } = render(<ChatScreen />);

    const input = getByPlaceholderText('chat.placeholder');
    const button = getByText('chat.send');

    fireEvent.changeText(input, 'Hola test!');
    fireEvent.press(button);

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });
});
