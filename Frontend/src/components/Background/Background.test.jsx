import React from 'react';
import { render, screen } from '@testing-library/react';
import Background from './Background.jsx';
import { getCircleConfigs } from './Auth/authBackgroundHandler';

jest.mock('./Auth/authBackgroundHandler', () => ({
    renderWaveBackground: jest.fn(() => <svg data-testid="wave-bg" />),
    renderCircles: jest.fn(() => <svg data-testid="circles" />),
    getCircleConfigs: jest.fn(() => ({ login: { className: '', circles: [] } })),
    getConfig: jest.fn((pos, configs) => configs.login),
}));

describe('Background', () => {
    it('renders children and wave background, but not circles when showCircles is false', () => {
        const childText = 'Test Child';

        render(
            <Background showCircles={false}>
                <div>{childText}</div>
            </Background>
        );

        expect(screen.getByText(childText)).toBeInTheDocument();
        expect(screen.getByTestId('wave-bg')).toBeInTheDocument();
        expect(screen.queryByTestId('circles')).not.toBeInTheDocument();
    });

    it('renders circles when showCircles is true (covers line 50)', () => {
        const childText = 'Test Child';

        render(
            <Background showCircles={true}>
                <div>{childText}</div>
            </Background>
        );

        expect(screen.getByTestId('circles')).toBeInTheDocument();
    });

    it('matches snapshot with circles', () => {
        const childText = 'Snapshot Child';

        const { asFragment } = render(
            <Background showCircles={true}>
                <div>{childText}</div>
            </Background>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('calls getCircleConfigs when rendering', () => {
        render(<Background />);
        expect(getCircleConfigs).toHaveBeenCalled();
    });
}); 