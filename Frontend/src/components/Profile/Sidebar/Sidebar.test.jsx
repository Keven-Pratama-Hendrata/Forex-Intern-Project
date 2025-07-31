import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import userEvent from '@testing-library/user-event';

describe('Sidebar Component', () => {
    it('renders the correct number of nav items', () => {
        const active = 'Home';
        const onSelect = jest.fn();

        render(
            <MemoryRouter>
                <Sidebar active={active} onSelect={onSelect} />
            </MemoryRouter>
        );

        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems.length).toBe(4);
    });

    it('matches snapshot', () => {
        const active = 'Home';
        const onSelect = jest.fn();

        const { asFragment } = render(
            <MemoryRouter>
                <Sidebar active={active} onSelect={onSelect} />
            </MemoryRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders with default props', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const menuItems = screen.getAllByRole('menuitem');
        const selected = menuItems.find(item =>
            item.className.includes('ant-menu-item-selected')
        );
        expect(selected).toHaveTextContent(/home/i);
    });

    it('calls onSelect when a menu item is clicked', async () => {
        const active = 'Home';
        const onSelect = jest.fn();

        render(
            <MemoryRouter>
                <Sidebar active={active} onSelect={onSelect} />
            </MemoryRouter>
        );
        const menuItems = screen.getAllByRole('menuitem');
        await act(async () => {
            await userEvent.click(menuItems[1]);
        });

        await waitFor(() => {
            expect(onSelect).toHaveBeenCalled();
        });
    });

    it('calls default onSelect when no onSelect prop is provided', async () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );
        const menuItems = screen.getAllByRole('menuitem');
        await act(async () => {
            await userEvent.click(menuItems[1]);
        });

    });
}); 