import './navigation.html'
import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

Template.navigation.rendered = function(){

    // Initialize metisMenu
    $('#side-menu').metisMenu();

};

Template.navigation.helpers({

});

// Used only on OffCanvas layout
Template.navigation.events({

    'click .close-canvas-menu' : function(){
        $('body').toggleClass("mini-navbar");
    },
    // Toggle right sidebar
    'click .alink-sign-out': function(event){
        console.log("Logout Clicked");
        event.preventDefault();
        Meteor.logout(function(err) {
            FlowRouter.go('/login');
        });
    }
});