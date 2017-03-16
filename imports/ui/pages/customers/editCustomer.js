import './editCustomer.html'

import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

import { insertUser, registerUser, updateUser } from '../../../api/users/methods.js';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.editCustomer.onCreated(function editCustomerPageOnCreated() {
    console.log('editCustomer.onCreated');
    this.getUserId = () => FlowRouter.getParam('_id');
    this.state = new ReactiveDict();
    this.state.setDefault({
        customer: {}
    });

    if(this.getUserId())
    {// If edit
        this.state.set('customer', Meteor.users.findOne({_id: this.getUserId()}));
    }
});

Template.editCustomer.rendered = function(){
    $('.ladda-button').ladda();
};

Template.editCustomer.onRendered(function editCustomerOnRendered() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            console.log("editCustomer - subscriptionsReady");
            if(this.getUserId())
            {// If edit
                let userTemp = Meteor.users.findOne({_id: this.getUserId()});
                if(userTemp) {
                    console.log(userTemp);
                    console.log(Meteor.user()._id);

                    if (Roles.userIsInRole(userTemp._id, [ROLES.ADMIN], Roles.GLOBAL_GROUP)) {
                        userTemp.role = ROLES.ADMIN;
                    }

                    userTemp.email = userTemp.emails[0].address;

                    this.state.set('customer', userTemp);
                }
            }
            else {
                //this.state.set('student', Students.findOne({_id: this.getStudentId()}));
            }
        }
    });
});

Template.editCustomer.events({
    'submit #form-customer': function(event){
        event.preventDefault();

        let firstName = event.target.firstName.value;
        let lastName = event.target.lastName.value;
        let email = event.target.email.value;
        let password = event.target.password.value;

        const instance = Template.instance();
        var new_customer = instance.state.get('customer');

        var userObj = {firstName: firstName, lastName: lastName, email: email};//, role: role
        if(event.target.role) {
            userObj.role = event.target.role.value;
        } else {
            userObj.role = ROLES.CUSTOMER;
        }

        if(password && password != "") {
            userObj.password = password;
        }

        $(".ladda-button").ladda('start');

        if(instance.getUserId()) {
            //var userTemp = instance.state.get('user');
            userObj._id = instance.getUserId();
            delete userObj['email'];
            updateUser.call(userObj, (error) => {
                $(".ladda-button").ladda('stop');
                    if (error) {
                        console.log(error);
                        toastr['error']("Updating user info failed. Try again.")
                    }
                    else {
                        toastr['success']("User Info updated!");
                        FlowRouter.go("/admin/customers");
                    }

                }
            );
        }
        else {
            const userId = insertUser.call(userObj, (error) => {
                    $(".ladda-button").ladda('stop');
                    if (error) {
                        console.log(error);
                        toastr['error']("Adding user failed: " + error.reason)
                    }
                    else {
                        toastr['success']("User inserted!");
                        FlowRouter.go("/admin/customers");
                    }
                }
            );
            // console.log(userId);
        }
    },
    'change .role-select': function(event)
    {
        //var user = instance.state.get('user');
        //user.role = event.target.value;
        //instance.state.set('user', user);
    }
});

Template.editCustomer.helpers({
    // We use #each on an array of one item so that the "list" template is
    // removed and a new copy is added when changing lists, which is
    // important for animation purposes.
    pageTitle() {
        const instance = Template.instance();
        if(instance.getUserId()) {
            return "Edit Customer"
        }
        return "New Customer"
    },
    selectedRole(currentRole) {
        const instance = Template.instance();
        const user = instance.state.get('customer');
        return user && currentRole == user.role ? 'selected' : '';
    },
    customer() {
        const instance = Template.instance();
        console.log(instance.state.get('customer'));
        return instance.state.get('customer');
    },
    isPasswordRequired() {
        const instance = Template.instance();
        if(instance.getUserId()) {
            return "";
        } else {
            return "required"
        }

    },
    passwordPlaceholderMessage() {
        const instance = Template.instance();
        if(instance.getUserId()) {
            return "Leave this blank not to change password";
        } else {
            return "Password (Required)"
        }
    },
    isDisabled() {
        const instance = Template.instance();
        if(instance.getUserId()) {
            return "readonly";
        } else {
            return "";
        }
    }
});
