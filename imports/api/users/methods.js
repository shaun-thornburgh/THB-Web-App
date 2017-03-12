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


export const insertUser = new ValidatedMethod({
    name: 'users.insert',
    //validate: UserSchema.pick(['username', 'firstName', 'lastName']).validator({ clean: true, filter: false }),
    validate: new SimpleSchema({
        firstName: UserSchema.schema('firstName'),
        lastName: UserSchema.schema('lastName'),
        email: UserSchema.schema('emails.$.address'),
        password: { type: String},
        schoolId: { type: String, optional: true},
        role: { type: String, optional: true}
    }).validator({ clean: true, filter: false }),

    run({ email, firstName, lastName, password, role, schoolId}) {
        console.log("INSERT USER CALLED");
        if(Meteor.isServer) {
            if (!Roles.userIsInRole(this.userId, [ROLES.ADMIN, ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP)) {
                throw new Meteor.Error("users.insert", "Not authorized to create new users");
            }

            //if (!Roles.userIsInRole(this.userId, [ROLES.ADMIN], Roles.GLOBAL_GROUP))
            //{
            //    throw new Meteor.Error("users.insert", "Not authorized to create new users");
            //}
            let currentUser = Meteor.users.findOne(this.userId);

            const user = {
                email,
                firstName,
                lastName,
                password,
                schoolId,
                createdAt: new Date()
            };
            if (Roles.userIsInRole(this.userId, [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP)) {
                user.schoolId = currentUser.schoolId;
            }

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
                Roles.addUsersToRoles(newUserId, [role], Roles.GLOBAL_GROUP);

                if(schoolId)
                {
                    Meteor.call("schools.evaluate.updatestatus", {schoolId: schoolId});
                }

            }
            return newUserId;
        }
    }
});

const sendUserStatusUpdatedEmailToUser = function(currentUserId, user, role)
{
    const school = Schools.findOne({_id: user.schoolId});
    let roleStr = "General School User";
    if(role == ROLES.SCHOOLADMIN)
    {
        roleStr = "School Admin";
    }
    let message = "Hello " + user.firstName + " " + user.lastName + "! Your role in " + school.name + " have been updated to " + roleStr + " by " + (Roles.userIsInRole(currentUserId, [ROLES.ADMIN], Roles.GLOBAL_GROUP) ? "Super Admin" : "School Admin") + "<br/>";
    message += "Please login with your account and confirm the changes. If there's something wrong with this change, please contact your school administrator or super administrator of Koru.<br/>";
    message += "Thanks!<br/><br/>KORU Support Team";

    // TODO SEND EMAIL HERE
    //console.log(Meteor.settings)
    Email.send({
        to: user.emails[0].address,
        from: Meteor.settings.public.supportEmail,//"koru@chocolatekiwi.com",//
        subject: "[KORU] ROLE have been updated for your account",
        html: message
    });

}
export const updateUser = new ValidatedMethod({
    name: 'users.update',
    validate: new SimpleSchema({
        _id: { type: String},
        firstName: UserSchema.schema('firstName'),
        lastName: UserSchema.schema('lastName'),
        password: { type: String, optional: true},
        schoolId: { type: String, optional: true},
        role: { type: String, optional: true}
    }).validator({ clean: true, filter: false }),
    run({ _id, firstName, lastName, schoolId, password, role }) {
        if(Meteor.isServer) {

            if (!Roles.userIsInRole(this.userId, [ROLES.ADMIN, ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP)) {
                throw new Meteor.Error("users.update", "Not authorized to update");
            }

            Meteor.users.update(_id, {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    schoolId: schoolId
                }
            });

            const user = Meteor.users.findOne({_id: _id});


            if(role)
            {
                if (!Roles.userIsInRole(_id, [role], Roles.GLOBAL_GROUP)) {
                    Roles.setUserRoles(_id, [role], Roles.GLOBAL_GROUP);
                    if(schoolId)
                    {
                        Meteor.call("schools.evaluate.updatestatus", {schoolId: schoolId});
                    }
                    sendUserStatusUpdatedEmailToUser(this.userId, user, role);
                }
            }


            if(password)
            {
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
        if(user && user.schoolId)
        {
            Meteor.call("schools.evaluate.updatestatus", {schoolId: user.schoolId});
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
    // Only allow 5 users operations per connection per second
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(USERS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
