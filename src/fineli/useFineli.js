import { useState, useCallback } from 'react';
import FineliService from './FineliService';

export default function useFineli() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    setLoading(true);
    setError(null);

    try {
      const res = await FineliService.search(query);
      setResults(res);
      return res;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
