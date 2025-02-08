import { useState, useEffect } from 'react';

function useStorageEstimate() {
  const [storageInfo, setStorageInfo] = useState({
    usage: 0,
    quota: 0,
    percentageUsed: 0,
    supported: true,
    isPersistent: false, // Pysyvyystarkistus
    persistenceError: null, // Tallennetaan virheviesti
  });

  useEffect(() => {
    const fetchStorageEstimate = async () => {
      //console.log('fetchStorageEstimate kutsuttu');
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const usage = estimate.usage || 0;
          const quota = estimate.quota || 0;
          const percentageUsed = quota > 0 ? (usage / quota) * 100 : 0;

          // Tarkistetaan pysyvyystila
          const isPersistent = await navigator.storage.persisted();
          //console.log('Pysyvyys (ennen pyyntöä):', isPersistent);

          // Yritetään pyytää pysyvyyttä, jos sitä ei ole
          if (!isPersistent) {
            const isGranted = await navigator.storage.persist();
            //console.log('Pysyvyys pyydetty, tulos:', isGranted);

            // Päivitetään tila pyynnön tuloksen perusteella
            setStorageInfo({
              usage,
              quota,
              percentageUsed: percentageUsed.toFixed(2),
              supported: true,
              isPersistent: isGranted, // Käytetään pyynnön tulosta
            });
          } else {
            setStorageInfo({
              usage,
              quota,
              percentageUsed: percentageUsed.toFixed(2),
              supported: true,
              isPersistent,
            });
          }
        } catch (error) {
          console.error('Storage estimate API ei toiminut:', error);
        }
      } else {
        setStorageInfo((prev) => ({ ...prev, supported: false }));
      }
    };

    fetchStorageEstimate();
  }, []);

  // Manuaalinen pysyvyyspyynnön funktio
  const requestPersistence = async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const isGranted = await navigator.storage.persist();
        setStorageInfo((prev) => ({
          ...prev,
          isPersistent: isGranted,
          persistenceError: !isGranted ? 'Pysyvyyden asettaminen epäonnistui. Yritä muuttaa selaimen asetuksia.' : null,
        }));
        return isGranted;
      } catch (error) {
        console.error('Tallennustilan pysyvyyden pyytäminen epäonnistui:', error);
        setStorageInfo((prev) => ({
          ...prev,
          persistenceError: 'Tallennustilan pysyvyyden pyytäminen epäonnistui.',
        }));
        return false;
      }
    } else {
      console.error('Tallennustilan pysyvyyden pyyntö ei ole tuettu tässä selaimessa.');
      setStorageInfo((prev) => ({
        ...prev,
        persistenceError: 'Tallennustilan pysyvyyden pyyntö ei ole tuettu tässä selaimessa.',
      }));
      return false;
    }
  };

  return { ...storageInfo, requestPersistence };
}

export default useStorageEstimate;
