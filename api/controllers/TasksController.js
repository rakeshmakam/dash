/**
 * TasksController
 *
 * @description :: Server-side logic for managing tasks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var base_url = "https://s3-ap-southeast-1.amazonaws.com/mantra-dash/avatar/";
module.exports = {
	

  index : function(req, res){
    var user = req.session.user;
    Task.index(user, function (err, tasks) {
      if (!err) {
        _.map(tasks,function(task){
          task.assignedBy.avatar = base_url+task.assignedBy.avatar;
          task.assignedTo.avatar = base_url+task.assignedTo.avatar;
        })
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
   var user = req.session.user;
   req.body.assignedBy = user.id;

   if(user.id != req.body.assignedTo){
      Task.add(req.body, function (err, task) {
         if (!err) {
            task.assignedBy.avatar = base_url+task.assignedBy.avatar;
            task.assignedTo.avatar = base_url+task.assignedTo.avatar;
            res.json(task);
            EmailService.taskAlert(task, function(error, data){
               if (!error) {
                  sails.log.debug(data);
               } else {
                  sails.log.error(error);
               }
            });
         } else {
            res.negotiate(err);
         }
      });
   } else {
      res.badRequest('assinedTo and assigned by should not be same');
   }

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
  },

  assignedTask: function (req, res){
   var user = req.session.user;
   Task.assignedTask(user,function (err, tasks){
      if(!err){
         res.json(tasks);
      } else {
         res.negotiate(err);
      }
   })
  }

};

