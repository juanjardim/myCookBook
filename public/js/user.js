$(document).ready(function() {
    $('#loginForm').bootstrapValidator({
        externalSubmitButtons: $('button.loginSubmitBtn'),
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        submitButtons: 'button[type="submit"]',
        fields: {
            identity: {
                validators: {
                    notEmpty: {
                        message: 'The username is required'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'The username can only consist of alphabetical, number and underscore'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    }
                }
            }
        }
    });

   /* $('#registrationForm').bootstrapValidator({
        externalSubmitButtons: $('button.registerSubmitBtn'),
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        submitButtons: 'button[type="submit"]',
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: 'The username is required'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'The username can only consist of alphabetical, number and underscore'
                    },
                    different : {
                        field : 'username',
                        message: 'The username and password cannot be the same as each other'
                    }
                }
            },
            email :{
                validators: {
                    emailAddress : {
                        message: 'The input is not a valid email address'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    },
                    identical:{
                        field : 'passwordVerify',
                        message: 'The password and its confirm are not the same'
                    },
                    different : {
                        field : 'username',
                        message: 'The password cannot be the same as username'
                    }
                }
            },
            passwordVerify: {
                validators: {
                    notEmpty: {
                        message: 'The confirm password is required and cannot be empty'
                    },
                    identical:{
                        field : 'password',
                        message: 'The password and its confirm are not the same'
                    },
                    different : {
                        field : 'username',
                        message: 'The password cannot be the same as username'
                    }
                }
            }
        }
    });*/
});