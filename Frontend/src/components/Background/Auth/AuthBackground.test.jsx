import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthBackground from './AuthBackground';

jest.mock('./authBackgroundHandler.jsx', () => {
  const mockGetCircleConfigs = jest.fn(() => ({
    login: { id: 'cfg-login' },
    signup: { id: 'cfg-signup' },
  }));

  const mockGetConfig = jest.fn((pos, cfgs) => cfgs[pos] ?? cfgs.login);

  const mockRenderWaveBackground = jest.fn(() => (
    <div data-testid="bg-gradient" />
  ));

  const mockRenderCircles = jest.fn((cfg) => (
    <div data-testid={`circles-${cfg.id}`} />
  ));

  return {
    getCircleConfigs: mockGetCircleConfigs,
    getConfig: mockGetConfig,
    renderWaveBackground: mockRenderWaveBackground,
    renderCircles: mockRenderCircles,
  };
});

describe('AuthBackground', () => {
  afterEach(() => cleanup());

  const renderUI = (ui) => render(ui).container.firstChild;

  it('renders default (login) background', () => {
    const testContent = <span>Any content</span>;

    const node = renderUI(
      <AuthBackground>
        {testContent}
      </AuthBackground>,
    );

    expect(node).toMatchSnapshot();
  });

  it('renders signup variant', () => {
    const testContent = <span>Signup form</span>;

    const node = renderUI(
      <AuthBackground circlePosition="signup">
        {testContent}
      </AuthBackground>,
    );

    expect(node).toMatchSnapshot();
  });

  it('falls back to login config when circlePosition is invalid', () => {
    const testContent = <span>Invalid pos</span>;

    const node = renderUI(
      <AuthBackground circlePosition="does-not-exist">
        {testContent}
      </AuthBackground>,
    );

    expect(node).toMatchSnapshot();
  });
});
