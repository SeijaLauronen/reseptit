import React, { useState, useEffect, useRef } from 'react';

import FineliService from '../FineliService';
import FineliProductSelector from '../FineliProductSelector';
import { nutrientDefinitions } from '../nutrients';
import { FineliSelect } from '../../components/Input';
import { InputQuantity } from '../../components/Input';
import { FineliDoseItem } from '../../components/Item';

export default function ProductDoseFineliSelector({
  onSelect,
  onMappingChange,
  initialQuery = '',
  autoSearch = true,
  debounceMs = 300,
  dose = null,
  initialMapping = null,
}) {
  const [selected, setSelected] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [fineliAmountMin, setFineliAmountMin] = useState('');
  const [fineliAmountMax, setFineliAmountMax] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const lastSentMappingRef = useRef(null);
  const lastSentSelectRef = useRef(null);

  /*
   * Alustus tehdään vain kerran komponentin elinkaaren aikana.
   *
   * Tärkeää:
   * initialMapping muuttuu myöhemmin myös silloin, kun käyttäjä
   * muuttaa Min/Max-arvoja. Silloin sitä EI pidä käsitellä uutena
   * alustuksena, koska muuten käyttäjän tekemät muutokset
   * palautuisivat vanhoihin arvoihin.
   */
  const initializedRef = useRef(false);

  /*
   * Muistetaan oliko edellisessä renderöinnissä mapping.
   *
   * Tätä käytetään vain "Poista vastaavuus" -tilanteen havaitsemiseen.
   */
  const previousInitialMappingRef = useRef(initialMapping);

  /*
   * Estetään mappingin lähettäminen parentille silloin,
   * kun olemassa olevaa Fineli-tietoa vasta alustetaan.
   */
  const isInitializingRef = useRef(false);

  /*
   * Jos tuotteella on jo tallennettu Fineli-vastaavuus,
   * automaattinen nimihaku ei saa korvata sitä.
   */
  const hasInitialMappingRef = useRef(
    Boolean(initialMapping?.fineliId)
  );

  const getGramsPerUnit = (unit) => {
    if (!unit) return null;

    if (unit.code === 'G') {
      return 1;
    }

    if (
      unit.grams !== null &&
      unit.grams !== undefined &&
      !Number.isNaN(Number(unit.grams))
    ) {
      return Number(unit.grams);
    }

    return null;
  };

  /*
   * Etsii tallennetun yksikön ladatun Fineli-tuotteen
   * yksiköistä.
   */
  const findSavedUnit = (food, savedUnit) => {
    if (!food?.units || !savedUnit) {
      return null;
    }

    if (typeof savedUnit === 'string') {
      return (
        food.units.find(
          unit =>
            unit.code === savedUnit ||
            unit.name === savedUnit
        ) ?? null
      );
    }

    return (
      food.units.find(
        unit =>
          unit.code === savedUnit.code ||
          unit.name === savedUnit.name
      ) ?? null
    );
  };

  /*
   * Alustetaan olemassa oleva Fineli-mapping vain kerran.
   *
   * Tämä on olennainen ero aikaisempaan versioon:
   *
   * initialMapping voi myöhemmin muuttua, kun käyttäjä muuttaa
   * Min/Max-arvoja. Silloin emme enää lataa vanhaa mappingia
   * uudestaan.
   */
  useEffect(() => {
    /*
     * Ensimmäinen ajo: alustetaan tuotteen olemassa oleva mapping.
     */
    if (!initializedRef.current) {
      initializedRef.current = true;

      /*
       * Muistetaan alkuperäinen tila.
       */
      previousInitialMappingRef.current = initialMapping;

      /*
       * Ei olemassa olevaa Fineli-mappingia.
       */
      if (!initialMapping) {
        hasInitialMappingRef.current = false;
        return;
      }

      /*
       * Tuotteella on olemassa oleva Fineli-vastaavuus.
       */
      isInitializingRef.current = true;
      hasInitialMappingRef.current = Boolean(
        initialMapping.fineliId
      );

      /*
       * Palautetaan tallennetut Min/Max-arvot.
       */
      setFineliAmountMin(
        initialMapping.fineliAmount?.min ?? ''
      );

      setFineliAmountMax(
        initialMapping.fineliAmount?.max ?? ''
      );

      /*
       * Haetaan varsinainen Fineli-tietue ID:n perusteella.
       */
      if (initialMapping.fineliId) {
        let cancelled = false;

        const loadFineli = async () => {
          try {
            const full =
              await FineliService.getById(
                initialMapping.fineliId
              );

            if (cancelled) {
              return;
            }

            if (full) {
              /*
               * Tämä antaa selectedille kaikki Fineli-tuotteen
               * tiedot ja kaikki sen yksiköt.
               */
              setSelected(full);

              /*
               * Palautetaan juuri tallennettu yksikkö.
               *
               * Esimerkiksi KPL_M pysyy KPL_M:nä eikä vaihdu
               * G:ksi.
               */
              const savedUnit = findSavedUnit(
                full,
                initialMapping.fineliUnit
              );

              setSelectedUnit(savedUnit);

              /*
               * Alustus on valmis.
               */
              isInitializingRef.current = false;

              return;
            }
          } catch (err) {
            /*
             * Jos haku epäonnistuu, käytetään fallbackia.
             */
          }

          if (cancelled) {
            return;
          }

          /*
           * Fallback: käytetään tallennettua yksikköä sellaisenaan.
           */
          let savedUnit =
            initialMapping.fineliUnit ?? null;

          if (savedUnit && typeof savedUnit === 'string') {
            savedUnit = {
              code: savedUnit,
              name: savedUnit,
              grams: null
            };
          }

          setSelectedUnit(savedUnit);

          setSelected({
            fineliId:
              initialMapping.fineliId,
            name:
              initialMapping.fineliName ||
              `Fineli ${initialMapping.fineliId}`,
            units: savedUnit
              ? [savedUnit]
              : [],
            nutrients:
              initialMapping.nutrients || {}
          });

          isInitializingRef.current = false;
        };

        loadFineli();

        return () => {
          cancelled = true;
        };
      }

      /*
       * Mappingissa ei ole Fineli-ID:tä.
       * Säilytetään mahdollinen yksikkö kuitenkin.
       */
      let savedUnit =
        initialMapping.fineliUnit ?? null;

      if (savedUnit && typeof savedUnit === 'string') {
        savedUnit = {
          code: savedUnit,
          name: savedUnit,
          grams: null
        };
      }

      setSelectedUnit(savedUnit);
      setSelected(null);

      isInitializingRef.current = false;

      return;
    }

    /*
     * Komponentti on jo alustettu.
     *
     * Jos mapping muuttuu non-null -> null, kyseessä on
     * käyttäjän "Poista vastaavuus".
     *
     * Muut non-null -> non-null muutokset jätetään rauhaan,
     * koska ne voivat johtua käyttäjän Min/Max-muutoksista.
     */
    const previous =
      previousInitialMappingRef.current;

    if (previous && !initialMapping) {
      hasInitialMappingRef.current = false;

      setFineliAmountMin('');
      setFineliAmountMax('');
      setSelectedUnit(null);
      setSelected(null);
    }

    previousInitialMappingRef.current =
      initialMapping;
  }, [initialMapping]);

  /*
   * Muodostetaan mapping ja ilmoitetaan siitä parentille.
   */
  useEffect(() => {
    const min = parseFloat(fineliAmountMin);
    const max = parseFloat(fineliAmountMax);
    const gramsPer = getGramsPerUnit(selectedUnit);

    /*
     * Validointi: min/max eivät saa olla negatiivisia
     * ja max >= min.
     */
    if (!isNaN(min) && min < 0) {
      setValidationMessage(
        'Min ei voi olla negatiivinen'
      );
    } else if (!isNaN(max) && max < 0) {
      setValidationMessage(
        'Max ei voi olla negatiivinen'
      );
    } else if (
      !isNaN(min) &&
      !isNaN(max) &&
      max < min
    ) {
      setValidationMessage(
        'Max pitää olla vähintään Min-arvon suuruinen'
      );
    } else {
      setValidationMessage('');
    }

    /*
     * Älä lähetä keskeneräistä mappingia parentille,
     * kun olemassa olevaa tuotetta vasta alustetaan.
     */
    if (isInitializingRef.current) {
      return;
    }

    const mapping = {
      dose: dose ?? null,

      fineliId:
        selected?.fineliId ?? null,

      fineliUnit:
        selectedUnit ?? null,

      fineliAmount: {
        min: !isNaN(min) ? min : null,
        max: !isNaN(max) ? max : null
      },

      fineliDose: {
        min:
          !isNaN(min) && gramsPer != null
            ? min * gramsPer
            : null,

        max:
          !isNaN(max) && gramsPer != null
            ? max * gramsPer
            : null
      }
    };

    if (
      typeof onMappingChange === 'function'
    ) {
      /*
       * Jos mitään Fineli-tietoa ei ole,
       * käsitellään mapping poistettuna.
       */
      const isEmpty =
        !mapping.fineliId &&
        !mapping.fineliUnit &&
        mapping.fineliAmount.min == null &&
        mapping.fineliAmount.max == null;

      if (isEmpty) {
        if (
          lastSentMappingRef.current !== 'null'
        ) {
          lastSentMappingRef.current = 'null';
          onMappingChange(null);
        }
      } else {
        const s = JSON.stringify(mapping);

        if (
          lastSentMappingRef.current !== s
        ) {
          lastSentMappingRef.current = s;
          onMappingChange(mapping);
        }
      }
    }
  }, [
    selected,
    selectedUnit,
    fineliAmountMin,
    fineliAmountMax,
    dose,
    onMappingChange
  ]);

  /*
   * Notify parent about selected item / unit but only after render
   * (avoid setState-in-render warnings).
   */
  useEffect(() => {
    if (typeof onSelect !== 'function') return;

    const payload = selected
      ? {
        ...selected,
        fineliUnit:
          selectedUnit ?? null
      }
      : null;

    const s = JSON.stringify(payload);

    if (
      lastSentSelectRef.current !== s
    ) {
      lastSentSelectRef.current = s;
      onSelect(payload);
    }
  }, [
    selected,
    selectedUnit,
    onSelect
  ]);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>

      <FineliProductSelector
        initialQuery={initialQuery}
        autoSearch={
          autoSearch &&
          !hasInitialMappingRef.current
        }
        debounceMs={debounceMs}
        selectedId={selected?.fineliId || ''}
        onSelect={(item) => {
          if (!item) {
            setSelected(null);
            setSelectedUnit(null);
            return;
          }

          /*
           * Käyttäjä valitsi uuden Fineli-tuotteen.
           * Tällöin ensimmäinen yksikkö eli G on
           * oletuksena oikein.
           */
          hasInitialMappingRef.current = false;

          setSelected(item);

          setSelectedUnit(
            item.units?.[0] ?? null
          );
        }}
      />


      {selected && (
        <div>
          <FineliDoseItem>
            <div>
              <div>
                <label>Min</label>
                <InputQuantity
                  type="number"
                  value={fineliAmountMin}
                  onChange={e => setFineliAmountMin(e.target.value)}
                  min={0}
                  onBlur={() => {
                    if (fineliAmountMin !== '') {
                      const n = parseFloat(fineliAmountMin);
                      if (!isNaN(n) && n < 0) setFineliAmountMin('0');
                    }
                  }}
                  placeholder="min"
                />
              </div>

              <div>
                <label>Max</label>
                <InputQuantity
                  type="number"
                  value={fineliAmountMax}
                  onChange={e => setFineliAmountMax(e.target.value)}
                  min={0}
                  onBlur={() => {
                    if (fineliAmountMax !== '') {
                      const n = parseFloat(fineliAmountMax);
                      if (!isNaN(n) && n < 0) setFineliAmountMax('0');
                    }
                  }}
                  placeholder="max"
                />
              </div>

              <div>
                <label>Yksikkö</label>
                <FineliSelect
                  value={selectedUnit?.code || ''}
                  onChange={e => {
                    const code = e.target.value;
                    const unit = selected.units?.find(u => u.code === code);
                    setSelectedUnit(unit ?? null);
                    // onSelect is handled in useEffect to avoid setState during render
                  }}
                >
                  <option value="">Valitse yksikkö...</option>
                  {selected.units?.map(unit => (
                    <option key={unit.code} value={unit.code}>
                      {unit.name}{unit.grams !== null && unit.grams !== undefined ? ` — ${unit.grams} g` : ''}
                    </option>
                  ))}
                </FineliSelect>
              </div>
            </div>

          </FineliDoseItem>

          <div style={{ marginTop: 8 }}>
            {validationMessage && <div style={{ color: 'red' }}>{validationMessage}</div>}

            <div style={{ fontSize: 13, marginTop: 6 }}>
              {(() => {
                const min = parseFloat(fineliAmountMin);
                const max = parseFloat(fineliAmountMax);
                const gramsPer = getGramsPerUnit(selectedUnit);

                if (!selectedUnit) return 'Valitse yksikkö, jotta määrät voidaan laskea.';
                if (isNaN(min) && isNaN(max)) return 'Anna min tai max arvo.';

                const minGrams = !isNaN(min) && gramsPer != null ? (min * gramsPer) : null;
                const maxGrams = !isNaN(max) && gramsPer != null ? (max * gramsPer) : null;

                return (
                  <div>
                    Vastaavuus: {minGrams != null ? `${minGrams} g` : '—'} — {maxGrams != null ? `${maxGrams} g` : '—'}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}


      {selected && (
        <div style={{ marginTop: 12 }}>
          <div style={{ overflowX: 'auto' }}>
            {(() => {
              const min = parseFloat(fineliAmountMin);
              const max = parseFloat(fineliAmountMax);
              const gramsPer = getGramsPerUnit(selectedUnit);
              const minGrams = !isNaN(min) && gramsPer != null ? (min * gramsPer) : null;
              const maxGrams = !isNaN(max) && gramsPer != null ? (max * gramsPer) : null;
              const fmt = v => {
                if (v == null) return '—';
                if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
                return String(Number(v.toFixed(2)));
              };

              return (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                      <th style={{ padding: '6px 8px', fontSize: 12 }}>Ravintoarvot</th>
                      <th style={{ padding: '6px 8px', fontSize: 12 }}>100 g</th>
                      <th style={{ padding: '6px 8px', fontSize: 12 }}>{minGrams != null ? `${fmt(minGrams)} g` : 'min'}</th>
                      <th style={{ padding: '6px 8px', fontSize: 12 }}>{maxGrams != null ? `${fmt(maxGrams)} g` : 'max'}</th>
                      <th style={{ padding: '6px 8px', fontSize: 12 }}>Yksikkö</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutrientDefinitions.map(nutrient => {
                      const per100 = selected.nutrients?.[nutrient.code]?.value ?? null;

                      const computeForGrams = g => {
                        if (g == null || per100 == null) return null;
                        const v = (g / 100) * per100;
                        return Number.isFinite(v) ? v : null;
                      };

                      const minVal = computeForGrams(minGrams);
                      const maxVal = computeForGrams(maxGrams);

                      return (
                        <tr key={nutrient.code} style={{ borderBottom: '1px solid #f2f2f2' }}>
                          <td style={{ padding: '6px 8px', fontSize: 13 }}>{nutrient.name}</td>
                          <td style={{ padding: '6px 8px', fontSize: 12 }}>{per100 != null ? `${fmt(per100)}` : '—'}</td>
                          <td style={{ padding: '6px 8px', fontSize: 12 }}>{fmt(minVal) !== '—' ? `${fmt(minVal)}` : '—'}</td>
                          <td style={{ padding: '6px 8px', fontSize: 12 }}>{fmt(maxVal) !== '—' ? `${fmt(maxVal)}` : '—'}</td>
                          <td style={{ padding: '6px 8px', fontSize: 12 }}>{nutrient.unit}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
}