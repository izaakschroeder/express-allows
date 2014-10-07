
'use strict';

var express = require('express'),
	allows = require('allows'),
	request = require('supertest');

function ok(req, res, next) {
	res.status(200).send({ ok: true });
	next();
}

function error(error, req, res, next) {
	res.status(error.statusCode || 500).send(error);
	next(error);
}

describe('#allows', function() {

	beforeEach(function() {
		this.app = express();
		this.app.all('/', allows('GET', 'PUT'), ok);
		this.app.use(error);
	});

	afterEach(function() {
		this.app = null;
	});

	it('should continue the middlware chain on allowable HTTP verbs', function(done) {
		var spy = sinon.spy();
		this.app.put('/', spy);
		request(this.app)
			.put('/')
			.expect(function(res) {
				expect(res).to.have.status(200);
				expect(spy).to.be.calledOnce;
			})
			.end(done);
	});

	it('should respond with HTTP 405 on non-allowable HTTP verbs', function(done) {
		var spy = sinon.spy();
		this.app.use(function(err, req, res, next) {
			spy(); next(err);
		});
		request(this.app)
			.post('/')
			.expect(function(res) {
				expect(res).to.have.status(405);
				expect(spy).to.be.calledOnce;
			})
			.end(done);
	});
});
