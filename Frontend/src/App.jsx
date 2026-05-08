// client/src/App.jsx
import React from 'react';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#0056b3', 
        color: 'white', 
        padding: '1.5rem', 
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>🛢️ Distribuidora Lucas</h1>
        <p style={{ margin: '0.5rem 0 0', fontSize: '1.1rem', opacity: 0.9 }}>
          Sistema de Ventas y Administración de Aceites y Repuestos
        </p>
      </header>

      {/* Contenido Principal: Tu Panel de Administración */}
      <main style={{ 
        padding: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
        minHeight: '80vh'
      }}>
        <AdminDashboard />
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#f8f9fa', 
        textAlign: 'center', 
        padding: '1rem', 
        marginTop: '2rem',
        borderTop: '1px solid #dee2e6',
        color: '#6c757d'
      }}>
        <p style={{ margin: 0 }}>
          &copy; 2026 Distribuidora Lucas - Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default App;
