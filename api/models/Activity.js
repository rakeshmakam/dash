/**
* Activity.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var base_url = "https://s3-ap-southeast-1.amazonaws.com/mantra-dash/attachments/";
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
		var result = [];
		var counter = 0;
		// if(data.userData.role == 'user'){
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
				_.each(data.userData.projects, function(project, idx){
					var fn = (function(projectData){
						return function(){
							var conditions = {};
							conditions.parentId = null;
							conditions.project = projectData.id;
							Activity.findActivities(conditions, function(err, response){
								if(!err){
									if(response && response.length > 0){
										_.each(response, function(info){
											result.push(info);
										});
									}
									counter = counter + 1;
								} else {
									callback(err);
								}
							});
						}
					})(project);
					fn();
					if(idx == (data.userData.projects).length-1){
						function respond(){
							if(counter == data.userData.projects.length){
								callback(null, result);
							} else {
								setTimeout(respond, 100);
							}
						}
						respond();
					}
				});
			}
		// } else {
		// 	var conditions = {};
		// 	conditions.parentId = null;
		// 	if(data.project){
		// 		conditions.project = data.project;
		// 	}
		// 	Activity.findActivities(conditions, function(err, response){
		// 		if(!err){
		// 			callback(null, response);
		// 		} else {
		// 			callback(err);
		// 		}
		// 	});
		// }
	},

	findActivities: function(data, callback){
		Activity.find({where:data, sort: 'createdAt DESC'}).populateAll().exec(function (err, activities) {
			if (!err) {
				if(activities.length > 0){
					activities.forEach(function(activity, idx){
						var fn = (function(activityData){
							return function(){
								if(activityData.attachment){
									activityData.attachment_name = activityData.attachment;
									activityData.attachment = base_url + activityData.attachment;
								}
								delete activityData.user.hashKey;
								delete activityData.user.email_verified;
								delete activityData.user.password;
								Activity.findComments({parentId: activityData.id}, function(error, comments){
									if(!error){
										activityData.comments = comments;
									}
								});
							}
						})(activity);
						fn();
						if(idx == (activities.length-1)){
							function respond(){
								if(activities){
									if(activities[activities.length-1].comments){
										callback(null, activities);
									} else {
										setTimeout(respond, 100);
									}
								}
							}
							respond();
						}
					});
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

	addComment: function(data, callback){
		data.likes = [];
		if(data.userId){
			User.findOne({id: data.userId}, function(err, user){
				if(!err){
					delete data.userId;
					var userInfo = {};
					userInfo.email = user.email;
					userInfo.name = user.name;
					userInfo.id = user.id;
					userInfo.avatar = user.avatar;
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
					return callback(null, data.id);
				}
			} else {
				return callback(err);
			}
		});
    },
    upload : function(data, callback){
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

