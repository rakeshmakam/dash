var nodemailer = require("nodemailer");
// var sgTransport = require('nodemailer-sendgrid-transport');
var hbs = require('nodemailer-express-handlebars');

var options = {
    service: 'Gmail',
    auth: {
        user: 'mantradash@gmail.com',
        pass: 'dash@123'
    }
}

var transporter = nodemailer.createTransport(options);
transporter.use('compile', hbs({viewEngine: 'ejs', viewPath: 'views', extName: '.ejs'}));

exports.send = function(data, cb) {
	var mail = {
		from: 'Dash <noreply@dash.com>',
		to: data.email,
		subject: 'Dash invitation',
		template: 'invitation',
		context: data
	}

	transporter.sendMail(mail, function(err, res){
		if (err) { 
			cb(err);
		}else{
			cb(null, res);
		}
	});
};

exports.resetPassword = function(data, cb) {
	var mail = {
		from: 'Dash <noreply@dash.com>',
		to: data.email,
		subject: 'Dash invitation to Reset Password',
		template: 'resetpassword',
		context: data
	}

	transporter.sendMail(mail, function(err, res){
		if (err) { 
			cb(err);
		}else{
			cb(null, res);
		}
	});
};

exports.taskAlert = function (data, cb) {
	sails.log.debug("taskmail",data);
	var mail = {
		from: 'Dash <noreply@dash.com>',
		to: data.assignedTo.email,
		subject: 'New Task is assigned to you',
		template: 'taskDescription',
		context: data
	}

	transporter.sendMail(mail, function(err, res){
		if (err) { 
			cb(err);
		}else{
			cb(null, res);
		}
	});
};

exports.projectAlertAdded = function (data, cb) {
	sails.log.debug("alertadded",data);
	
	var mail = {
		from: 'Dash <noreply@dash.com>',
		to: data.added.toString(),
		
		subject: 'New Project is assigned to you',
		template: 'projectAdded',
		context: data
	}
	sails.log.debug(data.toString());

	transporter.sendMail(mail, function(err, res ){
		if (err) { 
			cb(err);
		}else{
			cb(null, res);
		}
	});
};

exports.projectAlertRemoved = function (data, cb) {
	sails.log.debug("alertremoved",data);
	
	var mail = {
		from: 'Dash <noreply@dash.com>',
		to: data.removed.toString(),
		subject: 'You are removed from the project',
		template: 'projectRemoved',
		context: data
	}
	sails.log.debug(data.toString());

	transporter.sendMail(mail, function(err, res){

		if (err) { 
			cb(err);
		}else{
			cb(null, res);
		}
	});
};