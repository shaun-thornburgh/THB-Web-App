import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';
import { UserSchema, ROLES } from '../../api/users/users.js';
import { registerUser } from '/imports/api/users/methods.js';
import { Roles } from 'meteor/alanning:roles';
import faker from 'faker';

function getRandomInt(max) {
    return Math.floor(Math.random() * max) % max;
}
function removeComma(str) {
    return(str.replace(/,/g,''));
}

Meteor.methods({
    'resetDatabase'() {
        if(!Meteor.isServer)
        {
            console.log("From Client. Rejecting...");
            return;
        }
        console.log("Resetting Database");

        Meteor.users.remove({});
    },
    'fixtures.baseData'() {
        if(!Meteor.isServer) {
            console.log("From Client. Rejecting...");
            return;
        }

        Meteor.users.remove({"roles.__global_roles__.0": {$in: [ROLES.ADMIN]}});

        let adminObject = {
            username: 'admin',
            email: 'admin@hairboutique.com',
            password: 'admin',
            firstName: 'John',
            lastName: 'Malsher'
        };
        console.log("Create User Data");
        let adminId = Accounts.createUser(adminObject);
        Roles.addUsersToRoles( adminId, [ ROLES.ADMIN ], Roles.GLOBAL_GROUP );
    },
    'fixtures.dumbData'() {
        if(!Meteor.isServer) {
            console.log("From Client. Rejecting...");
            return;
        }

        // Creating Dumb Data For Media, Playlists, Keywords - Should be removed when app launched.
        console.log("fixture.dumbData started: ");

        try {
            const customer1 = {
                firstName: "John",
                lastName: "Smith",
                email: "johnsmith@gmail.com",
                password: "pass"
            };
            const customerId1 = registerUser.call(customer1);

            const customer2 = {
                firstName: "Michael",
                lastName: "Jackson",
                email: "michaeljackson@gmail.com",
                password: "pass"
            };
            const customerId2 = registerUser.call(customer2);

            const customer3 = {
                firstName: "Michael",
                lastName: "Brown",
                email: "michaelbrown@gmail.com",
                password: "pass"
            };
            const customerId3 = registerUser.call(customer3);

            const customer4 = {
                firstName: "Christano",
                lastName: "Ronaldo",
                email: "ronaldo@gmail.com",
                password: "pass"
            };
            const customerId4 = registerUser.call(customer4);

            const customer5 = {
                firstName: "Ryan",
                lastName: "Giggs",
                email: "ryangiggs@gmail.com",
                password: "pass"
            };
            const customerId5 = registerUser.call(customer5);

            const customer6 = {
                firstName: "Jay",
                lastName: "Leno",
                email: "jayleno@gmail.com",
                password: "pass"
            };
            const customerId6 = registerUser.call(customer6);

            const customer7 = {
                firstName: "Celen",
                lastName: "Dion",
                email: "celendion@gmail.com",
                password: "pass"
            };
            const customerId7 = registerUser.call(customer7);

            const customer8 = {
                firstName: "Bryan",
                lastName: "Adams",
                email: "bryanadams@gmail.com",
                password: "pass"
            };
            const customerId8 = registerUser.call(customer8);

            const customer9 = {
                firstName: "Elvis",
                lastName: "Priesly",
                email: "elvispriesly@gmail.com",
                password: "pass"
            };
            const customerId9 = registerUser.call(customer9);
        } catch(err) {
            console.log(err);
        }

        console.log("fixture.dumbData finished: ");
    }
});

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    console.log("Meteor.startup");

    if (!Meteor.users.find({}).count()) {
        console.log("Meteor.resetDatabase");
        Meteor.call('resetDatabase');

        console.log("Meteor.baseData");
        Meteor.call('fixtures.baseData');

        console.log("Meteor.dumbData");
        Meteor.call('fixtures.dumbData');
    }
});


