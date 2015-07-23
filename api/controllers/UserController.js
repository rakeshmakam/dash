/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var base_url = "https://s3-ap-southeast-1.amazonaws.com/mantra-dash/avatar/"; 

module.exports = {
	//Get list of user
	index: function (req, res) {
		User.index(req.body, function (err, users) {
			if (!err) {
				users = users.map(function(obj){ 
                    delete obj.password,
                    delete obj.hashKey
                    if(obj.avatar)
                        obj.avatar = base_url + obj.avatar;
                    return obj;
                });
				res.json(users);
			} else {
				res.negotiate(err);
			}
		});
	},

	profile: function(req, res){

		var userId = req.session.user.id;
		
		User.profile(userId, function(err, user){
			if(!err){
				user.avatar = base_url+user.avatar;
				res.json(user);
			} else { 
				res.negotiate(err);
			}
		});
	},

	userInfo: function (req, res){
		User.userInfo(req.param('id'), function (err, user){
			if (!err) {
				delete user.password;
				delete user.hashKey;
				if(user.avatar)
					user.avatar = base_url+user.avatar;
				res.json(user);
			} else {
				res.negotiate(err);
			}
		});
	}, 

	// User Registration
	add: function (req, res) {
		User.add(req.body, function (err, user) {
			if (!err) {
				res.json(user);

				EmailService.send(user, function(error, data){
					if (!error) {
						sails.log.debug(data);
					} else {
						sails.log.error(error);
					}
				});
			} else {
				res.negotiate(err);
			}
		})
	},

	//Receive email from view and reset link to email id.
	resetPasswordInitiate : function(req, res){
    	if(req.body.email){
			User.resetPasswordInitiate(req.body.email, function(err, user){
				if(!err){
					res.json(user);

					EmailService.resetPassword(user, function(err, user){
						if(!err) {
							// sails.log.debug('controller',user);
						} else{
							sails.log.debug(err);
						}
					});
				}
				else{
					res.negotiate(err);
				}
			});
    	}
    },

    //reset the password
    resetPassword : function(req, res){
    	console.log(req.body);
    	if(req.body.hashKey && req.body.password){
    		User.resetPassword(req.body, function (err, user) {
    			if (!err) {
    				res.json("Password has been reset successfully.");
    			} else {
    				res.negotiate(err);
    			}
    		})
    	} else {
    		res.status(400).json({message: "Password or hashKey is missing"});
    	}
    },



    basicInfo : function(req, res){
    	if(req.body.hashKey && req.body.password && req.body.name){
    		User.basicInfo(req.body, function (err, user) {
    			if (!err) {
    				res.json("Information Updated successfully, You can login Now");
    			} else {
    				res.negotiate(err);
    			}
    		})
    	} else {
    		res.status(400).json({message: "Password or hashKey is missing"});
    	}
    },

	//Edit the User Detail
	edit: function (req, res) {

		var userId = req.session.user.id;

		if(userId){
			User.edit(userId, req.body, function (err, user) {
				if (!err) {
					delete user['password'];
					delete user['hashKey'];
					res.json(user);
				} else {
					res.negotiate(err);
				}
			});
		}
	},

	//Login API
    login: function(req, res){
		if (!req.body || !req.body.email || !req.body.password) {
			res.badRequest('Email or password missing in request');
		} else {
			User.login(req.body, function (err, user) {
				if (!err) {
					req.session.authenticated = true;
					if(user.avatar)
						user.avatar = base_url+user.avatar;
					
					req.session.user = user;
					res.json(user);
                } else {
					res.negotiate(err);
                }   
            });
        }
    },

    setNewPassword : function(req, res){
    	sails.log.debug("req.body",req.body)
    	if (!req.body || !req.body.oldPassword || !req.body.newPassword) {
			res.badRequest('password missing in request');
		} else {
			User.setNewPassword(req.body, function (err, user) {
				if (!err) {
					res.json(user);
					sails.log.debug("user in controller",user);
                } else {
					res.negotiate(err);
                } 
                sails.log.debug("user in controller1");  
            });
             sails.log.debug("user in controller2");  
        }
         sails.log.debug("user in controller3");  
    },

    //Logout API
    logout: function (req, res) {
    	req.session.user = null;
        res.json("Logout Successfully");
    },

    //Delete user
    delete: function (req, res){
    	var userId = req.param('id');
        if (userId) {
        	User.delete(userId, function (err, user) {
        		if (!err) {
        			res.json("Deleted Successfully");
        		} else { 
        			res.negotiate(err);
        		}
        	})
        } else {
        	res.status(400).json({message: "ID is missing"});
        }
    },

    //Get the status of user. This API checks whether User is logged in or not.
    status: function (req, res) { 
        var user = req.session.user;
        if (user){
			res.json(user);
        }else
            res.status(401).json({message: "user is not logged in"});
    },

    suggest: function(req, res){
    	var term = req.param('term');
    	if(!term){
    		res.badRequest();
    	} else {
    		User.suggest(term, function(err, list){
    			if(!err){
    				res.json(list);
    			}else{
    				res.serverError();
    			}
    		});
    	}
    }
};

