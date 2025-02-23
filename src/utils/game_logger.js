const sqlite3 = require('sqlite3').verbose();
const { DateTime } = require('luxon');


class GameLogger {
    constructor(dbPath = 'poker.db') {
        this.conn = new sqlite3.Database(dbPath);
        this._createTables();
    }

    _createTables() {
        this.conn.run(`
            CREATE TABLE IF NOT EXISTS hands (
                timestamp TEXT,
                cards TEXT,
                action TEXT,
                pot REAL
            )
        `);
    }

    logHand(cards, action, pot) {
        const ts = DateTime.now().toISOString();
        this.conn.run(
            'INSERT INTO hands VALUES (?, ?, ?, ?)',
            [ts, JSON.stringify(cards), action, pot],
            (err) => {
                if (err) {
                    console.error("Error logging hand:", err.message);
                }
            }
        );
    }


    close(){
        this.conn.close();
    }
}

module.exports = GameLogger;
