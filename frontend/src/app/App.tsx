import './App.css';
import AppRouter from './AppRouter';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { useEffect } from 'react';
import { verifySession } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

import SideNavBar from '../components/SideNavBar';


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAutheticated);


  useEffect(() => {
    dispatch(verifySession());
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-pearl-aqua-50 dark:bg-pacific-blue-950 text-dusty-grape-900 dark:text-dusty-grape-100 transition-colors">
      <Navbar />
      <div className="flex flex-1">
        {isAuthenticated && <SideNavBar />}
        <main className="flex-1 flex flex-col">
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

export default App;
