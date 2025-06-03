import { getDoc, updateDoc } from 'firebase/firestore';
import { crearNotificacion } from '../src/utils/crear-notificacion';
import { toggleLike } from '../src/utils/feed-actions';

jest.mock('firebase/firestore');
jest.mock('../src/utils/crear-notificacion');
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  arrayRemove: jest.fn((uid) => `arrayRemove(${uid})`),
  arrayUnion: jest.fn((uid) => `arrayUnion(${uid})`),
}));

const mockUpdateDoc = updateDoc as jest.Mock;
const mockGetDoc = getDoc as jest.Mock;
const mockCrearNoti = crearNotificacion as jest.Mock;

describe('toggleLike', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fakeRef = {}; // no se usa directamente

  it('elimina like si ya lo tiene', async () => {
    mockUpdateDoc.mockResolvedValueOnce(undefined);

    await toggleLike({
      postId: 'abc123',
      userUid: 'user1',
      likes: ['user1'],
    });

    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      likes: expect.any(Object), // arrayRemove
    });
    expect(getDoc).not.toHaveBeenCalled();
    expect(crearNotificacion).not.toHaveBeenCalled();
  });

  it('agrega like y crea notificación si no es el autor', async () => {
    mockUpdateDoc.mockResolvedValueOnce(undefined);
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ userId: 'user2' }),
    });

    await toggleLike({
      postId: 'abc123',
      userUid: 'user1',
      likes: [],
    });

    expect(updateDoc).toHaveBeenCalled();
    expect(getDoc).toHaveBeenCalled();
    expect(crearNotificacion).toHaveBeenCalledWith({
      paraUid: 'user2',
      deUid: 'user1',
      contenido: 'le ha dado me gusta a tu publicación',
      tipo: 'like',
    });
  });

  it('no crea notificación si es el mismo usuario', async () => {
    mockUpdateDoc.mockResolvedValueOnce(undefined);
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ userId: 'user1' }),
    });

    await toggleLike({
      postId: 'abc123',
      userUid: 'user1',
      likes: [],
    });

    expect(updateDoc).toHaveBeenCalled();
    expect(crearNotificacion).not.toHaveBeenCalled();
  });
});
