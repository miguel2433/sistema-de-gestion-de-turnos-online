import { useEffect, useState } from 'react';
import { especialidadesApi } from '../api/resources.js';

export default function EspecialidadesPage({ isAdmin }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre_especialidad: '',
    descripcion: '',
    activa: true,
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await especialidadesApi.list();
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

  const startCreate = () => {
    setMode('create');
    setEditingId(null);
    setForm({ nombre_especialidad: '', descripcion: '', activa: true });
    setFormError(null);
  };

  const startEdit = (e) => {
    setMode('edit');
    setEditingId(e.id_especialidad);
    setForm({
      nombre_especialidad: e.nombre_especialidad || '',
      descripcion: e.descripcion || '',
      activa: Boolean(e.activa ?? true),
    });
    setFormError(null);
  };

  const cancelForm = () => {
    setMode(null);
    setEditingId(null);
    setFormError(null);
  };

  const handleChange = (ev) => {
    const { name, value, type, checked } = ev.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        nombre_especialidad: form.nombre_especialidad,
        descripcion: form.descripcion || undefined,
        activa: form.activa,
      };
      if (mode === 'create') {
        await especialidadesApi.create(payload);
      } else if (mode === 'edit' && editingId != null) {
        await especialidadesApi.update(editingId, payload);
      }
      await load();
      cancelForm();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('¿Eliminar especialidad?')) return;
    try {
      await especialidadesApi.remove(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Especialidades</h2>
        <div className="flex items-center gap-2 text-xs">
          {isAdmin && (
            <button
              onClick={startCreate}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500"
            >
              Nueva especialidad
            </button>
          )}
          <button
            onClick={load}
            className="px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800"
          >
            Actualizar
          </button>
        </div>
      </header>

      {mode && isAdmin && (
        <div className="bg-white rounded-lg shadow p-4 text-sm">
          <h3 className="font-semibold text-slate-800 mb-3">
            {mode === 'create' ? 'Crear especialidad' : 'Editar especialidad'}
          </h3>
          {formError && (
            <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-600 mb-1">Nombre</label>
              <input
                name="nombre_especialidad"
                value={form.nombre_especialidad}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-600 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                id="esp-activa"
                type="checkbox"
                name="activa"
                checked={form.activa}
                onChange={handleChange}
                className="h-3 w-3"
              />
              <label htmlFor="esp-activa" className="text-xs text-slate-700">
                Activa
              </label>
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-2 text-xs">
              <button
                type="button"
                onClick={cancelForm}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-600">Cargando...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Descripción</th>
                {isAdmin && <th className="px-3 py-2 text-left">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id_especialidad} className="border-t border-slate-100">
                  <td className="px-3 py-2">{e.id_especialidad}</td>
                  <td className="px-3 py-2">{e.nombre_especialidad}</td>
                  <td className="px-3 py-2">{e.descripcion}</td>
                  {isAdmin && (
                    <td className="px-3 py-2 space-x-2">
                      <button
                        onClick={() => startEdit(e)}
                        className="text-xs text-sky-700 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => remove(e.id_especialidad)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={isAdmin ? 4 : 3}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    No hay especialidades registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
