import { useCallback, useEffect, useState } from "react";

// Types for useQuery
/**
 * @typedef {Object} UseQueryOptions
 * @property {Array} queryKey
 * @property {Function} queryFn
 * @property {boolean} [enabled=true]
 */

/**
 * @typedef {Object} UseQueryResult
 * @property {TData | null} data
 * @property {boolean} isLoading
 * @property {Error | null} error
 * @property {Function} refetch
 * @property {boolean} fetched
 */

// Custom useQuery Hook
const useQuery = ({ queryFn, enabled = true }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const refetch = () => {
    setIsLoading(true);
    queryFn()
      .then((response) => {
        setData(response);
        setIsLoading(false);
        setFetched(true);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, []);

  return { data, isLoading, error, refetch, fetched };
};

// Types for useMutation
/**
 * @typedef {Object} UseMutationOptions
 * @property {Function} mutationFn
 * @property {Function} [onSuccess]
 * @property {Function} [onError]
 */

/**
 * @typedef {Object} UseMutationResult
 * @property {Function} mutate
 * @property {boolean} isPending
 * @property {Error | null} error
 */

// Custom useMutation Hook
const useMutation = ({ mutationFn, onSuccess, onError }) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (variables) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await mutationFn(variables);
        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        setError(err);
        if (onError) {
          onError(err);
        }
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return { mutate, isPending, error };
};

export { useQuery, useMutation };
