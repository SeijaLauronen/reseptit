// src/components/DeviceInfo.js
import React from 'react';
import {
    isMobile,
    isTablet,
    isBrowser,
    isDesktop,
    deviceType,
    browserName,
    engineName,
    osName,
    osVersion,
} from 'react-device-detect';

const DeviceInfo = () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    return (

        <div>
            <h3>Tietoja laitteestasi:</h3>
            <p>Laitetyyppi: {deviceType}</p>
            <p>Selain: {browserName}</p>
            <p>Moottori: {engineName}</p>
            <p>Käyttöjärjestelmä: {osName}</p>
            <p>Käyttöjärjestelmän versio: {osVersion}</p>
            <p>Onko mobiililaite: {isMobile ? 'Kyllä' : 'Ei'}</p>
            <p>Onko tabletti: {isTablet ? 'Kyllä' : 'Ei'}</p>
            {/* <p>Onko selain: {isBrowser ? 'Kyllä' : 'Ei'}</p> */}
            <p>Onko pöytäkone: {isDesktop ? 'Kyllä' : 'Ei'}</p>
            <p>Näytön leveys: {screenWidth}px</p>
            <p>Näytön korkeus: {screenHeight}px</p>
        </div>

    );
};

export default DeviceInfo;
