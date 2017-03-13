import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import faker from 'faker';
import { Accounts } from 'meteor/accounts-base';


Schema = {};

Schema.User = new SimpleSchema({
    username: {
        type: String,
        optional: true
    },
    emails: {
        type: Array,
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    },
    firstName: {
        type: String,
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    phoneNumber: {
        type: String,
        optional: true
    }
});

Meteor.users.attachSchema(Schema.User);

export const UserSchema = Schema.User;

export const ROLES = {
    ADMIN: "admin",
    CUSTOMER: 'customer'
};

// Deny all client-side updates to user documents
Meteor.users.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Factory.define('user', Meteor.users, {
    username: () => faker.lorem.word() + Random.id(10),
    heartbeat: () => new Date(),
    createdAt: () => new Date(),
    firstName: () => faker.lorem.word(),
    lastName: () => faker.lorem.word(),
    password: () => faker.lorem.word()
});

if(Meteor.isServer) {
    Accounts.onCreateUser(function(options, user) {
        console.log("On Create User");
        if(options.firstName) {
            user.firstName = options.firstName;
        }
        if(options.lastName) {
            user.lastName = options.lastName;
        }
        if(options.phoneNumber) {
            user.phoneNumber = options.phoneNumber;
        }
        return user;
    });
}


