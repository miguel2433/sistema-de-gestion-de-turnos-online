import { useEffect, useState } from 'react';
import {
  turnosApi,
  especialidadesApi,
  profesionalesApi,
  sedesApi,
  usuariosApi,
} from '../api/resources.js';

const ESTADOS = [
  'pendiente',
  'confirmado',
  'atendido',
  'cancelado',
  'no_presentado',
];

export default function TurnosPage({ isAdmin, isProfesional, isUsuario, user }) {
  const [items, setItems] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [especialidadesSede, setEspecialidadesSede] = useState([]);
  const [profesionalesFiltrados, setProfesionalesFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const myProfesional = isProfesional
    ? profesionales.find((p) => p.email && p.email === user?.email)
    : null;

  const [mode, setMode] = useState(null); // 'create' | 'edit' | null
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    fecha_turno: '',
    hora_turno: '',
    estado: 'pendiente',
    motivo_consulta: '',
    observaciones: '',
    id_especialidad: '',
    id_profesional: '',
    id_sede: '',
    id_usuario: '',
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const turnosPromise = isAdmin
        ? turnosApi.list()
        : isProfesional
        ? turnosApi.mineProfesional()
        : turnosApi.mineUsuario();

      const [turnos, esp, prof, sed, us] = await Promise.all([
        turnosPromise,
        especialidadesApi.list(),
        profesionalesApi.list(),
        sedesApi.list(),
        usuariosApi.list(),
      ]);
      setItems(turnos);
      setEspecialidades(esp);
      setProfesionales(prof);
      setSedes(sed);
      setUsuarios(us);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const canEditEstado = (t) => {
    if (isAdmin) return true;
    if (isUsuario && user?.id_usuario === t.id_usuario) return true;
    if (isProfesional && myProfesional && t.id_profesional === myProfesional.id_profesional) return true;
    return false;
  };

  const handleChangeEstado = async (t, nuevoEstado) => {
    try {
      await turnosApi.updateEstado(t.id_turno, nuevoEstado);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    if (!(isAdmin || isUsuario)) return;
    setMode('create');
    setEditingId(null);
    setForm({
      fecha_turno: '',
      hora_turno: '',
      estado: 'pendiente',
      motivo_consulta: '',
      observaciones: '',
      id_especialidad: '',
      id_profesional: '',
      id_sede: '',
      id_usuario: '',
    });
    setFormError(null);
    setEspecialidadesSede([]);
    setProfesionalesFiltrados([]);
  };

  const startEdit = (t) => {
    setMode('edit');
    setEditingId(t.id_turno);
    setForm({
      fecha_turno: t.fecha_turno || '',
      hora_turno: t.hora_turno || '',
      estado: t.estado || 'pendiente',
      motivo_consulta: t.motivo_consulta || '',
      observaciones: t.observaciones || '',
      id_especialidad: t.especialidad?.id_especialidad?.toString() || '',
      id_profesional: t.id_profesional?.toString() || '',
      id_sede: t.id_sede?.toString() || '',
      id_usuario: t.id_usuario?.toString() || '',
    });
    setFormError(null);
  };

  const cancelForm = () => {
    setMode(null);
    setEditingId(null);
    setFormError(null);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    console.log(`[handleChange] name=${name}, value=${value}`);
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'id_sede') {
      console.log(`[handleChange] Cambiando sede a: ${value} -> limpiando especialidad y profesional`);
      setForm((prev) => ({ ...prev, id_especialidad: '', id_profesional: '' }));
      setEspecialidadesSede([]);
      setProfesionalesFiltrados([]);
      if (value) {
        try {
          const espec = await sedesApi.especialidades(value);
          setEspecialidadesSede(espec);
          console.log(`[handleChange] Especialidades cargadas para sede ${value}:`, espec);
        } catch (err) {
          console.error(err);
        }
      }
    }

    if (name === 'id_especialidad') {
      console.log(`[handleChange] Cambiando especialidad a: ${value} -> limpiando profesional`);
      setForm((prev) => ({ ...prev, id_profesional: '' }));
      setProfesionalesFiltrados([]);
      if (value) {
        try {
          const profs = form.id_sede
            ? await profesionalesApi.byEspecialidadEnSede(form.id_sede, value)
            : await profesionalesApi.byEspecialidad(value);
          setProfesionalesFiltrados(profs);
          console.log(`[handleChange] Profesionales cargados para especialidad ${value} en sede ${form.id_sede}:`, profs);
        } catch (err) {
          console.error(err);
        }
      }
    }

    if (name === 'id_profesional') {
      console.log(`[handleChange] Profesional seleccionado: ${value}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(isAdmin || isUsuario)) return;
    setSaving(true);
    setFormError(null);
    console.log(`[handleSubmit] Formulario actual:`, form);
    try {
      const idEspNum = form.id_especialidad ? Number(form.id_especialidad) : undefined;
      const idProfNum = form.id_profesional ? Number(form.id_profesional) : undefined;
      const idSedeNum = form.id_sede ? Number(form.id_sede) : undefined;
      const idUserNum = isUsuario && user?.id_usuario
        ? user.id_usuario
        : form.id_usuario
        ? Number(form.id_usuario)
        : undefined;
      console.log(`[handleSubmit] Números convertidos - idProfNum:`, idProfNum, `form.id_profesional:`, form.id_profesional);
      const payload = {
        fecha_turno: form.fecha_turno,
        hora_turno: (isAdmin || isUsuario) ? (form.hora_turno || undefined) : undefined,
        estado: form.estado || undefined,
        motivo_consulta: form.motivo_consulta || undefined,
        observaciones: form.observaciones || undefined,
        especialidad: {
          id_especialidad: (idEspNum != null && !Number.isNaN(idEspNum)) ? idEspNum : undefined,
        },
        id_profesional: (idProfNum != null && !Number.isNaN(idProfNum)) ? idProfNum : undefined,
        id_sede: (idSedeNum != null && !Number.isNaN(idSedeNum)) ? idSedeNum : undefined,
        id_usuario: (idUserNum != null && !Number.isNaN(idUserNum)) ? idUserNum : undefined,
      };
      console.log(`[handleSubmit] Payload final payload.id_profesional:`, payload.id_profesional, `payload:`, payload);
      if (mode === 'create') {
        console.log(payload)
        await turnosApi.create(payload);
      } else if (mode === 'edit' && editingId != null && isAdmin) {
        await turnosApi.update(editingId, payload);
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
    if (!window.confirm('¿Eliminar turno?')) return;
    try {
      await turnosApi.remove(id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  const getEspecialidadNombre = (t) => {
    if (t.especialidad?.nombre_especialidad) return t.especialidad.nombre_especialidad;
    const e = especialidades.find((x) => x.id_especialidad === t.id_especialidad);
    return e ? e.nombre_especialidad : '-';
  };

  const getProfesionalNombre = (id) => {
    const p = profesionales.find((x) => x.id_profesional === id);
    if (!p) return id;
    return `${p.nombre} ${p.apellido}`;
  };

  const especialidadesOptions = form.id_sede ? especialidadesSede : especialidades;
  const profesionalesOptions = form.id_especialidad ? profesionalesFiltrados : [];

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Turnos</h2>
        <div className="flex items-center gap-2 text-xs">
          {(isAdmin || isUsuario) && (
            <button
              onClick={startCreate}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500"
            >
              Nuevo turno
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

      {mode && (isAdmin || isUsuario) && (
        <div className="bg-white rounded-lg shadow p-4 text-sm">
          <h3 className="font-semibold text-slate-800 mb-3">
            {mode === 'create' ? 'Crear turno' : 'Editar turno'}
          </h3>
          {formError && (
            <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">Fecha</label>
              <input
                type="date"
                name="fecha_turno"
                value={form.fecha_turno}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
            {(isAdmin || isUsuario) && (
              <div>
                <label className="block text-slate-600 mb-1">Hora</label>
                <input
                  type="time"
                  name="hora_turno"
                  value={form.hora_turno}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-slate-600 mb-1">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Especialidad</label>
              <select
                name="id_especialidad"
                value={form.id_especialidad}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
                disabled={!form.id_sede}
              >
                <option value="">Seleccionar...</option>
                {especialidadesOptions.map((e, idx) => (
                  <option key={`esp-${e.id_especialidad}-${idx}`} value={String(e.id_especialidad)}>
                    {e.nombre_especialidad}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Profesional</label>
              <select
                name="id_profesional"
                value={form.id_profesional}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
                disabled={!form.id_especialidad}
              >
                <option value="">Seleccionar...</option>
                {profesionalesOptions.map((p, idx) => (
                  <option key={`prof-${p.id_profesional}-${idx}`} value={String(p.id_profesional)}>
                    {p.nombre} {p.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Sede</label>
              <select
                name="id_sede"
                value={form.id_sede}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              >
                <option value="">Seleccionar...</option>
                {sedes.map((s, idx) => (
                  <option key={`sede-${s.id_sede}-${idx}`} value={String(s.id_sede)}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {isAdmin && (
                <>
                  <label className="block text-slate-600 mb-1">Usuario</label>
                  <select
                    name="id_usuario"
                    value={form.id_usuario}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {usuarios.map((u, idx) => (
                      <option key={`user-${u.id_usuario}-${idx}`} value={String(u.id_usuario)}>
                        {u.nombre} {u.apellido} ({u.email})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-slate-600 mb-1">Motivo de consulta</label>
              <textarea
                name="motivo_consulta"
                value={form.motivo_consulta}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-600 mb-1">Observaciones</label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                rows={2}
              />
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
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-left">Hora</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Especialidad</th>
                <th className="px-3 py-2 text-left">Profesional</th>
                <th className="px-3 py-2 text-left">Usuario</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id_turno} className="border-t border-slate-100">
                  <td className="px-3 py-2">{new Date(t.fecha_turno).toLocaleDateString('es-ES')}</td>
                  <td className="px-3 py-2">{t.hora_turno}</td>
                  <td className="px-3 py-2">{t.estado}</td>
                  <td className="px-3 py-2">{getEspecialidadNombre(t)}</td>
                  <td className="px-3 py-2">{getProfesionalNombre(t.id_profesional)}</td>
                  <td className="px-3 py-2">{t.id_usuario}</td>
                  <td className="px-3 py-2 space-x-2">
                    {isAdmin && (
                      <button
                        onClick={() => startEdit(t)}
                        className="text-xs text-sky-700 hover:underline mr-2"
                      >
                        Editar
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => remove(t.id_turno)}
                        className="text-xs text-red-600 hover:underline mr-2"
                      >
                        Eliminar
                      </button>
                    )}
                    {canEditEstado(t) && (
                      <select
                        value={t.estado}
                        onChange={(e) => handleChangeEstado(t, e.target.value)}
                        className="border rounded px-1 py-0.5 text-[11px]"
                      >
                        {ESTADOS.map((e) => (
                          <option key={e} value={e}>
                            {e}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    No hay turnos registrados.
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
