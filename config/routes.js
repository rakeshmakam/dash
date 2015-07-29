/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  '/': {
    view: 'homepage'
  },
  'POST /user'                      : 'UserController.add',
  'PUT /user'                       : 'UserController.edit',
  'POST /reset_password_initiate'   : 'UserController.resetPasswordInitiate',
  'PUT /set_new_password'           : 'UserController.setNewPassword',
  'PUT /reset_password'             : 'UserController.resetPassword',
  'PUT /basic_info'                 : 'UserController.basicInfo',
  'POST /user/login'                : 'UserController.login',
  'GET /user/logout'                : 'UserController.logout',
  'DELETE /user/:id'                : 'UserController.delete',
  'GET /user'                       : 'UserController.index',
  'GET /account'                    : 'UserController.profile',
  'GET /status'                     : 'UserController.status',
  'GET /user_info/:id'              : 'UserController.userInfo',

  'GET /workspace'                  : 'WorkspaceController.index',
  'GET /workspace/:id'              : 'WorkspaceController.workspaceDetails',
  'POST /workspace'                 : 'WorkspaceController.add',
  'PUT /workspace/:id'              : 'WorkspaceController.edit',
  'DELETE /workspace/:id'           : 'WorkspaceController.delete',

  'POST /project'                   : 'ProjectController.add',
  'GET /myprojects'                 : 'ProjectController.myprojects',
  'GET /project'                    : 'ProjectController.index',
  'GET /project/:id'                : 'ProjectController.projectDetails',
  'PUT /project/:id'                : 'ProjectController.edit',
  'POST /notify'                    : 'ProjectController.notification',
  'DELETE /project/:id'             : 'ProjectController.delete',

  'GET /projects_related_to_workspace/:id' : 'ProjectController.getProjectsDetailsRelatedToWorkspace',


  'POST /activity'                  : 'ActivityController.add',
  'GET /activity/:projectId?'       : 'ActivityController.index',
  'PUT /activity/:id'               : 'ActivityController.edit',
  'POST /activity/like'             : 'ActivityController.like',
  'POST /activity/comment'          : 'ActivityController.comment',
  'POST /activity/comment/like'     : 'ActivityController.likeComment',
  // 'get /activity/comments/:activityId'      : 'ActivityController.findComments', 
  'DELETE /activity/:id'            : 'ActivityController.delete',

  'POST /avatar'                    : 'ImageController.upload',
  'DELETE /avatar/:name'            : 'ImageController.delete',

  //for attachment of an activity

  'POST /attachment'                : 'ActivityController.upload',
  'GET /user/suggest/:term'         : 'UserController.suggest',
  // 'DELETE /attachment/:name'            : 'AttachmentController.delete',

  'GET /task/get'                   : 'TasksController.index',
  'POST /task/add'                  : 'TasksController.add',
  'PUT /task/edit/:id'              : 'TasksController.edit',
  'DELETE /task/:id'                : 'TasksController.delete',
  'GET /task/assignedTask'          : 'TasksController.assignedTask'

  // '/test' : {
  //   view:'testing'
  // }

  // '/': {
  //   view: 'homepage'
  // }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
