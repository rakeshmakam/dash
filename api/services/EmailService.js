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

exports.taskAlert = function(data, cb) {
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