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
            Laitetyyppi: {deviceType}<br/>
            Selain: {browserName}<br/>
            Näytön leveys: {screenWidth}px<br/>
            Näytön korkeus: {screenHeight}px<br/>
            Onko selain: {isBrowser ? 'Kyllä' : 'Ei'}<br/>
            Onko mobiililaite: {isMobile ? 'Kyllä' : 'Ei'}<br/>
            Onko tabletti: {isTablet ? 'Kyllä' : 'Ei'}<br/>            
            Onko pöytäkone: {isDesktop ? 'Kyllä' : 'Ei'}<br/>  
            Moottori: {engineName}<br/>
            Käyttöjärjestelmä: {osName}<br/>
            Käyttöjärjestelmän versio: {osVersion}<br/>
                      
        </div>

    );
};

export default DeviceInfo;
