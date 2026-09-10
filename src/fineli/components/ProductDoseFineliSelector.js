import React, { useState, useEffect, useRef, useCallback } from 'react';
import useFineli from '../useFineli';

export default function ProductDoseFineliSelector({ onSelect, initialQuery = '', autoSearch = true, debounceMs = 300 }) {
  const [query, setQuery] = useState(initialQuery || '');
  const { results, loading, error, search } = useFineli();
  const [selected, setSelected] = useState(null);
  const [infoMessage, setInfoMessage] = useState('');
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q) => {
  
    setInfoMessage('');
    if (!q || !q.trim()) return;
    const res = await search(q);
    if (!res || res.length === 0) {
      setSelected(null);
      setInfoMessage('Ei tuloksia');
      return;
    }
    if (res.length === 1) {
      const item = res[0];
      setSelected(item);
      if (onSelect) onSelect(item);
      setInfoMessage('Valittu automaattisesti yksi tulos');
      return;
    }
    setSelected(null);
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
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setInfoMessage(''); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); doSearch(query); } }}
          placeholder="Kirjoita tuotteen nimi"
          style={{ width: '100%', padding: 6 }}
        />
        <div style={{ marginTop: 6 }}>
          <button onClick={() => doSearch(query)} disabled={loading} style={{ padding: '6px 10px' }}>Hae</button>
        </div>
      </div>

      {loading && <div>Haetaan...</div>}
      {error && <div style={{ color: 'red' }}>Virhe haussa</div>}
      {infoMessage && <div style={{ color: '#333', marginTop: 6 }}>{infoMessage}</div>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map(r => (
          <li key={r.fineliId} style={{ padding: 6, borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>ID: {r.fineliId}</div>
              </div>
              <div>
                <button onClick={() => { setSelected(r); if (onSelect) onSelect(r); }} style={{ marginLeft: 8 }}>Valitse</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: 8, padding: 8, background: '#fafafa', borderRadius: 4 }}>
          <div style={{ fontWeight: 700 }}>Valittu: {selected.name}</div>
          <div style={{ fontSize: 13 }}>
            Energia: {selected.nutrients?.ENERC ? `${selected.nutrients.ENERC.value} ${selected.nutrients.ENERC.unit}` : '—'}
          </div>
        </div>
      )}
    </div>
  );
}
