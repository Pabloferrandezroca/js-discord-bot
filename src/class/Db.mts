import sqlite3 from 'sqlite3';

export class Db {
    static createDb() {

        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            } else {
              console.log('Conexión exitosa a la base de datos');
            }
        });
        
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS mensajes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_mensaje BIGINT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    console.log('Tabla "users" creada');
                }
            });
        });
        
        
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS hilos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_hilo BIGINT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    console.log('Tabla "hilos" creada');
                }
            })
        })
        
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_interaction BIGINT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    console.log('Tabla "mensajes_hilos" creada');
                }
            })
        })
    }

    static addMensaje(id_mensaje: string) {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.run(`INSERT INTO mensajes (id_mensaje) VALUES (?)`, [id_mensaje], function(err) {
                if (err) {
                    console.error('Error al insertar en "mensajes":', err.message);
                }
            });
        })
    }

    static addHilo(id_hilo: string) {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.run(`INSERT INTO hilos (id_hilo) VALUES (?)`, [id_hilo], function(err) {
                if (err) {
                    console.error('Error al insertar en "hilos":', err.message);
                }
            });
        })
    }

    static addInteraction(id_interaction: string) {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.run(`INSERT INTO interactions (id_interaction) VALUES (?)`, [id_interaction], function(err) {
                if (err) {
                    console.error('Error al insertar en "interactions":', err.message);
                }
            });
        })
    }

    static deleteMensaje(id_mensaje: string) {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.run(`DELETE FROM mensajes WHERE id_mensaje = ?`, [id_mensaje], function(err) {
                if (err) {
                    console.error('Error al eliminar de "mensajes":', err.message);
                }
            });
        })
    }

    static deleteHilo(id_hilo: string) {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.run(`DELETE FROM hilos WHERE id_hilo = ?`, [id_hilo], function(err) {
                if (err) {
                    console.error('Error al eliminar de "hilos":', err.message);
                }
            });
        })
    }

    static deleteInteraction(id_interaction: string) {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.run(`DELETE FROM interactions WHERE id_interaction = ?`, [id_interaction], function(err) {
                if (err) {
                    console.error('Error al eliminar de "interactions":', err.message);
                }
            });
        })
    }

    static listarMensajes() {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.all(`SELECT * FROM mensajes`, [], (err, rows) => {
                if (err) {
                    console.error('Error al consultar "mensajes":', err.message);
                } else {
                    console.log('Mensajes:', rows);
                }
            });
        })
    }

    static listarHilos() {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.all(`SELECT * FROM hilos`, [], (err, rows) => {
                if (err) {
                    console.error('Error al consultar "hilos":', err.message);
                } else {
                    console.log('Hilos:', rows);
                }
            });
        })
    }
    
    static listarInteractions() {
        const db = new sqlite3.Database('dist/data/datos.db', (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            }
        });

        db.serialize(() => {
            db.all(`SELECT * FROM interactions`, [], (err, rows) => {
                if (err) {
                    console.error('Error al consultar "interactions":', err.message);
                } else {
                    console.log('Interactions:', rows);
                }
            });
        })
    }
}