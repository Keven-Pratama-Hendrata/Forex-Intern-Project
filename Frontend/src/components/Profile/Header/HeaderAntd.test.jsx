import React from 'react';
import { render } from '@testing-library/react';
import HeaderAntd from './HeaderAntd.jsx';

jest.mock('./headerAntdHandler.jsx', () => ({
    useHeaderLogout: () => jest.fn(),
    useLogoutHover: () => [false, jest.fn(), jest.fn()],
    getLogoutButtonStyle: () => ({}),
    HEADER_LABELS: { balance: 'Balance', logout: 'Logout' },
    HEADER_STYLES: {
        avatarPillStyle: {},
        avatarIconStyle: {},
        usernameStyle: {},
        headerContainerStyle: {},
        sectionLeftStyle: {},
        sectionCenterStyle: {},
        sectionRightStyle: {},
        logoutIconStyle: {},
        logoutLinkStyle: { background: 'white' },
    },
}));

jest.mock('../../../../assets/logout_icon.png', () => 'logout_icon.png');
jest.mock('../../../../assets/profilepicture.png', () => 'profilepicture.png');

describe('HeaderAntd', () => {
    it('renders with given username and balance', () => {
        const username = 'TestUser';
        const balance = 12345.67;

        const { getByText } = render(<HeaderAntd username={username} balance={balance} />);
        const balanceElement = getByText('Balance:');

        expect(getByText('TestUser')).toBeInTheDocument();
        expect(balanceElement).toBeInTheDocument();
        expect(balanceElement.textContent).toContain('Rp12,345.67');
        expect(getByText('Logout')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const username = 'SnapshotUser';
        const balance = 100.5;

        const { asFragment } = render(<HeaderAntd username={username} balance={balance} />);

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders default username when username is not provided', () => {
        const balance = 100;

        const { getByText } = render(<HeaderAntd balance={balance} />);

        expect(getByText('User')).toBeInTheDocument();
    });
}); 