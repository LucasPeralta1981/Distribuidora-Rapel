// client/src/pages/AdminDashboard.jsx
import React, { useState } from 'react';

const AdminDashboard = () => {
  const [archivo, setArchivo] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // tipo: 'success' | 'error'

  // 1. Manejar la selección del archivo
  const handleFileChange = (e) => {
    const file = e.target.files;
    if (file) {
      setArchivo(file);
      setMensaje({ texto: '', tipo: '' });
      // Aquí podrías agregar una previsualización básica en el frontend si quisieras,
      // pero la validación real la hace el backend.
    }
  };

  // 2. Enviar archivo al Backend
  const handleUpload = async () => {
    if (!archivo) {
      setMensaje({ texto: '⚠️ Por favor selecciona un archivo primero.', tipo: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      // Conexión con tu Backend (asegúrate que el puerto 5000 esté activo)
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ 
          texto: `✅ Éxito! Se cargaron ${data.cantidad} productos al inventario.`, 
          tipo: 'success' 
        });
        setArchivo(null); // Limpiar input
        setPreviewData([]);
      } else {
        setMensaje({ texto: `❌ Error: ${data.error}`, tipo: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMensaje({ texto: '❌ Error de conexión con el servidor. ¿Está corriendo el Backend?', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>📦 Panel de Administración - Distribuidora Lucas</h1>
      <p>Carga tus inventarios de proveedores (Aceites, Herramientas, Cubiertas, Repuestos).</p>

      {/* Sección de Carga */}
      <div style={{ 
        border: '2px dashed #ccc', 
        padding: '2rem', 
        textAlign: 'center', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>1. Selecciona tu archivo</h3>
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileChange} 
          style={{ marginBottom: '1rem' }}
        />
        <br />
        <button 
          onClick={handleUpload} 
          disabled={cargando || !archivo}
          style={{
            padding: '10px 20px',
            backgroundColor: cargando ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: cargando ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {cargando ? '⏳ Procesando...' : '🚀 Subir y Cargar Inventario'}
        </button>
      </div>

      {/* Mensajes de Estado */}
      {mensaje.texto && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: '5px', 
          backgroundColor: mensaje.tipo === 'success' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'success' ? '#155724' : '#721c24',
          marginBottom: '2rem'
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* Tabla de Ejemplo (Vista Previa de lo que se va a cargar) */}
      {/* Nota: En una app real, el backend devolvería los datos parsedos para mostrarlos aquí antes de confirmar */}
      {previewData.length > 0 && (
        <div>
          <h3>2. Vista Previa de Datos (Confirmar)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>SKU</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Categoría</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Costo</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Venta (30%)</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((prod, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prod.sku}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prod.nombre}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prod.categoria}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${prod.precioCosto}</td>
                  <td style={{ border: 'px solid #ddd', padding: '8px' }}>${prod.precioVenta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
