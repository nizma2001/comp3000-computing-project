

import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './components/Login';
import Layout from './pages/Layout';
import UploadFile from './pages/UploadFile';
import SearchFile from './pages/SearchFile';
import AdminPage from './pages/AdminPage';
//port { Router } from "express";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<Layout/>}>
       <Route index element={<Login/>} />

        {/* Protected Routes - Only accessible if logged in */}

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="upload" element={<UploadFile />} />
          <Route path="search" element={<SearchFile />} />
        </Route>

      </Route>
    </Routes>
  </BrowserRouter>

  );
}

export default App;
