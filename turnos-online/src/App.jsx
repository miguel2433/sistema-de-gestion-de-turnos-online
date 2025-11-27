import { useEffect, useState } from 'react';
import { authApi } from './api/auth.js';
import TurnosPage from './views/TurnosPage.jsx';
import ProfesionalesPage from './views/ProfesionalesPage.jsx';
import EspecialidadesPage from './views/EspecialidadesPage.jsx';
import SedesPage from './views/SedesPage.jsx';
import UsuariosPage from './views/UsuariosPage.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [view, setView] = useState('turnos');
  const roleName = user?.rol?.nombre_rol;
  const isAdmin = roleName === 'Administrador';
  const isProfesional = roleName === 'Profesional';
  const isUsuario = roleName === 'Usuario';

  useEffect(() => {
    const loadMe = async () => {
      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        // no autenticado
      } finally {
        setInitializing(false);
      }
    };
    loadMe();
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-600">Cargando aplicación...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLoggedIn={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-800 font-semibold">
          Turnos Online
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 text-sm">
          <NavItem label="Turnos" active={view === 'turnos'} onClick={() => setView('turnos')} />
          {(isAdmin || isProfesional) && (
            <NavItem
              label="Especialidades"
              active={view === 'especialidades'}
              onClick={() => setView('especialidades')}
            />
          )}
          {(isAdmin || isProfesional) && (
            <NavItem
              label="Sedes"
              active={view === 'sedes'}
              onClick={() => setView('sedes')}
            />
          )}
          {isAdmin && (
            <>
              <NavItem
                label="Profesionales"
                active={view === 'profesionales'}
                onClick={() => setView('profesionales')}
              />
              <NavItem
                label="Usuarios"
                active={view === 'usuarios'}
                onClick={() => setView('usuarios')}
              />
            </>
          )}
        </nav>
        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-300">
          <div className="mb-2">{user?.nombre} {user?.apellido}</div>
          <button
            onClick={async () => {
              await authApi.logout();
              setUser(null);
            }}
            className="w-full rounded bg-slate-800 hover:bg-slate-700 py-1.5 text-xs"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {view === 'turnos' && (
          <TurnosPage
            isAdmin={isAdmin}
            isProfesional={isProfesional}
            isUsuario={isUsuario}
            user={user}
          />
        )}
        {view === 'profesionales' && isAdmin && <ProfesionalesPage isAdmin={isAdmin} />}
        {view === 'especialidades' && (isAdmin || isProfesional) && (
          <EspecialidadesPage isAdmin={isAdmin} />
        )}
        {view === 'sedes' && (isAdmin || isProfesional) && <SedesPage isAdmin={isAdmin} />}
        {view === 'usuarios' && isAdmin && <UsuariosPage />}
      </main>
    </div>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
        active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function AuthScreen({ onLoggedIn }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    dni: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const user = await authApi.login(form.email, form.password);
        onLoggedIn(user);
      } else {
        const payload = {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password,
          telefono: form.telefono || undefined,
          dni: form.dni,
        };
        const user = await authApi.register(payload);
        onLoggedIn(user);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-4 text-center">
          Turnos Online
        </h1>
        <div className="flex mb-4 text-sm bg-slate-100 rounded-lg p-1">
          <button
            className={`flex-1 py-1.5 rounded-md ${
              mode === 'login' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
            }`}
            onClick={() => setMode('login')}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-1.5 rounded-md ${
              mode === 'register' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
            }`}
            onClick={() => setMode('register')}
          >
            Registrarse
          </button>
        </div>
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Nombre</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Apellido</label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-slate-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
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
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
              required
            />
          </div>
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-slate-600 mb-1">Teléfono</label>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">DNI</label>
                <input
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-slate-900 text-white rounded-md py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ProfesionalesView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profesionalesApi.list();
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

  return (
    <section>
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Profesionales</h2>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Actualizar
        </button>
      </header>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
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
                <th className="px-3 py-2 text-left">Rol</th>
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
                  <td className="px-3 py-2">{p.id_especialidad}</td>
                  <td className="px-3 py-2">{p.rol?.nombre_rol ?? '-'}</td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
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

function EspecialidadesView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <section>
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Especialidades</h2>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Actualizar
        </button>
      </header>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
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
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id_especialidad} className="border-t border-slate-100">
                  <td className="px-3 py-2">{e.id_especialidad}</td>
                  <td className="px-3 py-2">{e.nombre_especialidad}</td>
                  <td className="px-3 py-2">{e.descripcion}</td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-slate-500">
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

function SedesView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sedesApi.list();
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

  return (
    <section>
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Sedes</h2>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Actualizar
        </button>
      </header>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-600">Cargando...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Dirección</th>
                <th className="px-3 py-2 text-left">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id_sede} className="border-t border-slate-100">
                  <td className="px-3 py-2">{s.nombre}</td>
                  <td className="px-3 py-2">{s.direccion}</td>
                  <td className="px-3 py-2">{s.telefono}</td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="px-3 py-4 text-center text-slate-500">
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

function UsuariosView() {
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

  useEffect(() => {
    load();
  }, []);

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
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">DNI</th>
                <th className="px-3 py-2 text-left">Rol</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id_usuario} className="border-t border-slate-100">
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

function TurnosView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await turnosApi.list();
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

  return (
    <section>
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Turnos</h2>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800"
        >
          Actualizar
        </button>
      </header>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
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
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id_turno} className="border-t border-slate-100">
                  <td className="px-3 py-2">{t.fecha_turno}</td>
                  <td className="px-3 py-2">{t.hora_turno}</td>
                  <td className="px-3 py-2">{t.estado}</td>
                  <td className="px-3 py-2">{t.especialidad?.nombre_especialidad ?? '-'}</td>
                  <td className="px-3 py-2">{t.id_profesional}</td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
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

export default App;
