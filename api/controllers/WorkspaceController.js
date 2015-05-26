/**
 * WorkspaceController
 *
 * @description :: Server-side logic for managing workspaces
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	//Get list of workspace
	index: function (req, res) {
		Workspace.index(req.body, function (err, data) {
			if (!err) {
				res.json(data);
			} else {
				res.negotiate(err);
			}
		});
	},

	//Add new workspace
	add: function (req, res) {
		Workspace.add(req.body, function (err, workspace) {
			if (!err) {
				res.json(workspace);
			} else {
				res.negotiate(err);
			}
		})
	},

	//Edit the workspace
	edit: function (req, res) {
		var workspaceId = req.param('id');
		Workspace.edit(workspaceId, req.body, function (err, workspace) {
			if (!err) {
				res.json(workspace);
			} else {
				res.negotiate(err);
			}
		});
	},

	//Delete Workspace
    delete: function (req, res){
		var workspaceId = req.param('id');
		if (workspaceId) {
			Workspace.delete(workspaceId, function (err, data) {
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

    workspaceDetails: function (req, res) {
    	var workspaceId = req.param('id');
		if (workspaceId) {
			Workspace.workspaceDetails(workspaceId, function (err, workspace) {
				if (!err) {
					res.json(workspace);
				} else { 
					res.negotiate(err);
				}
			})
		} else {
			res.status(400).json({message: "ID is missing"});
		}
    }
};

