import { useEffect, useState } from 'react';
import { profesionalesApi, especialidadesApi } from '../api/resources.js';

export default function ProfesionalesPage({ isAdmin }) {
  const [items, setItems] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState(null); // 'create' | 'edit' | null
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    matricula: '',
    password: '',
    id_especialidad: '',
    activo: true,
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profesionales, especialidades] = await Promise.all([
        profesionalesApi.list(),
        especialidadesApi.list(),
      ]);
      setItems(profesionales);
      setEspecialidades(especialidades);
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
    setForm({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      matricula: '',
      password: '',
      id_especialidad: '',
      activo: true,
    });
    setFormError(null);
  };

  const startEdit = (p) => {
    setMode('edit');
    setEditingId(p.id_profesional);
    setForm({
      nombre: p.nombre || '',
      apellido: p.apellido || '',
      email: p.email || '',
      telefono: p.telefono || '',
      matricula: p.matricula || '',
      password: '',
      id_especialidad: p.id_especialidad?.toString() || '',
      activo: Boolean(p.activo ?? true),
    });
    setFormError(null);
  };

  const cancelForm = () => {
    setMode(null);
    setEditingId(null);
    setFormError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    setFormError(null);
    try {
      const base = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono || undefined,
        matricula: form.matricula,
        id_especialidad: form.id_especialidad ? Number(form.id_especialidad) : undefined,
        activo: form.activo,
      };

      if (mode === 'create') {
        await profesionalesApi.create({
          ...base,
          password: form.password,
        });
      } else if (mode === 'edit' && editingId != null) {
        const payload = { ...base };
        if (form.password) {
          payload.password = form.password;
        }
        await profesionalesApi.update(editingId, payload);
      }

      await load();
      cancelForm();
    } catch (e2) {
      setFormError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('¿Eliminar profesional?')) return;
    try {
      await profesionalesApi.remove(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  const getEspecialidadNombre = (id) => {
    const e = especialidades.find((x) => x.id_especialidad === id);
    return e ? e.nombre_especialidad : id;
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Profesionales</h2>
        <div className="flex items-center gap-2 text-xs">
          {isAdmin && (
            <button
              onClick={startCreate}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500"
            >
              Nuevo profesional
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
            {mode === 'create' ? 'Crear profesional' : 'Editar profesional'}
          </h3>
          {formError && (
            <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Apellido</label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Matrícula</label>
              <input
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                placeholder={mode === 'edit' ? 'Dejar vacío para no cambiar' : ''}
                required={mode === 'create'}
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Especialidad</label>
              <select
                name="id_especialidad"
                value={form.id_especialidad}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              >
                <option value="">Seleccionar...</option>
                {especialidades.map((e) => (
                  <option key={e.id_especialidad} value={e.id_especialidad}>
                    {e.nombre_especialidad}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input
                id="prof-activo"
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
                className="h-3 w-3"
              />
              <label htmlFor="prof-activo" className="text-xs text-slate-700">
                Activo
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
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Matrícula</th>
                <th className="px-3 py-2 text-left">Especialidad</th>
                <th className="px-3 py-2 text-left">Activo</th>
                {isAdmin && <th className="px-3 py-2 text-left">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id_profesional} className="border-t border-slate-100">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {p.nombre} {p.apellido}
                  </td>
                  <td className="px-3 py-2">{p.email}</td>
                  <td className="px-3 py-2">{p.matricula}</td>
                  <td className="px-3 py-2">{getEspecialidadNombre(p.id_especialidad)}</td>
                  <td className="px-3 py-2">{p.activo ? 'Sí' : 'No'}</td>
                  {isAdmin && (
                    <td className="px-3 py-2 space-x-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-xs text-sky-700 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => remove(p.id_profesional)}
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
                    colSpan={isAdmin ? 6 : 5}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    No hay profesionales registrados.
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
