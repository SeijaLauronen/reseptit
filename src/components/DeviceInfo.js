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

  /* Versionumeron saisi oikein vain natiivisovelluksella */
  /* Tämäkään ei tuo oikein versiota */
  /*
  const getOSVersion = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
      if (/android/i.test(userAgent)) {
        const match = userAgent.match(/Android\s([0-9\.]*)/);
        return match ? `Android ${match[1]}` : 'Android (version not detected)';
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        const match = userAgent.match(/OS (\d+)_?(\d+)?/);
        return match
          ? `iOS ${match[1]}.${match[2] || 0}`
          : 'iOS (version not detected)';
      }
      return 'Tuntematon';
    };
*/

  /* Ei tuo tämäkään oikein versiota */
  /*
  const getOperatingSystem = () => {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();

    if (platform.includes("win")) {
      if (userAgent.includes("windows nt 10.0")) return "Windows 10";
      if (userAgent.includes("windows nt 11.0")) return "Windows 11";
      return "Windows (version not detected)";
    } else if (platform.includes("mac")) {
      return "macOS (exact version not detectable)";
    } else if (platform.includes("linux")) {
      return "Linux";
    } else if (/android/.test(userAgent)) {
      const match = userAgent.match(/android\s([0-9\.]*)/);
      return match ? `Android ${match[1]}` : "Android (version not detected)";
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      const match = userAgent.match(/os (\d+)_?(\d+)?/);
      return match ? `iOS ${match[1]}.${match[2] || 0}` : "iOS (version not detected)";
    }

    return "Tuntematon";
  };
  */


  return (

    <div>
      <h3>Tietoja laitteestasi:</h3>
      Laitetyyppi: {deviceType}<br />
      Selain: {browserName}<br />
      Näytön leveys: {screenWidth}px<br />
      Näytön korkeus: {screenHeight}px<br />
      Onko selain: {isBrowser ? 'Kyllä' : 'Ei'}<br />
      Onko mobiililaite: {isMobile ? 'Kyllä' : 'Ei'}<br />
      Onko tabletti: {isTablet ? 'Kyllä' : 'Ei'}<br />
      Onko pöytäkone: {isDesktop ? 'Kyllä' : 'Ei'}<br />
      Moottori: {engineName}<br />
      Käyttöjärjestelmä: {osName}<br />
      Käyttöjärjestelmän versio: {'>='} {osVersion}<br />
      Katso versio laitteen tiedoista tarkemmin.
      {/*
            Käyttöjärjestelmän versio: {getOSVersion()}<br/>
            Käyttöjärjestelmä: {getOperatingSystem()}
             */}

    </div>

  );
};

export default DeviceInfo;
