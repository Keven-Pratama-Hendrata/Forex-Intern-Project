import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('../Pages/Login/Login', () => () => (
  <div data-testid="login-page">Login Page</div>
));

jest.mock('react-router', () => ({
  Route: ({ element, path }) => (
    <div data-testid={`route-${path}`} data-path={path}>
      {element}
    </div>
  ),
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
}));

describe('<App />', () => {
  it('wraps the whole app in a light-themed div', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toHaveAttribute('data-theme', 'light');
  });

  it('renders the Login page on route "/"', () => {
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
