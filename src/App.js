import logo from './logo.svg';
import './App.css';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Navbar from './components/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
// import 'dotenv/config';

function App() {
  const location = useLocation();
  return (
    <div className="App">
      {
        location.pathname !== "/login" && <Navbar/>
      }
      <Routes>
        <Route exact path='/login' element={<Login/>} />
        <Route exact path='/' element={<Dashboard/>} />
      </Routes>
    </div>
  );
}

export default App;
