import { DATABASE_PATH } from '../paths.mts';
import sqlite3, { Database } from 'sqlite3';

export interface ChatbotStats {
    discord_user_id: string;
    chats_opened: number;
    messages_replied: number;
    char_length: number;
}

export interface messageRow {
    id_message: string;
    fecha: string;
}

export interface threadRow {
    id_thread: string;
    fecha: string;
}

export class DatabaseManager {

    protected static db: Database

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
                id_message VARCHAR(25) PRIMARY KEY,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    // console.log('Tabla "users" creada');
                }
            });

            this.db.run(`CREATE TABLE IF NOT EXISTS threads (
                id_thread VARCHAR(25) PRIMARY KEY,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    // console.log('Tabla "threads" creada');
                }
            })

            this.db.run(`CREATE TABLE IF NOT EXISTS interactions (
                id_interaction VARCHAR(25) PRIMARY KEY,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    // console.log('Tabla "interactions" creada');
                }
            })
            this.db.run(`CREATE TABLE IF NOT EXISTS chatbotStats(
                discord_user_id VARCHAR(25) PRIMARY KEY,
                chats_opened INTEGER DEFAULT 0,
                messages_replied INTEGER DEFAULT 0,
                char_length INTEGER DEFAULT 0
                )`, (err) => {
                if (err) {
                    console.error('Error al crear la tabla:', err.message);
                } else {
                    // console.log('Tabla "chatbotStats" creada');
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
                // console.error('Error al eliminar de "messages":', err.message);
                throw err;
            }
        });
    }

    static deleteThread(id_thread: string) {
        this.db.run(`DELETE FROM threads WHERE id_thread = ?`, [id_thread], function(err) {
            if (err) {
                // console.error('Error al eliminar de "threads":', err.message);
                throw err;
            }
        });
    }

    static deleteInteraction(id_interaction: string) {
        this.db.run(`DELETE FROM interactions WHERE id_interaction = ?`, [id_interaction], function(err) {
            if (err) {
                // console.error('Error al eliminar de "interactions":', err.message);
                throw err;
            }
        });
    }

    static listMessages(count: number): Promise<messageRow[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM messages ORDER BY fecha DESC LIMIT ?`,
                [count],
                (err, rows) => {
                    if (err) {
                        // console.error('Error al consultar "messages":', err.message);
                        reject(err);
                    } else {
                        resolve(rows as messageRow[]);
                    }
                }
            );
        });
    }
    

    static listThreads(count: number): Promise<threadRow[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM threads ORDER BY fecha DESC LIMIT ?`,
                [count],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('threads:', rows);
                        resolve(rows as threadRow[]);
                    }
                }
            );
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

    static async getChatbotStats(discord_user_id: string): Promise<ChatbotStats | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM chatbotStats WHERE discord_user_id = ?`, [discord_user_id], (err, row: any) => {
                if (err) {
                    console.error('Error al obtener "chatbotStats":', err.message);
                    reject(err);
                } else {
                    if (!row) {
                        resolve(null);
                    } else {
                        const typedRow: ChatbotStats = {
                            discord_user_id: String(row.discord_user_id),
                            chats_opened: Number(row.chats_opened),
                            messages_replied: Number(row.messages_replied),
                            char_length: Number(row.char_length)
                        };
                        resolve(typedRow);
                    }
                }
            });
        })
    }
    
    static async setChatbotStats(stats: ChatbotStats) 
    {
        this.db.run(
            `INSERT INTO chatbotStats (discord_user_id, chats_opened, messages_replied, char_length)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(discord_user_id) DO UPDATE SET
                chats_opened = excluded.chats_opened,
                messages_replied = excluded.messages_replied,
                char_length = excluded.char_length`,
            [stats.discord_user_id, stats.chats_opened, stats.messages_replied, stats.char_length],
            (err) => {
                if (err) {
                    console.error('Error al insertar/actualizar "chatbotStats":', err.message);
                }
            }
        );
    }
    
    static async listChatbotStats(): Promise<ChatbotStats[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM chatbotStats`, [], (err, rows) => {
                if (err) {
                    console.error('Error al listar "chatbotStats":', err.message);
                    reject(err);
                } else {
                    const typedRows: ChatbotStats[] = rows.map((row: any) => ({
                        discord_user_id: String(row.discord_user_id),
                        chats_opened: Number(row.chats_opened),
                        messages_replied: Number(row.messages_replied),
                        char_length: Number(row.char_length)
                    }));
                    resolve(typedRows);
                }
            });
        });
    }
}