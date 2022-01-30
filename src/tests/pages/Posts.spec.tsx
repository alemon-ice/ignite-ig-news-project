import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'my-new-post',
    title: 'My new post',
    excerpt: 'post excerpt',
    updatedAt: '01 de janeiro de 2022',
  },
];

describe('Posts pages', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMock = mocked(getPrismicClient);

    getPrismicClientMock.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([
        {
          uid: 'my-new-post',
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
                text: 'post excerpt',
              },
            ],
          },
          last_publication_date: '01-01-2022',
        },
      ]),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My new post',
              excerpt: 'post excerpt',
              updatedAt: '01 de janeiro de 2022',
            },
          ],
        },
      })
    );
  });
});
