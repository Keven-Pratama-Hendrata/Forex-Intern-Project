import { navItems, navItemStyle, handleMenuClick, navRoutes } from './sidebarHandler.jsx';

describe('sidebarHandler', () => {
    describe('navItems', () => {
        it('should be an array of 4 navigation items', () => {
            expect(Array.isArray(navItems)).toBe(true);
            expect(navItems).toHaveLength(4);
        });

        it('should have correct structure for each nav item', () => {
            navItems.forEach(item => {
                expect(item).toHaveProperty('key');
                expect(typeof item.key).toBe('string');
                expect(item).toHaveProperty('icon');
                expect(item).toHaveProperty('label');
            });
        });
    });

    describe('navItemStyle', () => {
        it('should have the expected style properties', () => {
            expect(navItemStyle).toMatchObject({
                fontSize: 16,
                fontWeight: 500,
                height: 48,
                display: 'flex',
                alignItems: 'center',
            });
        });
    });

    describe('handleMenuClick', () => {
        it('should call navigate and onSelect with the correct key', () => {
            const navigate = jest.fn();
            const onSelect = jest.fn();
            const key = 'Market';

            handleMenuClick({ key }, navigate, onSelect);

            expect(navigate).toHaveBeenCalledWith(navRoutes[key]);
            expect(onSelect).toHaveBeenCalledWith(key);
        });

        it('should only call onSelect if key is not in navRoutes', () => {
            const navigate = jest.fn();
            const onSelect = jest.fn();
            const key = 'NonExistent';

            handleMenuClick({ key }, navigate, onSelect);

            expect(navigate).not.toHaveBeenCalled();
            expect(onSelect).toHaveBeenCalledWith(key);
        });
    });
}); 