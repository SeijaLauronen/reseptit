import React, { useState, useCallback, useEffect, useRef } from 'react';
import useFineli from '../useFineli';
import FineliService from '../FineliService';
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
  const [query, setQuery] = useState(initialQuery || '');
  const { results, loading, error, search } = useFineli();
  const [selected, setSelected] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [infoMessage, setInfoMessage] = useState('');
  const [fineliAmountMin, setFineliAmountMin] = useState('');
  const [fineliAmountMax, setFineliAmountMax] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const lastSentMappingRef = useRef(null);
  const lastSentSelectRef = useRef(null);
  const lastInitialMappingRef = useRef(null);
  const skipNextEmitRef = useRef(false);
  const getGramsPerUnit = (unit) => {
    if (!unit) return null;
    if (unit.code === 'G') return 1;
    if (unit.name && /^\s*g(ram)?s?\.?$/i.test(unit.name)) return 1;
    if (unit.grams != null && !Number.isNaN(Number(unit.grams))) return Number(unit.grams);
    return null;
  };

  // Prefill from initial mapping when provided (mount or mapping change)
  useEffect(() => {
    // Dedupe by stringified value to avoid repeated effects from equivalent objects
    const nextS = initialMapping == null ? 'null' : (() => {
      try { return JSON.stringify(initialMapping); } catch (e) { return String(initialMapping); }
    })();
    if (lastInitialMappingRef.current === nextS) return;
    lastInitialMappingRef.current = nextS;

    if (!initialMapping) {
      // clear internal state when initialMapping explicitly set to null
      setFineliAmountMin('');
      setFineliAmountMax('');
      setSelectedUnit(null);
      setSelected(null);
      // when clearing mapping, allow next mapping emission to run
      skipNextEmitRef.current = false;
      return;
    }

    setFineliAmountMin(initialMapping.fineliAmount?.min ?? '');
    setFineliAmountMax(initialMapping.fineliAmount?.max ?? '');

    // If there's a fineliId, try to load the full item so unit select shows all options
    if (initialMapping.fineliId) {
      (async () => {
        try {
          const full = await FineliService.getById(initialMapping.fineliId);
          if (full) {
            setSelected(full);

            // find unit by code or by name
            let targetUnit = initialMapping.fineliUnit ?? null;
            if (targetUnit) {
              if (typeof targetUnit === 'string') {
                targetUnit = full.units?.find(u => u.code === targetUnit || u.name === targetUnit) ?? { code: targetUnit, name: targetUnit, grams: null };
              } else {
                // object with code/name
                targetUnit = full.units?.find(u => u.code === targetUnit.code || u.name === targetUnit.name) ?? targetUnit;
              }
            }
            setSelectedUnit(targetUnit ?? null);
            // we've just applied the initial mapping from props — skip emitting it back to parent once
            skipNextEmitRef.current = true;
            return;
          }
        } catch (err) {
          // fallback to minimal placeholder below
        }

        // fallback: normalise unit: allow stored unit to be either a code string or an object
        let unit = initialMapping.fineliUnit ?? null;
        if (unit && typeof unit === 'string') {
          unit = { code: unit, name: unit, grams: null };
        }
        setSelectedUnit(unit);
        setSelected({
          fineliId: initialMapping.fineliId,
          name: initialMapping.fineliName || `Fineli ${initialMapping.fineliId}`,
          units: unit ? [unit] : [],
          nutrients: initialMapping.nutrients || {}
        });
        // applied fallback initial mapping — skip emitting it back to parent once
        skipNextEmitRef.current = true;
      })();
    } else {
      // no fineliId, just set unit/min/max
      let unit = initialMapping.fineliUnit ?? null;
      if (unit && typeof unit === 'string') unit = { code: unit, name: unit, grams: null };
      setSelectedUnit(unit);
      // applied initial mapping without fineliId — skip emitting once
      skipNextEmitRef.current = true;
    }
  }, [initialMapping]);

  useEffect(() => {
    if (skipNextEmitRef.current) {
      // consume the skip flag once and don't emit mapping on initial prefill
      skipNextEmitRef.current = false;
      return;
    }
    const min = parseFloat(fineliAmountMin);
    const max = parseFloat(fineliAmountMax);
    const gramsPer = getGramsPerUnit(selectedUnit);

    // validation: min/max non-negative and max >= min
    if (!isNaN(min) && min < 0) {
      setValidationMessage('Min ei voi olla negatiivinen');
    } else if (!isNaN(max) && max < 0) {
      setValidationMessage('Max ei voi olla negatiivinen');
    } else if (!isNaN(min) && !isNaN(max) && max < min) {
      setValidationMessage('Max pitää olla vähintään Min-arvon suuruinen');
    } else {
      setValidationMessage('');
    }

    const mapping = {
      dose: dose ?? null,
      fineliId: selected?.fineliId ?? null,
      fineliUnit: selectedUnit ?? null,
      fineliAmount: {
        min: !isNaN(min) ? min : null,
        max: !isNaN(max) ? max : null
      },
      fineliDose: {
        min: !isNaN(min) && gramsPer != null ? min * gramsPer : null,
        max: !isNaN(max) && gramsPer != null ? max * gramsPer : null
      }
    };

    if (typeof onMappingChange === 'function') {
      // If nothing is selected and amounts are empty, treat as cleared mapping and emit null
      const isEmpty = !mapping.fineliId && !mapping.fineliUnit && mapping.fineliAmount.min == null && mapping.fineliAmount.max == null;
      if (isEmpty) {
        if (lastSentMappingRef.current !== 'null') {
          lastSentMappingRef.current = 'null';
          onMappingChange(null);
        }
      } else {
        const s = JSON.stringify(mapping);
        if (lastSentMappingRef.current !== s) {
          lastSentMappingRef.current = s;
          onMappingChange(mapping);
        }
      }
    }
  }, [selected, selectedUnit, fineliAmountMin, fineliAmountMax, dose, onMappingChange]);

  // Notify parent about selected item / unit but only after render (avoid setState-in-render warnings).
  useEffect(() => {
    if (typeof onSelect !== 'function') return;
    const payload = selected ? { ...selected, fineliUnit: selectedUnit ?? null } : null;
    const s = JSON.stringify(payload);
    if (lastSentSelectRef.current !== s) {
      lastSentSelectRef.current = s;
      onSelect(payload);
    }
  }, [selected, selectedUnit, onSelect]);

  const doSearch = useCallback(async (q) => {
    setInfoMessage('');

    if (!q || !q.trim()) return;

    const res = await search(q);

    if (!res || res.length === 0) {
      setSelected(null);
      setSelectedUnit(null);
      setInfoMessage('Ei tuloksia');
      return;
    }

    if (res.length === 1) {
      const item = res[0];

      setSelected(item);

      // Valitaan ensimmäiseksi tarjolla oleva yksikkö eli G
      setSelectedUnit(item.units?.[0] ?? null);

      setInfoMessage('Valittu automaattisesti yksi tulos');
      return;
    }

    // Useita tuloksia: näytetään tuotteen valinta
    setSelected(null);
    setSelectedUnit(null);
  }, [onSelect, search]);


  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>

      <div style={{ marginBottom: 8 }}>

        <label
          style={{
            display: 'block',
            fontSize: 12,
            marginBottom: 4
          }}
        >
          Hae Finelistä
        </label>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 8,
            alignItems: 'center'
          }}
        >

          <input
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setInfoMessage('');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                doSearch(query);
              }
            }}
            placeholder="Kirjoita tuotteen nimi"
            style={{
              width: '100%',
              padding: 6
            }}
          />

          <button
            onClick={() => doSearch(query)}
            disabled={loading}
            style={{
              padding: '6px 10px'
            }}
          >
            Hae
          </button>

          {results && results.length > 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                marginTop: 8
              }}
            >

              <FineliSelect
                value={selected?.fineliId || ''}
                onChange={e => {
                  const val = e.target.value;

                  if (!val) {
                    setSelected(null);
                    setSelectedUnit(null);

                    return;
                  }

                  const item = results.find(
                    r => String(r.fineliId) === String(val)
                  );

                  if (item) {
                    setSelected(item);

                    // G on aina ensimmäisenä
                    setSelectedUnit(item.units?.[0] ?? null);
                  }
                }}
              >

                <option value="">
                  Valitse tuote...
                </option>

                {results.map(r => (
                  <option
                    key={r.fineliId}
                    value={r.fineliId}
                  >
                    {r.name}
                  </option>
                ))}

              </FineliSelect>

            </div>
          )}

        </div>
      </div>


      {loading && <div>Haetaan...</div>}

      {error && (
        <div style={{ color: 'red' }}>
          Virhe haussa
        </div>
      )}

      {infoMessage && (
        <div
          style={{
            color: '#333',
            marginTop: 6
          }}
        >
          {infoMessage}
        </div>
      )}


      {/* Unit select moved inline with Min/Max below */}

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

