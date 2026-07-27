import { useEffect, useState } from 'react'
import { getJobResults, type Job, type JobResults, type UrlResult } from '../api/jobs'
import { useJobStore } from '../store/jobStore'

function isProcessed(status: UrlResult['status']) {
  return status === 'success' || status === 'error' || status === 'cancelled'
}

type Props = {
  onJobUpdated: (job: Job) => void
}

export function ActiveJobDetails({ onJobUpdated }: Props) {
  const activeJobId = useJobStore((s) => s.activeJobId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobResults | null>(null);
  
  useEffect(() => {
    if (!activeJobId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobResults(activeJobId!);
        if (cancelled) return;
        setJob(data);
        onJobUpdated?.({
            id: data.id,
            status: data.status,
            createdAt: data.createdAt,
            urlCount: data.urlCount,
            urlSuccessCount: data.urlSuccessCount,
            urlErrorCount: data.urlErrorCount,
          });
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
        setJob(data);
        onJobUpdated({
          id: data.id,
          status: data.status,
          createdAt: data.createdAt,
          urlCount: data.urlCount,
          urlSuccessCount: data.urlSuccessCount,
          urlErrorCount: data.urlErrorCount,
        });
        const allDone = data.results.every((r) => isProcessed(r.status));
        if (allDone) clearInterval(timer);
      } catch (e) {
        console.error(e);
      }
    }, 1500);

    return () => {
      cancelled = true;
      clearInterval(timer);
    }
  }, [activeJobId, onJobUpdated]);

  if (!activeJobId) {
    return <p>Выберите задание из списка</p>
  }

  if (loading || !job) {
    return <p>Загрузка деталей…</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  const total = job.results.length;
  const done = job.results.filter((r) => isProcessed(r.status)).length;

  return (
    <section className="job-details">
      <h3>Подробная информация по задаче:</h3>
      <p>ID: {activeJobId}</p>
      <p>
        Прогресс: {done} из {total} обработано
      </p>

      <ul>
        {job.results.map((r) => (
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