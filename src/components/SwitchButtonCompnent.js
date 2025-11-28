import React from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';

const SwitchButton = styled(Switch)`
  .react-switch-bg {
    background-color: ${(props) => (props.checked ? props.onColor : props.offColor)};
  }

  .react-switch-handle {
    background-color: ${(props) => (props.checked ? props.onHandleColor : props.offHandleColor)};
    height: 22px;
    width: 22px;
  }

  width: ${(props) => props.width || '48px'};
  height: ${(props) => props.height || '20px'};
  border-radius: 10px;
`;

const SwitchButtonComponent = ({
  checked,
  onChange,
  onColor = '#007BFF',
  offColor = '#ccc',
  onHandleColor = '#ffffff',
  offHandleColor = '#ffffff',
  width = 38,
  height = 18,
  handleDiameter = 16,
  handleBorder = '2px solid #ccc', // Oletusarvo rajalle
  ...rest //voidaan välittää ylimääräisiä props-arvoja
}) => {
  return (
    <SwitchButton
      checked={checked}
      onChange={onChange}
      onColor={onColor}
      offColor={offColor}
      onHandleColor={onHandleColor}
      offHandleColor={offHandleColor}
      width={width}
      height={height}
      handleDiameter={handleDiameter}
      uncheckedIcon={false}
      checkedIcon={false}
      {...rest}
    />
  );
};

// ---- YLEISKÄYTTÖINEN TOGGLE (KAKSI LABELIA) ----
export const ToggleSwitchButton = ({
  checked,
  onChange,
  leftLabel = 'Off',
  rightLabel = 'On',
  style = {},
  labelStyle = {},
  ...switchProps
}) => {
  const activeStyle = {
    fontWeight: 600,
    opacity: 1,
    ...labelStyle
  };

  const inactiveStyle = {
    opacity: 0.5,
    ...labelStyle
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        ...style
      }}
    >
      <span style={checked ? inactiveStyle : activeStyle}>{leftLabel}</span>

      <SwitchButtonComponent
        checked={checked}
        onChange={onChange}
        {...switchProps}
      />

      <span style={checked ? activeStyle : inactiveStyle}>{rightLabel}</span>
    </div>
  );
};

export default SwitchButtonComponent;
