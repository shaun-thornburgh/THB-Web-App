/**
 * Created by developer on 11/2/16.
 */
import './login.html'

Template.login.rendered = function(){
    $('.ladda-button').ladda();
};

Template.login.events({

    'submit #form-login': function(event){

        event.preventDefault();
        let email = event.target.email.value;
        let passwd = event.target.password.value;
        $('.ladda-button').ladda('start');

        Meteor.loginWithPassword(email, passwd, function(error){
            $('.ladda-button').ladda('stop');

            if (error){
                console.log("login failed");
               swal({
                   title: "Login Failed!",
                   text: "Wrong username or password. Please try again!",
                   type: "warning"
               });
                //template.find('#form-messages').html(error.reason);
            }else{
                console.log("login succeed");
                FlowRouter.go("/home");
            }
        });
    },


    'submit #form-password': function(event){
        // Stop normal behavior
        event.preventDefault();
        var mail = event.target.mail.value;
        $('.ladda-button').ladda('start');

        Accounts.forgotPassword({email: mail}, function(err) {
            $('.ladda-button').ladda('stop');

            if (err) {
                    if (err.message === 'User not found [403]') {
                        console.log('This email does not exist.');
                    } else {
                        console.log('We are sorry but something went wrong.');
                    }
                } else {
                    console.log('Email Sent. Check your mailbox.');
                }
            });

            Accounts.emailTemplates.sendResetPasswordEmail

    },
})