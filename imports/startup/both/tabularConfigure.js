import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

if(Meteor.isClient)
{

}

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);
