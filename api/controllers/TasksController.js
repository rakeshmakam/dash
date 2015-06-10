/**
 * TasksController
 *
 * @description :: Server-side logic for managing tasks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	

  index : function(req, res){
    var user = req.session.user;
    Task.index(user, function (err, tasks) {
      if (!err) {
        res.json(tasks);
      } else {
        res.negotiate(err);
      }
    });
  },

  /**
   * `TasksController.add()`
   */
  add: function (req, res) {
    Task.add(req.body, function (err, task) {
      if (!err) {
        res.json(task);
      } else {
        res.negotiate(err);
      }
    });
  },

  /**
   * `TasksController.edit()`
   */
  edit: function (req, res) {
    var taskId = req.param('id');
    Task.edit(taskId, req.body, function (err, task) {
      if (!err) {
        res.json(task);
      } else {
        res.negotiate(err);
      }
    });
  },

  /**
   * `TasksController.delete()`
   */
  delete: function (req, res) {
    var taskId = req.param('id');
    Task.delete(taskId, function (err, task) {
        if (!err) {
          res.json("Deleted Successfully");
        } else { 
          res.negotiate(err);
        }
      })
  }

};

