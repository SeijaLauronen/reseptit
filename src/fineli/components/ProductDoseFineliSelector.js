import React, { useState, useEffect, useRef, useCallback } from 'react';
import useFineli from '../useFineli';
import { nutrientDefinitions } from '../nutrients';
import { FineliSelect } from '../../components/Input';

export default function ProductDoseFineliSelector({ onSelect, initialQuery = '', autoSearch = true, debounceMs = 300 }) {
  const [query, setQuery] = useState(initialQuery || '');
  const { results, loading, error, search } = useFineli();
  const [selected, setSelected] = useState(null);
  const [infoMessage, setInfoMessage] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q) => {
    setInfoMessage('');
    if (!q || !q.trim()) return;
    const res = await search(q);
    if (!res || res.length === 0) {
      setSelected(null);
      setInfoMessage('Ei tuloksia');
      setDropdownOpen(false);
      return;
    }
    if (res.length === 1) {
      const item = res[0];
      setSelected(item);
      if (onSelect) onSelect(item);
      setInfoMessage('Valittu automaattisesti yksi tulos');
      setDropdownOpen(false);
      return;
    }
    // multiple results: show dropdown
    setSelected(null);
    setDropdownOpen(true);
  }, [onSelect, search]);


  // Ei lähdetä hakemaan automaattisesti heti kun lomake avataan!
  /*
  useEffect(() => {
    setQuery(initialQuery || '');
    if (autoSearch && initialQuery && initialQuery.trim()) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        doSearch(initialQuery);
      }, debounceMs);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [initialQuery, autoSearch, debounceMs, doSearch]);
  */

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Hae Finelistä</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setInfoMessage(''); }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); doSearch(query); } }}
            placeholder="Kirjoita tuotteen nimi"
            style={{ width: '100%', padding: 6 }}
          />
          <button onClick={() => doSearch(query)} disabled={loading} style={{ padding: '6px 10px' }}>Hae</button>

          {results && results.length > 0 && (
            <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
              <FineliSelect value={selected?.fineliId || ''} onChange={e => {
                const val = e.target.value;
                if (!val) {
                  setSelected(null);
                  if (onSelect) onSelect(null);
                  return;
                }
                const item = results.find(r => String(r.fineliId) === String(val));
                if (item) {
                  setSelected(item);
                  if (onSelect) onSelect(item);
                }
              }} >
                <option value="">Valitse tuote...</option>
                {results.map(r => (
                  <option key={r.fineliId} value={r.fineliId}>{r.name} (ID: {r.fineliId})</option>
                ))}
              </FineliSelect>
            </div>
          )}
        </div>
      </div>

      {loading && <div>Haetaan...</div>}
      {error && <div style={{ color: 'red' }}>Virhe haussa</div>}
      {infoMessage && <div style={{ color: '#333', marginTop: 6 }}>{infoMessage}</div>}

      {selected && (
        <div style={{ marginTop: 8 }}>
          {nutrientDefinitions.map(nutrient => {
            const value = selected.nutrients?.[nutrient.code];

            return (
              <div key={nutrient.code} style={{ fontSize: 13 }}>
                {nutrient.name}: {value ? `${value.value} ${value.unit}` : '—'}
              </div>
            );
          })}
        </div>
      )}

      {/* results rendered inline inside the search grid to align edges */}
    </div>
  );
}
