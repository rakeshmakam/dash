/**
 * WorkspaceController
 *
 * @description :: Server-side logic for managing workspaces
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	//Get list of workspace
	list: function (req, res) {
		Workspace.list(req.body, function (err, user) {
			if (!err) {
				res.json(user);
			} else {
				res.negotiate(err);
			}
		});
	},

	//Add new workspace
	add: function (req, res) {
		Workspace.add(req.body, function (err, user) {
			if (!err) {
				res.json(user);
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
        	res.status(401).json({message: "ID is missing"});
        }
    },


};

