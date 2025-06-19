/* AuthBackground.test.jsx */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import AuthBackground from './AuthBackground';

jest.mock('./authBackgroundUtils.jsx', () => {
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

const renderUI = (ui) => render(ui).container.firstChild;

describe('AuthBackground', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders default (login) background', () => {
    const node = renderUI(
      <AuthBackground>
        <span>Any content</span>
      </AuthBackground>,
    );

    expect(node).toMatchSnapshot();
  });

  it('renders signup variant', () => {
    const node = renderUI(
      <AuthBackground circlePosition="signup">
        <span>Signup form</span>
      </AuthBackground>,
    );

    expect(node).toMatchSnapshot();
  });

  it('falls back to login config when circlePosition is invalid', () => {
    const node = renderUI(
      <AuthBackground circlePosition="does-not-exist">
        <span>Invalid pos</span>
      </AuthBackground>,
    );

    expect(node).toMatchSnapshot();
  });
});
