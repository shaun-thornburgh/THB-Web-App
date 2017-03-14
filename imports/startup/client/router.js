var OnBeforeActions;
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import common
import '../../ui/common/footer.js';
import '../../ui/common/ibox-tools.js';
import '../../ui/common/navigation.js';
import '../../ui/common/page-heading.js';
import '../../ui/common/right-sidebar.js';
import '../../ui/common/top-navbar.js';

// Import Layouts
import '../../ui/layouts/blank.js';
import '../../ui/layouts/main.js';
import '../../ui/layouts/not-found.html';

import '../../ui/pages/home/home.js';
import '../../ui/pages/forgotpassword/forgotPassword.js';
import '../../ui/pages/landing/landing.js';
import '../../ui/pages/login/login.js';
import '../../ui/pages/register/register.js';

import '../../ui/pages/profile/profile.js';
import '../../ui/pages/profile/settings.js';


import '../../ui/pages/customers/customers.js';
import '../../ui/pages/customers/editCustomer.js';

import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';


FlowRouter.wait();

Tracker.autorun(() => {
    // wait on roles to intialise so we can check is use is in proper role
    if (Roles.subscription.ready() && !FlowRouter._initialized) {
        FlowRouter.initialize()
    }
});

export const LoggedInSubs = new SubsManager();

var PublicGroup = FlowRouter.group();
var LoggedinGroup = FlowRouter.group({
    triggersEnter: [function(context, redirect) {
        if (!Meteor.userId()) {
            var route = FlowRouter.current();
            if(route.route.name != 'login')
            {
                Session.set("redirectAfterLogin", route.path);
                redirect('/login');
            }
        }
    }]
});

let NonLoggedinGroup = FlowRouter.group({
    triggersEnter: [function(context, redirect) {
        if (Meteor.userId()) {
            redirect('/home');
        }
    }]
});

var AdminGroup = FlowRouter.group({
    prefix: "/admin",
    triggersEnter: [function(context, redirect) {
        console.log(Meteor.userId());
        console.log(Meteor.user());
        if (!Meteor.userId()) {
            var route = FlowRouter.current();
            if(route.route.name != 'login')
            {
                Session.set("redirectAfterLogin", route.path);
                redirect('/login');
            }
        }
        else {
            if (!Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP))
            {
                redirect('/home');
            }
        }
    }]
});


PublicGroup.route('/', {
    action: function() {
        BlazeLayout.render("blankLayout", {content: "landing"});
    }
});


NonLoggedinGroup.route('/login', {
    action: function() {
        BlazeLayout.render("mainLayout", {not_logged_content: "login"});
    }
});


NonLoggedinGroup.route('/forgotPassword', {
    action: function() {
        BlazeLayout.render("mainLayout", {not_logged_content: "forgotPassword"});
    }
});


NonLoggedinGroup.route('/register', {
    action: function() {
        BlazeLayout.render("mainLayout", {not_logged_content: "register"});
    }
});

LoggedinGroup.route('/home', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "home"});
    }
});


LoggedinGroup.route('/dashboard', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "dashboard"});
    }
});

LoggedinGroup.route('/profile', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "profile"});
    }
});


LoggedinGroup.route('/settings', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "settings"});
    }
});


LoggedinGroup.route('/customers', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "customers"});
    }
});

LoggedinGroup.route('/customers/new', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "editCustomer"});
    }
});

LoggedinGroup.route('/customers/:_id/edit', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "editCustomer"});
    }
});

//
// LoggedinGroup.route('/students', {
//     action: function() {
//         BlazeLayout.render("mainLayout", {content: "students"});
//     }
// });
//
// LoggedinGroup.route('/students/new', {
//     action: function() {
//         BlazeLayout.render("mainLayout", {content: "editStudent"});
//     },
//     subscriptions: function(params, queryParams) {
//         this.register('schools', SchoolSubs.subscribe('schools'));
//     }
// });
// LoggedinGroup.route('/students/:_id/edit', {
//     action: function() {
//         BlazeLayout.render("mainLayout", {content: "editStudent"});
//     },
//     subscriptions: function(params, queryParams) {
//         this.register('schools', SchoolSubs.subscribe('schools'));
//         this.register('studentSingle', LoggedInSubs.subscribe('studentSingle', {studentId: params._id}));
//     }
// });
// LoggedinGroup.route('/students/:_id/view', {
//     action: function() {
//         BlazeLayout.render("mainLayout", {content: "student"});
//     },
//     subscriptions: function(params, queryParams) {
//         this.register('schools', SchoolSubs.subscribe('schools'));
//         this.register('studentSingle', LoggedInSubs.subscribe('studentSingle', {studentId: params._id}));
//     }
// });
// LoggedinGroup.route('/student', {
//     action: function() {
//         BlazeLayout.render("mainLayout", {content: "student"});
//     }
// });

FlowRouter.notFound = {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "notFound", not_logged_content: "notFound"});
    }
};