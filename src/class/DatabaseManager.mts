import { DATABASE_PATH } from '../paths.mts';
import sqlite3, { Database } from 'sqlite3';

export class DatabaseManager {

    protected static db: Database

    static start() {
        this.db = new sqlite3.Database(DATABASE_PATH, (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            } else {
            //   console.log('Conexión exitosa a la base de datos');
            }
        });
    }

    static create() {

        this.db = new sqlite3.Database(DATABASE_PATH, (err) => {
            if (err) {
              console.error('Error al abrir la base de datos:', err.message);
            } else {
            //   console.log('Conexión exitosa a la base de datos');
            }
        });
        
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_message BIGINT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    // console.log('Tabla "users" creada');
                }
            });

            this.db.run(`CREATE TABLE IF NOT EXISTS threads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_thread BIGINT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    // console.log('Tabla "threads" creada');
                }
            })

            this.db.run(`CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_interaction BIGINT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    // console.log('Tabla "interactions" creada');
                }
            })
        });
    }

    static addMessage(id_message: string) {
        this.db.run(`INSERT INTO messages (id_message) VALUES (?)`, [id_message], function(err) {
            if (err) {
                console.error('Error al insertar en "messages":', err.message);
            }
        });
    }

    static addThread(id_thread: string) {
        this.db.run(`INSERT INTO threads (id_thread) VALUES (?)`, [id_thread], function(err) {
            if (err) {
                console.error('Error al insertar en "threads":', err.message);
            }
        });
    }

    static addInteraction(id_interaction: string) {
        this.db.run(`INSERT INTO interactions (id_interaction) VALUES (?)`, [id_interaction], function(err) {
            if (err) {
                console.error('Error al insertar en "interactions":', err.message);
            }
        });
    }

    static deleteMessage(id_message: string) {
        this.db.run(`DELETE FROM messages WHERE id_message = ?`, [id_message], function(err) {
            if (err) {
                console.error('Error al eliminar de "messages":', err.message);
            }
        });
    }

    static deleteThread(id_thread: string) {
        this.db.run(`DELETE FROM threads WHERE id_thread = ?`, [id_thread], function(err) {
            if (err) {
                console.error('Error al eliminar de "threads":', err.message);
            }
        });
    }

    static deleteInteraction(id_interaction: string) {
        this.db.run(`DELETE FROM interactions WHERE id_interaction = ?`, [id_interaction], function(err) {
            if (err) {
                console.error('Error al eliminar de "interactions":', err.message);
            }
        });
    }

    static listMessages() {
        this.db.all(`SELECT * FROM messages`, [], (err, rows) => {
            if (err) {
                console.error('Error al consultar "messages":', err.message);
            } else {
                console.log('messages:', rows);
            }
        });
    }

    static listThreads() {
        this.db.all(`SELECT * FROM threads`, [], (err, rows) => {
            if (err) {
                console.error('Error al consultar "threads":', err.message);
            } else {
                console.log('threads:', rows);
            }
        });
    }
    
    static listInteractions() {
        this.db.all(`SELECT * FROM interactions`, [], (err, rows) => {
            if (err) {
                console.error('Error al consultar "interactions":', err.message);
            } else {
                console.log('Interactions:', rows);
            }
        });
    }
}