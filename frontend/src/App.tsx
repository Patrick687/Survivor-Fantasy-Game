import './App.css';
import AppRouter from './router/AppRouter';
import Navbar from './components/Navbar';


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl-aqua-50 dark:bg-pacific-blue-950 text-dusty-grape-900 dark:text-dusty-grape-100 transition-colors">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
