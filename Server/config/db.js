'use strict'

const fs = require("fs")

// get db file and check to see if it exists
const file = "FCCvoter.db"
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
			)
		`)

		db.run(`CREATE TABLE polls (
			pollid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			userid INTEGER REFERENCES users (userid) NOT NULL,
			name VARCHAR (50) NOT NULL,
			description VARCHAR (100)
			)
		`)

		db.run(`CREATE TABLE pollsection (
			sectionid INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			pollid INTEGER REFERENCES polls (pollid) NOT NULL,
			name VARCHAR(20) NOT NULL,
			votes INTEGER DEFAULT 0
			)
		`)
	}
})








/*
* Set and get a local user account
 */
function setLocalUser (user, cb) {
	db.run('INSERT INTO users (email, password) VALUES (?, ?)', [user.email, user.password], function(err) {
		// return err object and number of changes
		cb(err, this.lastID)
	})
}
function getLocalUser (user, cb) {
	db.get('SELECT userid, email, password FROM users WHERE email = ?', user, function(err, row) {
		// return err object and row result in json
		cb(err, row)
	})
}

/*
* Set and get a twitter user account
 */
function setTwitterUser (user, cb) {
	db.run('INSERT INTO users (twitterToken, twitterUsername) VALUES (?, ?, ?)', [user.twitterToken, user.twitterUsername], function(err) {
		cb(err, this.changes)
	})
}
function getTwitterUser (user, cb) {
	db.get('SELECT userid, twitterUsername FROM users WHERE twitterToken = ?', twitterToken, function(err, row) {
		cb(err, row)
	})
}



/*
* Set and get a google user account
 */
function setGoogleUser (user, cb) {
	db.run('INSERT INTO users (userid, googleUsername) VALUES (?, ?, ?)', [user.googleToken, user.googleUsername], function(err) {
		cb(err, this.changes)
	})
}
function getGoogleUser (user, cb) {
	db.get('SELECT userid, googleUsername FROM users WHERE googleToken = ?', googleToken, function(err, row) {
		cb(err, row)
	})
}



/*
 * getting and setting poll data
 */
function getAllPolls (cb) {
	db.all('SELECT pollid, name, description FROM polls', function (err, row) {
		return cb(err, row)
	})
}
function getPoll (pollid, cb) {
	db.all('SELECT polls.name, polls.description, pollsection.sectionid, pollsection.name, pollsection.votes FROM polls INNER JOIN pollsection ON polls.pollid = pollsection.pollid WHERE polls.pollid = ?', pollid.pollid, function (err, row) {
		return cb(err, row)
	})
}
function setPoll (poll, cb) {
	db.run('INSERT INTO polls (userid, name, description) VALUES (?, ?, ?)', [poll.userid, poll.name, poll.description], function (err, row) {
		poll.section.forEach( section => {
			db.run('INSERT INTO pollsection (pollid, name, votes) VALUES (?, ?, ?)', [this.lastID, section, 0], function(err, row) {
				if (err) return cb(err)
			})
		})
		return cb(err, row)
	})
}

function getALLUserPolls (userid, cb) {
	db.all('SELECT pollid, name, description FROM polls WHERE userid = ?', userid.userid, function (err, row) {
		 return cb(err, row)
	})
}



/*
 * add a vote to a poll section
 */
function vote (pollsection, cb) {
	db.get('UPDATE pollsection SET votes = votes + 1 WHERE sectionid = ?', pollsection.sectionid, function (err, row) {
		cb(err, row)
	})
}

// function for when useraccount/socialtoken doesnt match whats in db

// export all functions
module.exports = {
	db,
	getLocalUser,
	setLocalUser,
	getTwitterUser,
	setTwitterUser,
	getGoogleUser,
	setGoogleUser,
	getAllPolls,
	getPoll,
	setPoll,
	getALLUserPolls,
	vote
}