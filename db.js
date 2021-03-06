const sqlite3 = require('sqlite3').verbose();

const dbname = 'mysqlite';
// Create and connect a database
const db = new sqlite3.Database(dbname);

db.serialize(() => {
    const sql = `
        CREATE TABLE IF NOT EXISTS keyvalues
        (id integer primary key,key,value,timestamp TIMESTAMP)
    `;
    db.run(sql);
});

// KeyValues API - database operation
class KeyValues {
    static all(cb) {
        db.all('SELECT * FROM keyvalues', cb);
    }

    static deleteAll(cb) {
        db.run('DELETE FROM keyvalues', cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error(`ID is missing`));
        db.run('DELETE FROM keyvalues WHERE id=?', id, cb);
    }

    static create(data, cb) {
        const sql = `
                INSERT INTO 
                keyvalues(key,value,timestamp) 
                VALUES(?,?,?) 
                ;select last_insert_rowid();`;
        db.run(sql, data.key, data.value, data.timestamp, cb);
    }

    static find(key, timestamp, cb) {
        if (timestamp) {
            db.get('SELECT value FROM keyvalues WHERE key = ? AND timestamp <= ? ORDER BY timestamp DESC', key, timestamp, cb);
        } else {
            db.get('SELECT value FROM keyvalues WHERE key = ? ORDER BY timestamp DESC', key, cb);
        }
    }

    // :todo
    static update(data, cb) {
        const sql = `
            UPDATE keyvalues
            SET key=?
            WHERE id=?
        `
        db.run(sql, data.key, data.id, cb)
    }
}

module.exports.KeyValues = KeyValues;
