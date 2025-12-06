import { useEffect, useState } from 'react';
import { type AutomationAction, fetchAutomations } from '../api/automationApi';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAutomations()
      .then((data) => setAutomations(data))
      .catch(() => setError('Failed to load automations'))
      .finally(() => setLoading(false));
  }, []);

  return { automations, loading, error };
}
