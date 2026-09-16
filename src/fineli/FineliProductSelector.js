import React, { useState, useCallback, useEffect, useRef } from 'react';

import useFineli from './useFineli';
import { FineliSelect } from '../components/Input';

export default function FineliProductSelector({
  onSelect,
  initialQuery = '',
  autoSearch = true,
  debounceMs = 300,
  selectedId = '',
}) {
  const [query, setQuery] = useState(initialQuery || '');
  const { results, loading, error, search } = useFineli();
  const [infoMessage, setInfoMessage] = useState('');
  const fineliSelectRef = useRef(null);

  /*
   * Fineli-haku.
   */
  const doSearch = useCallback(async (q) => {
    setInfoMessage('');

    if (!q || !q.trim()) return;

    const res = await search(q);

    if (!res || res.length === 0) {
      onSelect?.(null);
      setInfoMessage('Ei tuloksia');
      return;
    }

    if (res.length === 1) {
      const item = res[0];

      /*
       * Yksi tulos valitaan automaattisesti.
       */
      onSelect?.(item);

      setInfoMessage(
        'Valittu automaattisesti yksi tulos'
      );

      return;
    }

    /*
     * Useita tuloksia:
     * näytetään tuotteen valinta.
     */
    setInfoMessage('');
  }, [search, onSelect]);

  /*
   * Automaattinen haku tuotteen nimellä.
   */
  useEffect(() => {
    if (!autoSearch) return;

    if (!initialQuery || !initialQuery.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      doSearch(initialQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [
    initialQuery,
    autoSearch,
    debounceMs,
    doSearch
  ]);

  /*
   * Avataan Finelin valintalista automaattisesti,
   * kun hakutuloksia on useita.
   *
   * Selain voi estää click()-kutsun, mutta focus toimii
   * ainakin siinä määrin kuin selain sallii.
   */
  useEffect(() => {
    if (
      results.length > 1 &&
      fineliSelectRef.current
    ) {
      fineliSelectRef.current.focus();
    }
  }, [results]);

  return (
    <>
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
                ref={fineliSelectRef}
                value={selectedId || ''}
                onChange={e => {
                  const val = e.target.value;

                  if (!val) {
                    onSelect?.(null);
                    return;
                  }

                  const item = results.find(
                    r =>
                      String(r.fineliId) ===
                      String(val)
                  );

                  if (item) {
                    onSelect?.(item);
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
    </>
  );
}