import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

export const useHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    checkHealth()
      .then((data) => {
        if (isMounted) {
          setHealth(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to connect to backend');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { health, loading, error };
};
