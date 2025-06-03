import { addDoc, getDoc, runTransaction } from 'firebase/firestore';
import { crearNotificacion } from '../src/utils/crear-notificacion';
import { comentarPublicacion } from '../src/utils/feed-actions';

jest.mock('firebase/firestore');
jest.mock('../src/utils/crear-notificacion');

const mockGetDoc = getDoc as jest.Mock;
const mockAddDoc = addDoc as jest.Mock;
const mockRunTransaction = runTransaction as jest.Mock;
const mockCrearNoti = crearNotificacion as jest.Mock;

describe('comentarPublicacion (integración)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('agrega comentario y notifica si no es autor', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ userId: 'autor_original' }),
    });

    mockRunTransaction.mockImplementation(async (_db, callback) => {
      await callback({
        get: async () => ({ exists: () => true, data: () => ({ commentsCount: 2 }) }),
        update: jest.fn(),
      });
    });

    await comentarPublicacion({
      publicacionId: 'post123',
      contenido: 'Buen post!',
      autorUid: 'otro_usuario',
    });

    expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      contenido: 'Buen post!',
      userId: 'otro_usuario',
    }));

    expect(runTransaction).toHaveBeenCalled();
    expect(crearNotificacion).toHaveBeenCalledWith(expect.objectContaining({
      paraUid: 'autor_original',
      deUid: 'otro_usuario',
      contenido: 'comentó en tu publicación',
      tipo: 'comentario',
    }));
  });

  it('no notifica si el autor comenta su propio post', async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ userId: 'mismo_usuario' }),
    });

    mockRunTransaction.mockImplementation(async (_db, callback) => {
      await callback({
        get: async () => ({ exists: () => true, data: () => ({ commentsCount: 0 }) }),
        update: jest.fn(),
      });
    });

    await comentarPublicacion({
      publicacionId: 'post456',
      contenido: 'Mi propio comentario',
      autorUid: 'mismo_usuario',
    });

    expect(crearNotificacion).not.toHaveBeenCalled();
  });
});
