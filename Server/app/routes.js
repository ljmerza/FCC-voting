'use strict';

const path = require('path')
let db = require('./../config/db')

module.exports = function (app, passport) {

	/******************************normal routes***************************************/
	// home page
	app.get('/', function (req, res) {
		res.sendFile('index.html', {
			root: './../'
		})
	});

	// account data
	app.get('/account', isLoggedIn, function (req, res) {
		return res.send('loggedin')
	});

	// logout data
	app.get('/logout', function (req, res) {
		req.logout();
		return res.send( { error: 'User logged out.' } )
	});





	// process a login
	app.post('/login', function (req, res, next) {
		passport.authenticate('local-login', function (err, user, info) {
			if (err) return next(err)

			if (!user) return res.send(info)

			req.logIn(user, function (err) {
				if (err) return next(err)

				return res.json( {
					'id': user.userid,
					'email': user.email
					} )
			})
		})(req, res, next)
	})


	// process a sign up
	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (err, user, info) {
			if (err) return next(err)

			if (!user) return res.send(info)

			req.logIn(user, function (err) {
				if (err) return next(err)
				return res.json( {
					'id': user.userid,
					'email': user.email
					} )
			})
		})(req, res, next)
	})





	/*
	 * post a new poll
	 */
	app.post('/poll', isLoggedIn, function (req, res, next) {

		// set userid to body
		req.body.userid = req["user"].userid
		
		db.setPoll(req.body, function (err, data) {
			if (err) return next(err)
			return res.send(data)
		})
	})

	/*
	 * get a poll from db
	 */
	app.get('/poll/:pollid', function (req, res, next) {
		db.getPoll(req.params, function (err, data) {
			if (err) return next(err)
			return res.send(data)
		})
	})

	/*
	 * get all polls in db
	 */
	app.get('/allpolls', function (req, res, next) {
		db.getAllPolls( function (err, data) {
			if (err) return res.json( { error: 'Error getting polls.' })
			return res.send(data)
		})
	})

	/*
	 * get all user polls
	 */
	app.get('/userpolls/', isLoggedIn, function (req, res, next) {

		db.getAllUserPolls( { userid: req["user"].userid }, function (err, data) {
			if (err) return next(err)
			return res.send(data)
		})
	})

	/*
	 * vote on a poll
	 */
	app.post('/vote', isLoggedIn, function (req, res, next) {

		db.vote(req.body, function (err, data) {
			if (err) return next(err)
			return res.send(data)
		})
	})

}


	
function isLoggedIn(req, res, next) {
	// if authenticated then go to next middleware
	if (req.isAuthenticated()) {
		return next()
	} 

	// if not authenticated then display error
	return res.json( { error: 'User not logged in. Please login.' } ); 
}



