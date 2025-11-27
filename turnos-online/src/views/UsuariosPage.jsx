import { useEffect, useState } from 'react';
import { usuariosApi } from '../api/resources.js';

export default function UsuariosPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailQuery, setEmailQuery] = useState('');
  const [emailResult, setEmailResult] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuariosApi.list();
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const searchByEmail = async (e) => {
    e.preventDefault();
    if (!emailQuery) return;
    setError(null);
    try {
      const user = await usuariosApi.byEmail(emailQuery);
      setEmailResult(user);
    } catch (e2) {
      setEmailResult(null);
      setError(e2.message);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Usuarios</h2>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Actualizar
        </button>
      </header>
      <form onSubmit={searchByEmail} className="flex items-center gap-2 text-sm">
        <input
          type="email"
          placeholder="Buscar por email"
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
          className="flex-1 border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800 text-xs"
        >
          Buscar
        </button>
      </form>
      {emailResult && (
        <div className="bg-white rounded-lg shadow p-3 text-xs">
          <div className="font-semibold mb-1">Resultado búsqueda</div>
          <div>{emailResult.nombre} {emailResult.apellido} ({emailResult.email})</div>
          <div className="text-slate-600 text-[11px]">Rol: {emailResult.rol?.nombre_rol ?? '-'}</div>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <p className="text-sm text-slate-600 p-3">Cargando...</p>
        ) : (
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr className='font-mono'>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">DNI</th>
                <th className="px-3 py-2 text-left">Rol</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id_usuario} className="border-t border-slate-100 font-mono">
                  <td className="px-3 py-2">
                    {u.nombre} {u.apellido}
                  </td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.dni}</td>
                  <td className="px-3 py-2">{u.rol?.nombre_rol ?? '-'}</td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
