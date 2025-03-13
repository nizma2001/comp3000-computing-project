

import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './components/Login';
import Layout from './pages/Layout';
import UploadFile from './pages/UploadFile';
import SearchFile from './pages/SearchFile';
import AdminPage from './pages/AdminPage';
import UserPage  from "./pages/UserPage";
//port { Router } from "express";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<Layout/>}>
       <Route index element={<Login/>} />

        {/* Protected routes for both admin & user */}

        <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
          <Route path="search" element={<SearchFile />} />
        </Route>

        {/* Protected routes for user only */}

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
         <Route path="userdashboard" element={<UserPage />} />
        </Route>

        {/* Protected routes for admin only */}

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
           <Route path="upload" element={<UploadFile />} />
        </Route>

      </Route>
    </Routes>
  </BrowserRouter>

  );
}

export default App;
