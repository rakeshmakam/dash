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

		avatar: {
			type: "string"
		},

		designation: {
			type: "string"
		},

		role: {
			type: "string"
		},

		projects: {
			collection: 'Project',
			via: 'users'
		},
		
		hashKey : {
			type : "string"
		},

		aboutMe : {
			type : "string",
			size : 500
		},

		skypeId : {
			type : "string"
		},

		websiteUrl : {
			type : "string"
		}
	},

	index: function (data, callback) {
		User.find().populate("projects").exec(function (err, data) {
			if (!err) {
				callback(null, data);
			} else {
				callback(err);
			}
		});
	},

	userInfo: function (id, callback){
		User.findOne({id : id}).exec(function (err, user){
			if(!err) {
				delete user['password'];
				delete user['hashKey'];
				callback(null, user);
			} else {
				callback(err);
			}
		});
	},

	profile: function (id, callback){
		User.findOne({id : id}).populateAll().exec(function (err, user){
			if(!err) {
				delete user['password'];
				delete user['hashKey'];
				
				callback(null , user);
			} else {
				callback(err);
			}
		});
	},

	//adding user by admin
	add: function (data, callback) {

		data.role = 'user';
		//Hardcode value Later remove it.
		if(data.email === "dhananjaymg@gmail.com"){
			data.role = "admin"
		}

		data.hashKey = generateSalt();

		saltAndHash(data.password, function(encryptedPswrd){
   		data.password = encryptedPswrd;
			User.create(data, function (err, user) {
				if(!err) {
					delete user['password'];
					callback(null, user);
				} else {
					callback(err);
				}
			});
		});
	},

	//logged in user can edit his details
	edit: function (userId, data, callback) {
		
		if (data.password) {
			saltAndHash(data.password, function (hash) {
				data.password = hash;
			});
		};
		User.update({id : userId}, data, function (err, user) {
			if (!err) {
				if (user.length == 0) {
					callback({status: 402, message: "User not found"});
				} else {
					delete data['password'];
					callback(null, user[0]);
				}
			} else {
				callback(err);
			}
		});
	},


	//Collect the basic info when user gets mail from Admin to access the Dash Site
	basicInfo: function (req, callback) {
		
		if (req.password) {
			saltAndHash(req.password, function (hash) {
				req.password = hash;
			});
		};
		User.update({where :{hashKey : req.hashKey}}, req, function (err, user) {
			if (!err) {
				if (user.length == 0) {
					callback({status: 402, message: "User not found."});
				} else {
					callback(null, user);
				}
			} else {
				callback(err);
			}
		});
	},

	//resetting the password
	resetPassword: function(data, callback) {

		User.findOne({where: {hashKey: data.hashKey}}).exec(function(err, user){
			if(!err){
				var obj = {};
				if (data.password) {
					saltAndHash(data.password, function (hash) {
						obj.password = hash;
					});
				};
				User.update({id : user.id}, obj, function (err, user) {
					if (!err) {
						if (user.length == 0) {
							callback({status: 402, message: "User not found"});
						} else {
							callback(null, user);
						}
					} else {
						callback(err);
					}
				});
			} else {
				callback(err)
			}
		});
    },

    //login 
	login: function (opts, callback) {

		User.findOne({where: {email: opts.email}}).populate("projects").exec(function (err, user) {
			if (err) {
				callback(err);
			} else if(user) {
				// if (user.email_verified){
					validatePassword(opts.password, user.password, function (res) {
						if(res) {
							delete user['password'];
							callback(null,user);
						} else {
							callback({status: 402, message: "Email or password does not match"});
						}
					});
				// } else {
				// 	callback({status: 400, message: "Please confirm your email"});
				// }
			} else {
				callback({status: 402, message: "User does not exists"});
			} 
	    });
	},

	//For Deleting the user
	delete: function (userId, callback) {
		User.destroy({id : userId}).exec(function (err, data) {
			if (!err) {
				if (data.length == 0) {
					callback({status: 402, message: "User not found"});
				} else {
					callback(null, data.id);
				}
			} else {
				callback(err);
			}
		});
    },

    //forgot password or reset password send email method with HashKey
    resetPasswordInitiate: function(email, callback){
    	User.findOne({where: {email: email}})
    	.exec(function (err, data){
    		if(!err){
    			callback(null,data);
    			if (data.length == 0) {
					callback({status: 402, message: "User not found"});
				}
    		} else {
    			callback(err);
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

var md5 = function (str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function (pass, callback) {
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
};

var validatePassword = function (plainPass, hashedPass, callback) {
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(hashedPass === validHash);
};

