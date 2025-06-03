import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import PostCard from '../src/components/post-card';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PostCard (UI)', () => {
  const post = {
    id: '1',
    mediaUrl: 'https://example.com/img.jpg',
    contenido: 'Este es un post de prueba',
    categoria: 'Memes',
    likes: ['user1', 'user2'],
  };

  const autor = {
    username: 'Carlos',
    fotoPerfil: 'https://example.com/avatar.jpg',
  };

  it('renderiza la información básica', () => {
    const { getByText } = render(
      <PostCard post={post} autor={autor} likes={post.likes} commentsCount={3} />
    );

    expect(getByText('Carlos')).toBeTruthy();
    expect(getByText('Este es un post de prueba')).toBeTruthy();
    expect(getByText('Memes')).toBeTruthy();
    expect(getByText('2 postP.likes')).toBeTruthy();
    expect(getByText('3 postP.comments')).toBeTruthy();
  });

  it('llama los callbacks al pulsar botones', () => {
    const onLike = jest.fn();
    const onComment = jest.fn();
    const onPress = jest.fn();
    const onAuthorPress = jest.fn();

    const { getByText } = render(
      <PostCard
        post={post}
        autor={autor}
        likes={post.likes}
        commentsCount={1}
        onLike={onLike}
        onComment={onComment}
        onPress={onPress}
        onAuthorPress={onAuthorPress}
      />
    );

    fireEvent.press(getByText('2 postP.likes'));
    expect(onLike).toHaveBeenCalled();

    fireEvent.press(getByText('1 postP.comments'));
    expect(onComment).toHaveBeenCalled();

    fireEvent.press(getByText('Carlos'));
    expect(onAuthorPress).toHaveBeenCalled();
  });
});
