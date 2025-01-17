import { useState, useEffect } from 'react';

function useStorageEstimate() {
  const [storageInfo, setStorageInfo] = useState({
    usage: 0,
    quota: 0,
    percentageUsed: 0,
    supported: true,
    isPersistent: false, // Lisätty kenttä pysyvyystarkistukselle
  });

  useEffect(() => {
    const fetchStorageEstimate = async () => {
      console.log('fetchStorageEstimate');
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const usage = estimate.usage || 0;
          const quota = estimate.quota || 0;
          const percentageUsed = quota > 0 ? (usage / quota) * 100 : 0;
          // Tarkistetaan onko tallennustila pysyvä
          const isPersistent = await navigator.storage.persisted();
          console.log('Pysyvyys?:', isPersistent);
          // Pyydetään pysyvyys automaattisesti, jos sitä ei ole
          
          if (!isPersistent) {
            const isGranted = await navigator.storage.persist();
            console.log('Pysyvyys pyydetty:', isGranted);
          }                    

          setStorageInfo({
            usage,
            quota,
            percentageUsed: percentageUsed.toFixed(2),
            supported: true,
            isPersistent, // Päivitetään pysyvyyden tila
          });
        } catch (error) {
          console.error("Storage estimate API ei toiminut:", error);
        }
      } else {
        setStorageInfo(prev => ({ ...prev, supported: false }));
      }
    };

    fetchStorageEstimate();
  }, []);

  return storageInfo;
}

export default useStorageEstimate;
