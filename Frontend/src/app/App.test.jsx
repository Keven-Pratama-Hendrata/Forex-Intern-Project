import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../Pages', () => ({
  ...jest.requireActual('../Pages'),
  Login: () => <div data-testid="login-page">Login Page</div>,
  Dashboard: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Route: ({ element, path }) => (
    <div data-testid={`route-${path}`} data-path={path}>
      {element}
    </div>
  ),
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
}));

describe('<App />', () => {
  afterEach(() => cleanup());

  it('wraps the whole app in a light-themed div', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(container.firstChild).toHaveAttribute('data-theme', 'light');
  });

  it('renders the Login page on route "/"', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
