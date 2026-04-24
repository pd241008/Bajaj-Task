import { useState } from "react";
import { BfhlResponse } from "../types/bfhl";
import { API_ENDPOINTS } from "../utils/constants";

export const useBfhl = () => {
  const [response, setResponse] = useState<BfhlResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeBfhl = async (input: string) => {
    setError(null);
    setResponse(null);

    const rawItems = input
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (rawItems.length === 0) {
      setError("Please enter at least one edge (e.g. A->B)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.BFHL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes: rawItems }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: BfhlResponse = await res.json();
      setResponse(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to reach the API: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResponse(null);
    setError(null);
  };

  return { response, loading, error, executeBfhl, clear };
};
