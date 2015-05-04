/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var base_url = "https://s3-us-west-2.amazonaws.com/mantra-dash/avatar/"; 

module.exports = {
	//Get list of user
	list: function (req, res) {
		User.list(req.body, function (err, users) {
			if (!err) {
				users = users.map(function(obj){ 
                    delete obj.password
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

	// User Registration
	add: function (req, res) {
		User.add(req.body, function (err, user) {
			if (!err) {
				user = user.map(function(obj){ 
                    delete obj.password
                    if(obj.avatar)
                        obj.avatar = base_url + obj.avatar;
                    return obj;
                });
                
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

	//Edit the User Detail
	edit: function (req, res) {
		var userId = req.param('id');
		User.edit(userId, req.body, function (err, user) {
			if (!err) {
				user = user.map(function(obj){ 
                    delete obj.password
                    if(obj.avatar)
                        obj.avatar = base_url + obj.avatar;
                    return obj;
                });
				res.json(user);
			} else {
				res.negotiate(err);
			}
		});
	},

	//Login API
    login: function(req, res){
		if (!req.body || !req.body.email || !req.body.password) {
			res.badRequest('Email or password missing in request');
		} else {
			User.login(req.body, function (err, user) {
				if (!err) {
					req.session.authenticated = true;
					req.session.user = user;
					res.json(user);
                } else {
					res.negotiate(err);
                }   
            });
        }
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

    //Get the status of user. This API checks wheather User is logged in or not.
    status: function (req, res) { 
        if (req.session.user)
            res.json(req.session.user);
        else
            res.status(400).json({message: "user is not logged in"});
    },
};

