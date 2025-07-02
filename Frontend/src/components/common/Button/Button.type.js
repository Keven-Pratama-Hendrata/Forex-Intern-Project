import PropTypes from 'prop-types';

export const ButtonProps = {
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export const ButtonEventHandlers = {
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onClick: PropTypes.func,
};

export const ButtonCoreProps = {
    type: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
}; 