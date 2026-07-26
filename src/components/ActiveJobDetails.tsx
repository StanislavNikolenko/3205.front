import { useEffect, useState } from 'react'
import { getJobResults, type UrlResult } from '../api/jobs'
import { useJobStore } from '../store/jobStore'

function isProcessed(status: UrlResult['status']) {
  return status === 'success' || status === 'error' || status === 'cancelled'
}

export function ActiveJobDetails() {
  const activeJobId = useJobStore((s) => s.activeJobId)
  const [results, setResults] = useState<UrlResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!activeJobId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobResults(activeJobId!);
        if (!cancelled) setResults(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    const timer = setInterval(async () => {
      try {
        const data = await getJobResults(activeJobId!);
        if (cancelled) return;
        setResults(data);
        const allDone = data.every((r) => isProcessed(r.status))
        if (allDone) clearInterval(timer);
      } catch (e) {
        console.error(e);
      }
    }, 1500);

    return () => {
      cancelled = true;
      clearInterval(timer);
    }
  }, [activeJobId])

  if (!activeJobId) {
    return <p>Выберите задание из списка</p>
  }

  if (loading && results.length === 0) {
    return <p>Загрузка деталей…</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  const total = results.length
  const done = results.filter((r) => isProcessed(r.status)).length

  return (
    <section className="job-details">
      <h3>Подробная информация по задаче:</h3>
      <p>ID: {activeJobId}</p>
      <p>
        Прогресс: {done} из {total} обработано
      </p>

      <ul>
        {results.map((r) => (
          <li key={r.url}>
            <div>{r.url}</div>
            <div>Статус: {r.status}</div>
            {r.httpStatusCode != null && (
              <div>HTTP: {r.httpStatusCode}</div>
            )}
            {r.error && <div>Ошибка: {r.error}</div>}
          </li>
        ))}
      </ul>
    </section>
  )
}