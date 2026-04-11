import { useEffect, useState } from 'react';
import { getUserProfile } from '../lib/api';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getUserProfile()
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch((err) => {
        if (cancelled) return;
        // "Not logged in" is an expected state, not an error.
        if (err.message === 'Not logged in') {
          setUser(null);
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading, error };
}
