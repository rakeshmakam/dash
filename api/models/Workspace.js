/**
* Workspace.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: "workspace",

	attributes: {
		name: {
			type: "string",
			unique: true,
			required : true
		},

		projects: {
			collection: 'Project',
			via: 'workspace'
		}
	},

	index: function (data, callback) {
		Workspace.find().populateAll().exec(function (err, data) {
			if (!err) {
				callback(null, data);
			} else {
				callback(err);
			}
		});
	},

	add: function (data, callback) {
		Workspace.create(data, function(err, workspace){
			if(!err) {
				callback(null, workspace);
			} else {
				callback(err);
			}
		});
	},

	edit: function (workspaceId, req, callback) {
		Workspace.update({id : workspaceId}, req, function (err, workspace) {
			if (!err) {
				if (workspace.length == 0) {
					return callback({status: 402, message: "Workspace not found"});
				} else {
					return callback(null, workspace);
				}
			} else {
				return callback(err);
			}
		});
	},

	delete: function (workspaceId, callback) {
		Workspace.destroy({id : workspaceId}).exec(function (err, data) {
			if (!err) {
				if (data.length == 0) {
					return callback({status: 402, message: "Workspace not found"});
				} else {
					return callback(null, data.id);
				}
			} else {
				return callback(err);
			}
		});
    },

    workspaceDetails: function (workspaceId, callback) {
    	Workspace.find({id : workspaceId}).populateAll().exec( function (err, workspace) {
			if (!err) {
				if (workspace.length == 0) {
					return callback({status: 402, message: "Workspace not found"});
				} else {
					return callback(null, workspace);
				}
			} else {
				return callback(err);
			}
		});
    }
	
};

