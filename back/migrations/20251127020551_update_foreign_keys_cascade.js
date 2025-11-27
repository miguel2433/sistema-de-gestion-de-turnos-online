// migrations/20251127023551_update_foreign_keys_cascade.js
export async function up(knex) {
  // Eliminar restricciones existentes
  await knex.raw(`
    ALTER TABLE turno 
    DROP FOREIGN KEY turno_id_profesional_foreign;
  `);
  await knex.raw(`
    ALTER TABLE turno 
    DROP FOREIGN KEY turno_id_usuario_foreign;
  `);
  await knex.raw(`
    ALTER TABLE turno 
    DROP FOREIGN KEY turno_id_especialidad_foreign;
  `);
  await knex.raw(`
    ALTER TABLE turno 
    DROP FOREIGN KEY turno_id_sede_foreign;
  `);

  // Agregar restricciones con CASCADE
  await knex.raw(`
    ALTER TABLE turno
    ADD CONSTRAINT turno_id_profesional_foreign 
    FOREIGN KEY (id_profesional) REFERENCES profesional(id_profesional)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  `);

  await knex.raw(`
    ALTER TABLE turno
    ADD CONSTRAINT turno_id_usuario_foreign 
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  `);

  await knex.raw(`
    ALTER TABLE turno
    ADD CONSTRAINT turno_id_especialidad_foreign 
    FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  `);

  await knex.raw(`
    ALTER TABLE turno
    ADD CONSTRAINT turno_id_sede_foreign 
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  `);
}

export async function down(knex) {
  // Eliminar restricciones CASCADE
  await knex.raw(`
    ALTER TABLE turno 
    DROP FOREIGN KEY turno_id_profesional_foreign;
  `);
  await knex.raw(`
    ALTER TABLE turno 
    DROP FOREIGN KEY turno_id_usuario_foreign;
  `);
  await knex.raw(`
    ALTER TABLE turno 
    DROP FOREIGN KEY turno_id_especialidad_foreign;
  `);
  await knex.raw(`
    ALTER TABLE turno 
    DROP FOREIGN KEY turno_id_sede_foreign;
  `);

  // Agregar restricciones sin CASCADE
  await knex.raw(`
    ALTER TABLE turno
    ADD CONSTRAINT turno_id_profesional_foreign 
    FOREIGN KEY (id_profesional) REFERENCES profesional(id_profesional);
  `);

  await knex.raw(`
    ALTER TABLE turno
    ADD CONSTRAINT turno_id_usuario_foreign 
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);
  `);

  await knex.raw(`
    ALTER TABLE turno
    ADD CONSTRAINT turno_id_especialidad_foreign 
    FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad);
  `);

  await knex.raw(`
    ALTER TABLE turno
    ADD CONSTRAINT turno_id_sede_foreign 
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede);
  `);
}