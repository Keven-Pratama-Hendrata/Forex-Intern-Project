import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('../Pages/Login/Login', () => () => (
  <div data-testid="login-page">Login Page</div>
));

describe('<App />', () => {
  afterEach(() => cleanup());

  it('wraps the whole app in a light-themed div', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container.firstChild).toHaveAttribute('data-theme', 'light');
  });

  it('renders the Login page on route "/"', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
