import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { UserSchema, ROLES } from './users.js';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

export const createTestAdminUser = new ValidatedMethod({
    name: 'users.createTestAdmin',
    validate: new SimpleSchema({
    }).validator({ clean: true, filter: false }),
    run({ }) {
        if(Meteor.isServer && Meteor.isTest) {
            const user = {
                username: "admin",
                firstName: "Christano",
                lastName: "Ronaldo",
                password: "password",
                createdAt: new Date()
            };
            let userId = Accounts.createUser(user);
            Roles.addUsersToRoles( userId, [ ROLES.ADMIN ], Roles.GLOBAL_GROUP );
            return userId;
        }
    }
});

export const registerUser = new ValidatedMethod({
    name: 'users.register',
    validate: new SimpleSchema({
        firstName: UserSchema.schema('firstName'),
        lastName: UserSchema.schema('lastName'),
        email: UserSchema.schema('emails.$.address'),
        password: { type: String}
    }).validator({ clean: true, filter: false }),
    run({ email, firstName, lastName, password, role}) {
        console.log("INSERT USER CALLED");

        const user = {
            email,
            firstName,
            lastName,
            password,
            createdAt: new Date()
        };

        let newUserId = null;
        try {
            newUserId = Accounts.createUser(user);
        } catch (err) {
            console.log(err);
            throw new Meteor.Error("users.insert", err.reason);
        }
        console.log("New User ID: " + newUserId);
        if(Meteor.isServer) {
            if (newUserId) {
                Roles.addUsersToRoles(newUserId, [ROLES.CUSTOMER], Roles.GLOBAL_GROUP);
            }
            return newUserId;
        }
        if(Meteor.isClient)
        {
            console.log("This is client");
            console.log(newUserId);
        }
    }
});


export const insertUser = new ValidatedMethod({
    name: 'users.insert',
    validate: new SimpleSchema({
        firstName: UserSchema.schema('firstName'),
        lastName: UserSchema.schema('lastName'),
        email: UserSchema.schema('emails.$.address'),
        password: { type: String},
        role: { type: String, optional: true}
    }).validator({ clean: true, filter: false }),

    run({ email, firstName, lastName, password, role}) {
        console.log("INSERT USER CALLED");
        if(Meteor.isServer) {
            if (!Roles.userIsInRole(this.userId, [ROLES.ADMIN], Roles.GLOBAL_GROUP)) {
                throw new Meteor.Error("users.insert", "Not authorized to create new customers");
            }

            let currentUser = Meteor.users.findOne(this.userId);

            const user = {
                email,
                firstName,
                lastName,
                password,
                createdAt: new Date()
            };

            console.log(user);
            let newUserId = null;
            try {
                newUserId = Accounts.createUser(user);
            } catch (err) {
                console.log(err);
                throw new Meteor.Error("users.insert", err.reason);
            }

            console.log("New User ID: " + newUserId);

            if (newUserId && role) {
                Roles.addUsersToRoles(newUserId, [ROLES.CUSTOMER], Roles.GLOBAL_GROUP);
            }
            return newUserId;
        }
    }
});

export const updateUser = new ValidatedMethod({
    name: 'users.update',
    validate: new SimpleSchema({
        _id: { type: String},
        firstName: UserSchema.schema('firstName'),
        lastName: UserSchema.schema('lastName'),
        password: { type: String, optional: true},
        role: { type: String, optional: true}
    }).validator({ clean: true, filter: false }),
    run({ _id, firstName, lastName, password, role }) {
        if(Meteor.isServer) {
            if (!Roles.userIsInRole(this.userId, [ROLES.ADMIN], Roles.GLOBAL_GROUP)) {
                throw new Meteor.Error("users.update", "Not authorized to update");
            }

            Meteor.users.update(_id, {
                $set: {
                    firstName: firstName,
                    lastName: lastName
                }
            });

            const user = Meteor.users.findOne({_id: _id});

            if(role) {
                if (!Roles.userIsInRole(_id, [role], Roles.GLOBAL_GROUP)) {
                    Roles.setUserRoles(_id, [role], Roles.GLOBAL_GROUP);
                }
            }

            if(password) {
                Accounts.setPassword(_id, password, {logout: false});
            }
        }
    }
});

export const updateProfile= new ValidatedMethod({
    name: 'users.update.profile',
    validate: new SimpleSchema({
        firstName: UserSchema.schema('firstName'),
        lastName: UserSchema.schema('lastName'),
    }).validator({ clean: true, filter: false }),
    run({ firstName, lastName }) {
        if(Meteor.isServer) {

            if (!this.userId) {
                throw new Meteor.Error("users.update.profile", "Not authorized to update profile");
            }
            Meteor.users.update(this.userId, {
                $set: {
                    firstName: firstName,
                    lastName: lastName
                }
            });
        }
    }
});


export const removeUser = new ValidatedMethod({
    name: 'users.remove',
    validate: new SimpleSchema({
        _id: { type: String},
    }).validator({ clean: true, filter: false }),
    run({ _id }) {
        if (!Roles.userIsInRole(this.userId, [ROLES.ADMIN], Roles.GLOBAL_GROUP))
        {
            throw new Meteor.Error("users.remove", "Not authorized to remove");
        }
        const user = Meteor.users.findOne(_id);
        if(!user) {
            throw new Meteor.Error("users.remove", "User not found!");
        }
        Meteor.users.remove(_id);
    },
});

//Get client of all method names on Users
const USERS_METHODS = _.pluck([
    insertUser,
    updateUser,
    removeUser,
    updateProfile
], 'name');

if (Meteor.isServer) {
    // Only allow 5 customers operations per connection per second
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(USERS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
