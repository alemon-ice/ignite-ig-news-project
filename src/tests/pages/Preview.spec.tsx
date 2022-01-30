import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Preview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post content</p>',
  updatedAt: '01 de janeiro de 2022',
};

jest.mock('next/router');
jest.mock('next-auth/react');
jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('renders correctly', () => {
    const useSessionMock = mocked(useSession);

    useSessionMock.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<Preview post={post} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMock = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    const pushMock = jest.fn();

    useSessionMock.mockReturnValueOnce({
      data: {
        activeSubscription: 'mock-active-subscription',
      },
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Preview post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('loads initial data', async () => {
    const getPrismicClientMock = mocked(getPrismicClient);

    getPrismicClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading',
              text: 'My new post',
            },
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post content',
            },
          ],
        },
        last_publication_date: '01-01-2022',
      }),
    } as any);

    const response = await getStaticProps({
      params: {
        slug: 'my-new-post',
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '01 de janeiro de 2022',
          },
        },
      })
    );
  });
});
