import './App.css'
import { CreateJobForm } from './components/CreateJobForm'
import { useJobStore } from './store/jobStore';

function App() {
  const activeJobId = useJobStore((s) => s.activeJobId);
  return (
    <main>
      <CreateJobForm />
      {activeJobId && <p>Активное задание: {activeJobId}</p>}
    </main>
  )
}
export default App
