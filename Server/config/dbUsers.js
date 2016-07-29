'use strict'

let db = require('./db')

/*
* Set and get a local user account
 */
function setLocalUser (user, cb) {
	db.run('INSERT INTO users (email, password) VALUES (?, ?)', [user.email, user.password], function(err) {
		// return err object and number of changes
		cb(err, this.changes)
	})
}
function getLocalUser (user, cb) {
	console.log('get user')
	db.get('SELECT (userid, email, password) FROM users WHERE email = ?', user, function(err, row) {
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
	db.get('SELECT (userid, twitterUsername) FROM users WHERE twitterToken = ?', user, twitterToken, function(err, row) {
		cb(err, row)
	})
}

/*
* Set and get a google user account
 */
function setGoogleUser (user, cb) {
	db.run('INSERT INTO users (userid, twitterUsername) VALUES (?, ?, ?)', [user.googleToken, user.googleUsername], function(err) {
		cb(err, this.changes)
	})
}
function getGoogleUser (user, cb) {
	db.get('SELECT (userid, googleUsername) FROM users WHERE googleToken = ?', user,googleToken, function(err, row) {
		cb(err, row)
	})
}

// function for when useraccount/socialtoken doesnt match whats in db

// export all functions
module.exports = {
	'db': db,
	'getLocalUser': getLocalUser,
	'setLocalUser': setLocalUser,
	'getTwitterUser': getTwitterUser,
	'setTwitterUser': setTwitterUser,
	'getGoogleUser': getGoogleUser,
	'setGoogleUser': setGoogleUser 
}