import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import {
  getCircleConfigs,
  getConfig,
  renderWaveBackground,
  renderCircles,
} from './authBackgroundUtils';

describe('authBackgroundUtils – config helpers', () => {
  it('returns fresh, complete circle-config objects', () => {
    const cfg1 = getCircleConfigs();
    const cfg2 = getCircleConfigs();

    expect(Object.keys(cfg1)).toEqual(['login', 'signup']);
    expect(cfg1.login).toEqual(cfg2.login);
    expect(cfg1.signup).toEqual(cfg2.signup);

    expect(cfg1).not.toBe(cfg2);
    expect(cfg1.login).not.toBe(cfg2.login);
  });

  it('getConfig selects explicit position or falls back to login', () => {
    const cfg = getCircleConfigs();
    expect(getConfig('login', cfg)).toBe(cfg.login);
    expect(getConfig('signup', cfg)).toBe(cfg.signup);
    expect(getConfig('does-not-exist', cfg)).toBe(cfg.login);
    expect(getConfig(undefined, cfg)).toBe(cfg.login);
  });
});

describe('authBackgroundUtils – SVG render helpers', () => {
  it('renderWaveBackground outputs a full-screen gradient SVG', () => {
    const { container } = render(renderWaveBackground());
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
    expect(svg).toHaveClass(
      'absolute',
      'inset-0',
      'h-full',
      'w-full',
      'pointer-events-none',
    );

    expect(container.querySelector('linearGradient')).toHaveAttribute('id', 'bgGrad');
    expect(container.querySelectorAll('stop')).toHaveLength(2);
    expect(container.querySelector('rect')).toHaveAttribute('fill', 'url(#bgGrad)');
    expect(container.querySelector('path')).toHaveAttribute('fill', '#ffffff');

    expect(svg).toMatchSnapshot();
  });

  it('renderCircles draws a custom-class SVG with circles', () => {
    const cfg = {
      className: 'test-class',
      circles: [
        { cx: 90, cy: 70, r: 55 },
        { cx: 130, cy: 60, r: 40 },
      ],
    };

    const { container } = render(renderCircles(cfg));
    const svg = container.querySelector('svg');

    expect(svg).toHaveClass('test-class');
    expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
    expect(svg).toHaveAttribute('stroke-width', '3');

    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
    expect([...circles].map((c) => c.getAttribute('r'))).toEqual(['55', '40']);

    const empty = render(renderCircles({ className: 'x', circles: [] }))
      .container.querySelectorAll('circle');
    expect(empty).toHaveLength(0);
  });
});
