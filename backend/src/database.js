const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const DB_PATH = path.join(dataDir, 'tournament.db')

// Create database instance
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message)
  } else {
    console.log(`✓ SQLite database connected: ${DB_PATH}`)
  }
})

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON')

// Create tables on startup
const initializeDatabase = () => {
  // Registrations table
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY,
      teamName TEXT NOT NULL,
      playerCount INTEGER NOT NULL,
      fee INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      paymentStatus TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      verifiedAt DATETIME,
      verifiedVia TEXT,
      proofImage TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating registrations table:', err)
    else console.log('✓ Registrations table ready')
  })

  // Payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY,
      registrationId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      method TEXT,
      amount INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME,
      FOREIGN KEY(registrationId) REFERENCES registrations(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating payments table:', err)
    else console.log('✓ Payments table ready')
  })

  // Telegram users mapping
  db.run(`
    CREATE TABLE IF NOT EXISTS telegramUsers (
      telegramUserId INTEGER PRIMARY KEY,
      registrationId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(registrationId) REFERENCES registrations(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating telegramUsers table:', err)
    else console.log('✓ Telegram users table ready')
  })

  // Admin settings
  db.run(`
    CREATE TABLE IF NOT EXISTS adminSettings (
      id INTEGER PRIMARY KEY,
      phone1 TEXT,
      phone2 TEXT,
      bankName TEXT,
      bankAccount TEXT,
      qrisCode TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating adminSettings table:', err)
    else console.log('✓ Admin settings table ready')
  })

  console.log('✓ All database tables initialized')
}

// Promise-based database functions
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('DB Error:', err.message)
        reject(err)
      } else {
        resolve({ id: this.lastID, changes: this.changes })
      }
    })
  })
}

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('DB Error:', err.message)
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('DB Error:', err.message)
        reject(err)
      } else {
        resolve(rows || [])
      }
    })
  })
}

// Close database connection gracefully
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err)
        reject(err)
      } else {
        console.log('✓ Database connection closed')
        resolve()
      }
    })
  })
}

module.exports = {
  db,
  initializeDatabase,
  dbRun,
  dbGet,
  dbAll,
  closeDatabase
}
