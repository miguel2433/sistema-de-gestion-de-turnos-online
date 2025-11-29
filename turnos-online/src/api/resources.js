import { apiFetch } from "./client.js";

export const usuariosApi = {
  list() {
    return apiFetch("/usuarios");
  },
  byEmail(email) {
    return apiFetch("/usuarios/email", {
      method: "POST",
      body: { email },
    });
  },
};

export const profesionalesApi = {
  list() {
    return apiFetch("/profesionales");
  },
  byEspecialidad(id) {
    return apiFetch(`/profesionales/especialidad/${id}`);
  },
  byEspecialidadEnSede(idSede, idEspecialidad) {
    return apiFetch(`/profesionales/sede/${idSede}/especialidad/${idEspecialidad}`);
  },
  create(data) {
    return apiFetch("/profesionales", {
      method: "POST",
      body: data,
    });
  },
  update(id, data) {
    return apiFetch(`/profesionales/${id}`, {
      method: "PUT",
      body: data,
    });
  },
  remove(id) {
    return apiFetch(`/profesionales/${id}`, {
      method: "DELETE",
    });
  },
};

export const especialidadesApi = {
  list() {
    return apiFetch("/especialidades");
  },
  create(data) {
    return apiFetch("/especialidades", {
      method: "POST",
      body: data,
    });
  },
  update(id, data) {
    return apiFetch(`/especialidades/${id}`, {
      method: "PUT",
      body: data,
    });
  },
  remove(id) {
    return apiFetch(`/especialidades/${id}`, {
      method: "DELETE",
    });
  },
};

export const sedesApi = {
  list() {
    return apiFetch("/sedes");
  },
  especialidades(idSede) {
    return apiFetch(`/sedes/${idSede}/especialidades`);
  },
  create(data) {
    return apiFetch("/sedes", {
      method: "POST",
      body: data,
    });
  },
  update(id, data) {
    return apiFetch(`/sedes/${id}`, {
      method: "PUT",
      body: data,
    });
  },
  remove(id) {
    return apiFetch(`/sedes/${id}`, {
      method: "DELETE",
    });
  },
  addEspecialidad(idSede, idEspecialidad) {
    return apiFetch(`/sedes/${idSede}/especialidades`, {
      method: "POST",
      body: { id_especialidad: idEspecialidad },
    });
  },
  removeEspecialidad(idSede, idEspecialidad) {
    return apiFetch(`/sedes/${idSede}/especialidades/${idEspecialidad}`, {
      method: "DELETE",
    });
  },
};

export const turnosApi = {
  list() {
    return apiFetch("/turnos");
  },
  mineUsuario() {
    return apiFetch("/turnos/mis/usuario");
  },
  mineProfesional() {
    return apiFetch("/turnos/mis/profesional");
  },
  create(data) {
    return apiFetch("/turnos", {
      method: "POST",
      body: data,
    });
  },
  update(id, data) {
    return apiFetch(`/turnos/${id}`, {
      method: "PUT",
      body: data,
    });
  },
  remove(id) {
    return apiFetch(`/turnos/${id}`, {
      method: "DELETE",
    });
  },
  updateEstado(id, estado) {
    return apiFetch(`/turnos/${id}/estado`, {
      method: "PATCH",
      body: { estado },
    });
  },
};
