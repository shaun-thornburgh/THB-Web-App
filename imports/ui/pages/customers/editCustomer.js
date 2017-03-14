import './editCustomer.html'

import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

import { insertUser, updateUser } from '../../../api/users/methods.js';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.editCustomer.onCreated(function editCustomerPageOnCreated() {
    console.log('editCustomer.onCreated');
    this.getUserId = () => FlowRouter.getParam('_id');
    this.state = new ReactiveDict();
    this.state.setDefault({
        user: {}
    });

    if(this.getUserId())
    {// If edit
        this.state.set('user', Meteor.users.findOne({_id: this.getUserId()}));
    }
});

Template.editCustomer.rendered = function(){
    $('.ladda-button').ladda();
};

Template.editCustomer.events({

    'submit #form-customer': function(event){
        event.preventDefault();

        let firstName = event.target.firstName.value;
        let lastName = event.target.lastName.value;
        let email = event.target.email.value;
        let password = event.target.password.value;

        const instance = Template.instance();
        var user = instance.state.get('customer');

        var userObj = {firstName: firstName, lastName: lastName, email: email};//, role: role
        if(event.target.role)
        {
            userObj.role = event.target.role.value;
        }
        if(user.schoolId)
        {
            userObj.schoolId = user.schoolId;
        }
        if(password && password != "")
        {
            userObj.password = password;
        }
        $(".ladda-button").ladda('start');
        if(instance.getUserId())
        {
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
                        toastr['success']("User Info updated!")
                        FlowRouter.go("/customers");
                    }

                }
            );
        }
        else
        {
            const userId = insertUser.call(userObj, (error) => {
                    $(".ladda-button").ladda('stop');
                    if (error) {
                        console.log(error);
                        toastr['error']("Adding user failed: " + error.reason)
                    }
                    else {
                        toastr['success']("User inserted!")
                        FlowRouter.go("/customers");
                    }
                }
            );
            console.log(userId);
        }
    },
    'click .select-school': function(event)
    {
        const instance = Template.instance();
        Modal.show('schoolSelectModal2',
            {
                onSchoolSelected(school) {
                    console.log("onSchoolSelectedDone")
                    var user = instance.state.get('user');
                    user.schoolId = school._id;
                    instance.state.set('user', user);
                }
            }
        );
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
    pageTitle()
    {
        const instance = Template.instance();
        if(instance.getUserId())
        {
            return "Edit Customer"
        }
        return "New Customer"
    },
    selectedRole(currentRole)
    {
        const instance = Template.instance();
        const user = instance.state.get('customer');
        return user && currentRole == user.role ? 'selected' : '';
    },
    user() {
        const instance = Template.instance();
        return instance.state.get('customer');
    },
    schoolName() {
        const instance = Template.instance();
        const user = instance.state.get('customer');
        if(user && user.schoolId)
        {
            const school = Schools.findOne({_id: user.schoolId});
            return school.name;
        }
        return "None Selected";
    },
    isPasswordRequired()
    {
        const instance = Template.instance();
        if(instance.getUserId())
        {
            return "";
        }
        else
        {
            return "required"
        }

    },
    passwordPlaceholderMessage()
    {
        const instance = Template.instance();
        if(instance.getUserId())
        {
            return "Leave this blank not to change password";
        }
        else
        {
            return "Password (Required)"
        }
    },
    isDisabled()
    {
        const instance = Template.instance();
        if(instance.getUserId())
        {
            return "readonly";
        }
        else
        {
            return "";
        }
    }

});
