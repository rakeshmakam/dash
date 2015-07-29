 /**
* Activity.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var base_url = "https://s3-ap-southeast-1.amazonaws.com/mantra-dash/avatar/";
// base_url_attachments = "https://s3-ap-southeast-1.amazonaws.com/mantra-dash/attachments/";

module.exports = {
	tableName: "activity",

	attributes: {

		description: {
			type: "string"
			// required : true
		},

		project: {
			// required : true,
			model: 'Project'
		},

		user: {
			// required : true,
			model: 'User',
		},

		likes: {
			type: 'json'
		},

		comments: {
			type: 'json'
		},

		attachment: {
			// model:'Attachment',
			type: 'string'
		},

		parentId: {
			type: 'string',
			defaultsTo:null
		},
	},
	
	index: function (data, callback) {
		User.findOne({id: data.userData.id}).populate('projects').exec(function (err, user) {
		var counter = 0;
		var i = 0;
		var length;
		var result = [];
		if(data.project){
			var conditions = {};
			conditions.parentId = null;
			conditions.project = data.project;
			Activity.findActivities(conditions, function(err, response){
				if(!err){
					callback(null, response);
				} else {
					callback(err);
				}
			});
		} else {
			length = user.projects.length;
			if(length > 0){
				var fn1 = function(){
					var project = user.projects[i++];
					var fn2 = function(){
						if(counter < length){
							fn1();
						} else {
							callback(null, result);
						}
					};
					var conditions = {};
					conditions.parentId = null;
					conditions.project = project.id;
					Activity.findActivities(conditions, function(error, response){
						if(!error){
							if(response && response.length > 0){
								_.each(response, function(info){
									result.push(info);
								});
							}
							counter++;
							fn2();
						}
					});
				};
				fn1();
			} else {
				callback(null, []);
			}
		}
	});
	},

	findActivities: function(data, callback){
		var counter = 0;
		var i = 0;
		var length;
		var result = [];
		Activity.find({where:data, sort: 'createdAt DESC'}).populateAll().exec(function (err, activities) {
			if (!err) {
				length = activities.length;
				if(length > 0){
					var fn1 = function(){
						var activity = activities[i++];
						var fn2 = function(){
							if(counter < length){
								fn1();
							} else {
								callback(null, result);
							}
						};
						delete activity.user.hashKey;
						delete activity.user.email_verified;
						delete activity.user.password;
						Activity.findComments({parentId: activity.id}, function(error, comments){
							if(!error){
								activity.comments = comments;
								result.push(activity);
								counter++;
								fn2();
							}
						});
					};
					fn1();
				} else {
					callback(null, activities);
				}
			} else {
				callback(err);
			}
		});
	},

	add: function (data, callback) {
		Activity.create(data).exec(function (err, activity) {
			if(!err) {
				var response = {};
				response = activity;
				Project.findOne(activity.project, function(err, project){
					if(!err){
						response.project = project;
						User.findOne(activity.user, function(err, user){
							if(!err){
								var info = JSON.parse(JSON.stringify(user));
								delete info.hashKey;
								delete info.email_verified;
								delete info.password;
								response.user = info;
							
								callback(null, response);
							} else {
								callback({status: 400, message: "User not found"});	
							}
						});
					} else {
						callback({status: 400, message: "Project not found"});
					}
				});
			} else {
				callback(err);
			}
		});
	},

	addComment: function (data, callback) {
		data.likes = [];
		if(data.userId){
			User.findOne({id: data.userId}, function(err, user){
				if(!err){
					delete data.userId;
					var userInfo = {};
					userInfo.email = user.email;
					userInfo.name = user.name;
					userInfo.id = user.id;
					userInfo.avatar = base_url + user.avatar;
					data.userInfo = userInfo;
					Activity.create(data).exec(function (err, activity) {
						if(!err) {
							callback(null, activity);
						} else {
							callback(err);
						}
					});
				} else {
					callback({status: 400, message: "User not found"});	
				}
			});
		}
	},

	findComments: function(data, callback){
		Activity.find({where: data, sort: 'createdAt DESC'}, function(err, comments){
			if(!err){
				if(comments.length == 0){
					callback(null, []);
				} else {
					callback(null, comments);
				}
			}else{
				callback(err);
			}
		});
	},

	edit: function (activityId, req, callback) {
		Activity.update({id : activityId}, req, function (err, data) {
			if (!err) {
				if (data.length == 0) {
					callback({status: 400, message: "activity not found"});
				} else {
					callback(null, data);
				}
			} else {
				callback(err);
			}
		});
	},

	delete: function (activityId, callback) {
		Activity.destroy({id : activityId}).exec( function (err, data) {
			if (!err) {
				if (data.length == 0) {
					return callback({status: 400, message: "activity not found"});
				} else {
					Activity.find({parentId : activityId}).exec( function (error, comments) {
						if(!error){
							if(comments.length > 0){
								Activity.destroy({parentId : activityId}).exec( function (errors, response) {
									if(!errors){
										return callback(null,{status: 200, message: "deleted successfully"});
									}
								});
							} else {
								return callback(null,{status: 200, message: "deleted successfully"} );
							}
						}
					});
				}
			} else {
				return callback(err);
			}
		});
    },

    upload : function (data, callback) {
		var buffer = new Buffer(data.data, 'base64');
		data.data = buffer;
		data.subfolder = 'attachments';
		data.name = Math.floor(Math.random() * 100000000000 + 1);
		AWSService.upload(data, function(err, response){
			if(!err){
				delete data['subfolder'];
				delete data['data'];
				delete data['ext'];
				Attachment.create(data, function(err, imageData){
					if(err) {
						sails.log.debug(err)
						callback(err);
					} else {
						callback(null, imageData);
					}
				});
			}else{
				sails.log.error(err);
			}
		})
  	},
  	
  	like : function(data, callback){
  		Activity.findOne({id : data.activityId}).exec(function (err, activity) {
			if (!err) {
				var doc = JSON.parse(JSON.stringify(activity));
  				var existedLikes = [];
 
				if(_.contains(doc.likes, data.userId)){
					_.each(doc.likes, function(uid, idx){
						sails.log.debug("uid",uid);
						sails.log.debug("idx",idx);
						if(uid != data.userId){
							existedLikes.push(uid);
						}
						if(idx == (doc.likes.length - 1)){
							doc.likes = existedLikes;
							Activity.updateLikes(doc, function(error, updatedActivity){
								if(!error){
									callback(null, updatedActivity);
								}else{
									callback(error);
								}
							});
						}
					});
				} else {
					doc.likes.push(data.userId);
					Activity.updateLikes(doc, function(error, updatedActivity){
						if(!error){
							callback(null, updatedActivity);
						}else{
							callback(error);
						}
					});
				}
			}else {
				callback(err);
			}
		});
  	},

  	updateLikes : function(doc, callback){
  		Activity.update({id: doc.id}, doc, function(err, updatedActivity){
  			if(!err){
  				callback(null, updatedActivity[0]);
  			} else {
  				callback(err);
  			}
  		});
  	}
};

