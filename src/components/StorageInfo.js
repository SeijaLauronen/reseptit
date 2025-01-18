import React from 'react';
import useStorageEstimate from '../hooks/useStorageEstimate';

const formatBytes = (bytes) => {
    const sizes = ['tavua', 'Kt', 'Mt', 'Gt', 'Tt'];
    if (bytes === 0) return '0 tavua';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const StorageInfo = () => {
    const { usage, quota, percentageUsed, supported, isPersistent, requestPersistence, persistenceError } = useStorageEstimate();

    return (
        <div>
            <h3>Tallennustila</h3>

            <div>
                <p>Tiedot tallentuvat laitteellesi, käyttämäsi selaimen muistiin. </p>
                <p><b>Muista ottaa varmuuskopio, kun olet tallentanut paljon tietoa, joka ei saa hävitä!</b></p>
                <p>Tallennustila {isPersistent ? 'on periaatteessa pysyvä.' : 'ei ole pysyvä.'}</p>
                <p>Tallentamasi tiedot voivat poistua selaimen toiminnoilla. </p>

                {supported ? (
                    <>
                        {!isPersistent && (
                            <button onClick={requestPersistence}>Pyydä pysyvää tallennustilaa</button>
                        )}
                        {persistenceError && <p style={{ color: 'red' }}>{persistenceError}</p>}
                        <span>
                            <p>Käytetty tallennustila: {formatBytes(usage)} ({percentageUsed}%)<br />
                                Kiintiö: {formatBytes(quota)}<br />
                            </p>
                            {percentageUsed > 90 && (
                                <p style={{ color: 'red' }}>Varoitus: Tallennustila lähestyy maksimia! Ota varmuuskopio!</p>
                            )}
                        </span>
                    </>
                ) : (
                    <p>Tallennustilan tutkiminen ei ole tuettu tässä selaimessa.</p>
                )}
            </div>
        </div>
    );
};

export default StorageInfo;
