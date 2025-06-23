import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import App from './App';
import React from 'react';
import { MemoryRouter } from 'react-router';

describe('App', () => {
  it('renders correctly and matches snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
