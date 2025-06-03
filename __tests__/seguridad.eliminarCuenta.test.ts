import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { eliminarCuenta } from '../src/utils/auth-actions';

jest.mock('firebase/firestore', () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  deleteUser: jest.fn(),
  signOut: jest.fn(),
  auth: { currentUser: { uid: 'mocked-user' } },
}));

jest.mock('react-native', () => {
  const original = jest.requireActual('react-native');
  return {
    ...original,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe('eliminarCuenta - seguridad', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no hace nada si uid es undefined', async () => {
    const router = { replace: jest.fn() };
    await eliminarCuenta(undefined, router);
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(deleteDoc).not.toHaveBeenCalled();
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it('muestra Alert con confirmación destructiva', async () => {
    const router = { replace: jest.fn() };
    await eliminarCuenta('user123', router);

    expect(Alert.alert).toHaveBeenCalledWith(
      '¿Eliminar cuenta?',
      'Esta acción es irreversible.',
      expect.any(Array)
    );

    const alertMock = Alert.alert as jest.Mock;
    const [, , eliminarBtn] = alertMock.mock.calls[0][2];
    expect(eliminarBtn.text).toBe('Eliminar');
    expect(eliminarBtn.style).toBe('destructive');
  });

  it('ejecuta borrado al confirmar', async () => {
    const router = { replace: jest.fn() };

    // simular pulsación directa sin UI
    await eliminarCuenta('user123', router);
    const alertMock = Alert.alert as jest.Mock;
    const [, , botones] = alertMock.mock.calls[0];
    await botones[1].onPress(); // Ejecutamos la acción del botón 'Eliminar'

    expect(deleteDoc).toHaveBeenCalledWith(doc(expect.anything(), 'usuarios', 'user123'));
    expect(deleteUser).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/login');
  });
});
