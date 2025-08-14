import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './protectedRoute.jsx';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(({ to }) => <div data-testid="navigate" data-to={to} />),
}));

describe('ProtectedRoute', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders children when authenticated', () => {
        useSelector.mockReturnValue(true);
        const childText = 'Protected Content';

        const { getByText, queryByTestId } = render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>{childText}</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(getByText(childText)).toBeInTheDocument();
        expect(queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
        useSelector.mockReturnValue(false);

        const { getByTestId, queryByText } = render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Should not render</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(getByTestId('navigate')).toHaveAttribute('data-to', '/');
        expect(queryByText('Should not render')).not.toBeInTheDocument();
    });
}); 