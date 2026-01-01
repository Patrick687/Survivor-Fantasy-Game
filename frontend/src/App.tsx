import './App.css';
import AppRouter from './router/AppRouter';
import Navbar from './components/Navbar';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from './store';
import { useEffect } from 'react';
import { verifySession } from './store/authSlice';
import { useNavigate } from 'react-router-dom';


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(verifySession());
    navigate('/');
  }, [dispatch, navigate]);

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
