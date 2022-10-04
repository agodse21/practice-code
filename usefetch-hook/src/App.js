import logo from './logo.svg';
import './App.css';
import { GithubUsers } from './components/githubUsers';
import useFetch from './hooks/useFetch';

function App() {
  const {data,loading,error}=useFetch();

  return (
    <div className="App">
      <GithubUsers />
    </div>
  );
}

export default App;
