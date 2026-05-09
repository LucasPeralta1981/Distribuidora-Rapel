import { useState } from 'react';

export default function ProductUploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3001/api/products/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Auth0 token
        }
      });
      if (res.ok) alert('Productos cargados con éxito');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Carga Masiva de Productos</h2>
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept=".xlsx, .csv" 
          onChange={(e) => setFile(e.target.files)} 
          className="mb-4"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Procesando...' : 'Cargar Productos'}
        </button>
      </form>
    </div>
  );
}