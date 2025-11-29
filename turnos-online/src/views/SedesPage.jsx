import { useEffect, useState } from 'react';
import { sedesApi, especialidadesApi } from '../api/resources.js';

export default function SedesPage({ isAdmin }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    activa: true,
    horario_apertura: '',
    horario_cierre: '',
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadesAsignadas, setEspecialidadesAsignadas] = useState([]);
  const [selectedEspecialidadId, setSelectedEspecialidadId] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sedes, esp] = await Promise.all([
        sedesApi.list(),
        especialidadesApi.list(),
      ]);
      setItems(sedes);
      setEspecialidades(esp);
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
      direccion: '',
      telefono: '',
      activa: true,
      horario_apertura: '',
      horario_cierre: '',
    });
    setFormError(null);
    setEspecialidadesAsignadas([]);
    setSelectedEspecialidadId('');
  };

  const startEdit = async (s) => {
    setMode('edit');
    setEditingId(s.id_sede);
    setForm({
      nombre: s.nombre || '',
      direccion: s.direccion || '',
      telefono: s.telefono || '',
      activa: Boolean(s.activa ?? true),
      horario_apertura: s.horario_apertura || '',
      horario_cierre: s.horario_cierre || '',
    });
    setFormError(null);
    try {
      const espec = await sedesApi.especialidades(s.id_sede);
      setEspecialidadesAsignadas(espec);
    } catch (e) {
      console.error(e);
    }
  };

  const cancelForm = () => {
    setMode(null);
    setEditingId(null);
    setFormError(null);
    setEspecialidadesAsignadas([]);
    setSelectedEspecialidadId('');
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
      const payload = {
        nombre: form.nombre,
        direccion: form.direccion || undefined,
        telefono: form.telefono || undefined,
        activa: form.activa,
        horario_apertura: form.horario_apertura || undefined,
        horario_cierre: form.horario_cierre || undefined,
      };
      if (mode === 'create') {
        await sedesApi.create(payload);
      } else if (mode === 'edit' && editingId != null) {
        await sedesApi.update(editingId, payload);
      }
      await load();
      cancelForm();
    } catch (e2) {
      setFormError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  const addEspecialidadToSede = async () => {
    if (!isAdmin || !editingId || !selectedEspecialidadId) return;
    try {
      await sedesApi.addEspecialidad(editingId, Number(selectedEspecialidadId));
      const espec = await sedesApi.especialidades(editingId);
      setEspecialidadesAsignadas(espec);
      setSelectedEspecialidadId('');
    } catch (e) {
      alert(e.message);
    }
  };

  const removeEspecialidadFromSede = async (idEspecialidad) => {
    if (!isAdmin || !editingId) return;
    try {
      await sedesApi.removeEspecialidad(editingId, idEspecialidad);
      const espec = await sedesApi.especialidades(editingId);
      setEspecialidadesAsignadas(espec);
    } catch (e) {
      alert(e.message);
    }
  };

  const remove = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('¿Eliminar sede?')) return;
    try {
      await sedesApi.remove(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Sedes</h2>
        <div className="flex items-center gap-2 text-xs">
          {isAdmin && (
            <button
              onClick={startCreate}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500"
            >
              Nueva sede
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
            {mode === 'create' ? 'Crear sede' : 'Editar sede'}
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
              <label className="block text-slate-600 mb-1">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-600 mb-1">Dirección</label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Horario apertura</label>
              <input
                name="horario_apertura"
                value={form.horario_apertura}
                onChange={handleChange}
                placeholder="08:00"
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Horario cierre</label>
              <input
                name="horario_cierre"
                value={form.horario_cierre}
                onChange={handleChange}
                placeholder="18:00"
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                id="sede-activa"
                type="checkbox"
                name="activa"
                checked={form.activa}
                onChange={handleChange}
                className="h-3 w-3"
              />
              <label htmlFor="sede-activa" className="text-xs text-slate-700">
                Activa
              </label>
            </div>
            {mode === 'edit' && (
              <div className="col-span-2 mt-3 border-t pt-3">
                <div className="text-xs font-semibold mb-2">Especialidades de la sede</div>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <select
                    value={selectedEspecialidadId}
                    onChange={(e) => setSelectedEspecialidadId(e.target.value)}
                    className="border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 flex-1"
                  >
                    <option value="">Seleccionar especialidad...</option>
                    {especialidades.map((e) => (
                      <option key={e.id_especialidad} value={String(e.id_especialidad)}>
                        {e.nombre_especialidad}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addEspecialidadToSede}
                    className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    Agregar
                  </button>
                </div>
                <div className="text-xs bg-slate-50 border border-slate-200 rounded p-2 max-h-40 overflow-y-auto">
                  {especialidadesAsignadas.length === 0 && (
                    <div className="text-slate-500">No hay especialidades asociadas.</div>
                  )}
                  {especialidadesAsignadas.map((e) => (
                    <div
                      key={e.id_especialidad}
                      className="flex items-center justify-between py-0.5"
                    >
                      <span>{e.nombre_especialidad}</span>
                      <button
                        type="button"
                        onClick={() => removeEspecialidadFromSede(e.id_especialidad)}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          <table className="min-w-full text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Dirección</th>
                <th className="px-3 py-2 text-left">Teléfono</th>
                <th className="px-3 py-2 text-left">Horario</th>
                {isAdmin && <th className="px-3 py-2 text-left">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id_sede} className="border-t border-slate-100">
                  <td className="px-3 py-2">{s.nombre}</td>
                  <td className="px-3 py-2">{s.direccion}</td>
                  <td className="px-3 py-2">{s.telefono}</td>
                  <td className="px-3 py-2">
                    {s.horario_apertura || '-'} - {s.horario_cierre || '-'}
                  </td>
                  {isAdmin && (
                    <td className="px-3 py-2 space-x-2">
                      <button
                        onClick={() => startEdit(s)}
                        className="text-xs text-sky-700 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => remove(s.id_sede)}
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
                    colSpan={isAdmin ? 5 : 4}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    No hay sedes registradas.
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
