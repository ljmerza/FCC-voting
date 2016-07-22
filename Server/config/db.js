'use strict'

const fs = require("fs")

// get db file and check to see if it exists
const file = "FCCVoting.db"
const exists = fs.existsSync(file)

// if db doesn't exist then create db file
if (!exists) {
	console.log("Creating db file.")
	fs.openSync(file, "w")
}

// connect to db
let sqlite3 = require("sqlite3").verbose()
let db = new sqlite3.Database(file)

// if db doesn't exist then create tables
db.serialize( function () {
	if (!exists) {
		db.run(`CREATE TABLE users (
			userid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			email VARCHAR(50),
			password VARCHAR(50) NOT NULL,
			twitterToken VARCHAR(50),
			twitterUsername VARCHAR(20),
			googleToken VARCHAR(50),
			googleUsername VARCHAR(20)
			`)

		db.run(`CREATE TABLE polls (
			pollid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			userid INTEGER REFERENCES users (userid) NOT NULL,
			name VARCHAR (50) NOT NULL,
			description VARCHAR (100)`)

		db.run(`CREATE TABLE pollsection (
			sectionid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			pollid INTEGER REFERENCES polls (pollid) NOT NULL,
			name VARCHAR(20) NOT NULL,
			votes INTEGER DEFAULT 0`)
	}
})

// export db object
export default db