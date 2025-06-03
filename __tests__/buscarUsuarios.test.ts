import { getDocs } from 'firebase/firestore';
import { buscarUsuarios } from '../src/utils/buscar-usuarios';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

const mockGetDocs = getDocs as jest.Mock;

describe('buscarUsuarios (funcional)', () => {
  const fakeSnap = (docs: any[]) => ({
    docs: docs.map((doc) => ({
      id: doc.id,
      data: () => doc.data,
    })),
  });

  it('devuelve usuarios que coinciden por nombre', async () => {
    mockGetDocs.mockResolvedValueOnce(
      fakeSnap([
        { id: '1', data: { username: 'Carlos' } },
        { id: '2', data: { username: 'Ana' } },
        { id: '3', data: { username: 'Carla' } },
      ])
    );

    const resultados = await buscarUsuarios('car', '2'); // "Ana" debe excluirse

    expect(resultados.length).toBe(2);
    expect(resultados.map(u => u.username)).toEqual(expect.arrayContaining(['Carlos', 'Carla']));
    expect(resultados.find(u => u.id === '2')).toBeUndefined();
  });

  it('devuelve mensaje si no hay coincidencias', async () => {
    mockGetDocs.mockResolvedValueOnce(
      fakeSnap([
        { id: '1', data: { username: 'Carlos' } },
      ])
    );

    const resultados = await buscarUsuarios('zzz', '1');

    expect(resultados).toEqual([
      { id: 'no-results', username: 'No se encontraron usuarios' },
    ]);
  });
});
