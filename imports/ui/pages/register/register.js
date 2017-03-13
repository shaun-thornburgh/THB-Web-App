/**
 * Created by developer on 11/2/16.
 */
import './register.html';
import { registerUser } from '/imports/api/users/methods.js';

Template.register.rendered = function(){
    $('.ladda-button').ladda();
};

Template.register.events({
    'submit #register-form' : function(e, t) {
        e.preventDefault();
        let firstName = event.target.firstName.value;
        let lastName = event.target.lastName.value;
        let password = event.target.password.value;
        let email = event.target.email.value;

        // Trim and validate the input
        $('.ladda-button').ladda('start');
        registerUser.call({firstName:firstName, lastName: lastName, email: email, password : password}, function(err){
            $('.ladda-button').ladda('stop');
            if (err) {
                console.log("register failed");
            } else {
                console.log(Meteor.userId());
                console.log("login succeed");
                FlowRouter.go("/");
            }
        });
        //
        // Accounts.createUser({firstName:firstName, lastName: lastName, email: email, password : password}, function(err, userId){
        //     $('.ladda-button').ladda('stop');
        //     if (err) {
        //         console.log("register failed");
        //     } else {
        //         console.log(Meteor.userId());
        //         console.log("login succeed");
        //         Roles.addUsersToRoles( Meteor.userId(), [ ROLES.CUSTOMER ], Roles.GLOBAL_GROUP );
        //         FlowRouter.go("/");
        //     }
        // });

        return false;
    }
});