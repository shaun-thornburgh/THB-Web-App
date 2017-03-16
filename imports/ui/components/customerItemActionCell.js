import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';
import { removeUser } from '/imports/api/users/methods.js'

import './customerItemActionCell.html';

Template.customerItemActionCell.onCreated(function customerItemEditCellOnCreated() {
});

Template.customerItemActionCell.events({
    'click .button-remove' (event) {
        removeUser.call({_id: this._id}, function(err, response) {
            if(err) {
                console.log("ERROR : ", err);
            }
        });
    }
});

Template.customerItemActionCell.helpers({
    isEditable() {
        if (Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP)) {
            return true;
        }
        return false;
    },
    isCurrentUser() {
        return this._id == Meteor.userId();
    }
});
