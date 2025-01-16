import React from 'react';
import useStorageEstimate from '../hooks/useStorageEstimate';

const StorageInfo = () => {
    const { usage, quota, percentageUsed, supported } = useStorageEstimate();

    return (
        <div>
            <h1>Tallennustila</h1>
            {supported ? (
                <div>
                    <p>Käytetty tallennustila: {usage} tavua</p>
                    <p>Kiintiö: {quota} tavua</p>
                    <p>Käytössä oleva osuus: {percentageUsed}%</p>
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
