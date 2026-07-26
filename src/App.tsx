import './App.css'
import { CreateJobForm } from './components/CreateJobForm'
import { JobsList } from './components/JobsList';

function App() {
  return (
    <main>
      <CreateJobForm />
      <JobsList />
    </main>
  )
}
export default App
