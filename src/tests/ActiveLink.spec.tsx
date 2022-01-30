import { render, screen } from '@testing-library/react';
import { ActiveLink } from '../components/ActiveLink';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

describe('ActiveLink component', () => {
  it('renders correctly', () => {
    const { debug, getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Navigate</a>
      </ActiveLink>
    );

    expect(getByText('Navigate')).toBeInTheDocument();
  });

  it('adds active class if the link as currently active', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Navigate</a>
      </ActiveLink>
    );

    expect(screen.getByText('Navigate')).toHaveClass('active');
  });
});
