import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next/router');
jest.mock('next-auth/react', () => {
  return {
    useSession: () => ({
      data: null,
      status: 'unauthorized',
    }),
  };
});
jest.mock('../../services/stripe');

describe('Home page', () => {
  it('renders correctly', () => {
    render(
      <Home
        product={{
          priceId: 'mock-price-id',
          amount: '$10.00',
        }}
      />
    );

    expect(screen.getByText('for $10.00 month')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve);

    retriveStripePricesMocked.mockResolvedValueOnce({
      id: 'mock-price-id',
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'mock-price-id',
            amount: '$10.00',
          },
        },
      })
    );
  });
});
