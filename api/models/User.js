/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var crypto = require('crypto');

module.exports = {
	tableName: "user",
  
  	attributes: {
		id: {
			type:"int",
			primaryKey: true,
			autoIncrement: true
		},

		email: {
			type: "email",
			required : true,
			unique: true,
			size: 100
		},

		password: {
			type: "string",
			size: 50
		},

		email_verified: {
			type : "boolean",
			defaultsTo : false,
			required : true
		},

		phone: {
			type: "int",
			size: 10
		},

		name: {
			type: "string"
		},

		photo: {
			type: "string"
		},

		designation: {
			type: "string"
		},

		role: {
			type: "string"
		}
	},

	list: function (data, callback) {
		User.find().exec(function(err, data){
			if (!err) {
				callback(null, data);
			} else {
				callback(err);
			}
		});
	},

	add: function (data, callback) {
		data.role = 'user';
		User.create(data, function(err, user){
			if(!err) {
				delete user['password'];
				callback(null, user);
			} else {
				callback(err);
			}
		});
	},

	edit: function (userId, req, callback) {
		if (req.password) {
			saltAndHash(req.password, function (hash) {
				req.password = hash;
			});
		};

		User.update({id : userId}, req, function(err, data){
			if (!err) {
				if (data.length == 0) {
					return callback({status: 404, message: "User not found"});
				} else {
					return callback(null, data);
				}
			} else {
				return callback(err);
			}
		});
	},

	login: function (opts, callback) {
		User.findOne({where: {email: opts.email}}).exec(function(err, user){
			if (err) {
				callback(err);
			} else if(user) {
				if (user.email_verified){
					validatePassword(opts.password, user.password, function(res){
						if(res) {
							delete user['password'];
							callback(null,user);
						} else {
							callback({status: 400, message: "Email or password does not match"});
						}
					});
				} else {
					callback({status: 400, message: "Please confirm your email"});
				}
			} else {
				callback({status: 404, message: "User does not exists"});
			} 
	    });
	},

	//For Deleting the user
	delete: function (userId, callback) {
		User.destroy({id : userId}).exec( function (err, data) {
			if (!err) {
				console.log(data);
				if (data.length == 0) {
					return callback({status: 404, message: "User not found"});
				} else {
					return callback(null, data.id);
				}
			} else {
				return callback(err);
			}
		});
    }
};

var generateSalt = function() {
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
};

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback) {
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
};

var validatePassword = function(plainPass, hashedPass, callback) {
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(hashedPass === validHash);
};

