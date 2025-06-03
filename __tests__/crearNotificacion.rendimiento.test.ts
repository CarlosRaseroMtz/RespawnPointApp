import { crearNotificacion } from '../src/utils/crear-notificacion';

jest.mock('firebase/firestore', () => {
  return {
    doc: jest.fn(),
    getDoc: jest.fn(() =>
      Promise.resolve({
        exists: () => true,
        data: () => ({
          username: 'Carlos',
          fotoPerfil: 'https://example.com/avatar.jpg',
        }),
      })
    ),
    addDoc: jest.fn(() => Promise.resolve()),
    collection: jest.fn(),
    serverTimestamp: () => 'MOCK_TIMESTAMP',
  };
});

describe('crearNotificacion - rendimiento', () => {
  it('se ejecuta en menos de 100ms', async () => {
    const start = performance.now();

    await crearNotificacion({
      paraUid: 'user2',
      deUid: 'user1',
      contenido: 'le dio like a tu publicación',
      tipo: 'like',
    });

    const end = performance.now();
    const duracion = end - start;

    console.log(`⏱ Tiempo crearNotificacion: ${duracion.toFixed(2)}ms`);
    expect(duracion).toBeLessThan(100);
  });
});
