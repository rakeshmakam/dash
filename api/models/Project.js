/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: "project",

	attributes: {
		name: {
			type: "string",
			required : true,
			unique: true
		},

		description: {
			type: "string",
			required : true,
		},

		workspace: {
			required : true,
			model: 'Workspace'
		},

		activity: {
			collection: 'Activity',
			via: 'project'
		},

		users: {
			collection: 'User',
			via: 'projects'
		}
	},

	list: function (data, callback) {
		Project.find().populateAll().exec(function (err, data) {
			if (!err) {
				callback(null, data);
			} else {
				callback(err);
			}
		});
	},

	add: function (data, callback) {
		Project.create(data, function (err, project) {
			if(!err) {
				callback(null, project);
			} else {
				callback(err);
			}
		});
	},

	edit: function (projectId, req, callback) {
		Project.update({id : projectId}, req, function (err, data) {
			if (!err) {
				if (data.length == 0) {
					callback({status: 402, message: "Project not found"});
				} else {
					callback(null, data);
				}
			} else {
				callback(err);
			}
		});
	},

	delete: function (projectId, callback) {
		Project.destroy({id : projectId}).exec( function (err, data) {
			if (!err) {
				if (data.length == 0) {
					return callback({status: 402, message: "Project not found"});
				} else {
					return callback(null, data.id);
				}
			} else {
				return callback(err);
			}
		});
    },

    projectDetails: function (projectId, callback) {
    	Project.find({id : projectId}).populateAll().exec( function (err, project) {
			if (!err) {
				if (project.length == 0) {
					return callback({status: 402, message: "Project not found"});
				} else {
					return callback(null, project);
				}
			} else {
				return callback(err);
			}
		});
    },

    getProjectsDetailsRelatedToWorkspace: function (workspaceId, callback) {
    	Project.find({workspace : workspaceId}).populateAll().exec( function (err, projects) {
    		if (!err) {
				if (projects.length == 0) {
					return callback({status: 402, message: "There are no projects under this workspace or there is no such workspace"});
				} else {
					return callback(null, projects);
				}
			} else {
				return callback(err);
			}
    	})
    }
};

