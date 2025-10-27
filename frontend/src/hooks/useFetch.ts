import { useState, useEffect } from 'react'

interface UseFetchOptions {
  skip?: boolean
}

interface UseFetchReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (options.skip) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
