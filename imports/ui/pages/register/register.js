/**
 * Created by developer on 11/2/16.
 */
import './register.html'

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

        Accounts.createUser({profile:{firstName:firstName, lastName: lastName}, email: email, password : password}, function(err){
            $('.ladda-button').ladda('stop');
            if (err) {
                console.log("register failed");
            } else {
                console.log("login succeed");
                FlowRouter.go("/");
            }
        });

        return false;
    }
});