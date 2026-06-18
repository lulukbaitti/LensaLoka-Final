import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TemplatePicker } from './pages/TemplatePicker';
import { CameraCapture } from './pages/CameraCapture';
import { Gallery } from './pages/Gallery';
import { EditPhoto } from './pages/EditPhoto';
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/create"
            element={
            <ProtectedRoute>
                <TemplatePicker />
              </ProtectedRoute>
            } />
          
          <Route
            path="/capture/:templateId"
            element={
            <ProtectedRoute>
                <CameraCapture />
              </ProtectedRoute>
            } />
          
          <Route
            path="/gallery"
            element={
            <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            } />
          
          <Route
            path="/edit/:photoId"
            element={
            <ProtectedRoute>
                <EditPhoto />
              </ProtectedRoute>
            } />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>);

}