import React from 'react';
import useStorageEstimate from '../hooks/useStorageEstimate';

const formatBytes = (bytes) => {
    const sizes = ['tavua', 'Kt', 'Mt', 'Gt', 'Tt'];
    if (bytes === 0) return '0 tavua';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const StorageInfo = () => {
    const { usage, quota, percentageUsed, supported, isPersistent } = useStorageEstimate();

    return (
        <div>
            <h1>Tallennustila</h1>
            {supported ? (
                <div>
                    <p><b>Muista ottaa varmuuskopio, kun olet tallentanut paljon tietoa, joka ei saa hävitä!</b></p>
                    <p>Tallennustila {isPersistent ? 'on periaatteessa pysyvä.' : 'ei ole pysyvä.'}</p>
                    <p>Jos poistat selaimen historia- tai selaustietoja, myös tallentamasi tiedot poistetaan.</p>
                    <p>Selain saattaa myös yllättäin poistaa tietoja muistista tallennustilansa lisäämiseksi,
                        vaikka alla näkyvä käytössä oleva osuus olisi pienikin. </p>
                    <p>Käytetty tallennustila: {formatBytes(usage)}<br />
                    Kiintiö: {formatBytes(quota)}<br/>
                    Käytössä oleva osuus: {percentageUsed}%<br/>
                    </p>
                    {percentageUsed > 90 && (
                        <p style={{ color: 'red' }}>Varoitus: Tallennustila lähestyy maksimia! Ota varmuuskopio!</p>
                    )}
                </div>
            ) : (
                <p>Tallennustilan tutkiminen ei ole tuettu tässä selaimessa.</p>
            )}

        </div>
    );
};

export default StorageInfo;
