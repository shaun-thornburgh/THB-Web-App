import { ROLES } from '/imports/api/users/users.js';
import { Roles } from 'meteor/alanning:roles';

Template.registerHelper( 'isLoggedIn', () => {
    console.log("Is Logged In :" + Meteor.userId())
    return Meteor.userId();
});

Template.registerHelper( 'isSuperAdmin', () => {
    return (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP));
});

Template.registerHelper( 'isSchoolAdmin', () => {
    return (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP));
});

Template.registerHelper( 'isSchoolGeneralUser', () => {
    return (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.GENERALUSER], Roles.GLOBAL_GROUP));
});
Template.registerHelper( 'isGovernmentUser', () => {
    return (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.GOVERNMENTUSER], Roles.GLOBAL_GROUP));
});
Template.registerHelper( 'isActivePlan', (plan) => {
    let curPlan = SUBSCRIPTION_PLAN.FREE;
    if (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP))
    {
        const subscription = Subscriptions.findOne({schoolId: Meteor.user().schoolId});
        if(subscription && subscription.subscription && subscription.subscription.current_period_end > (new Date()).getTime() / 1000)
        {
            curPlan = subscription.plan;
        }
    }
    return curPlan == plan;
});
Template.registerHelper( 'subscription', () => {
    if (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP))
    {
        const subscription = Subscriptions.findOne({schoolId: Meteor.user().schoolId});
        return subscription;
    }
    return null;
});
Template.registerHelper( 'subscriptionInfo', () => {
    if (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP))
    {
        const subscription = Subscriptions.findOne({schoolId: Meteor.user().schoolId});
        return subscription;
    }
    return null;
});
Template.registerHelper( 'isActiveSubscription', () => {
    if (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP))
    {
        const subscription = Subscriptions.findOne({schoolId: Meteor.user().schoolId});
        if(subscription && subscription.plan != SUBSCRIPTION_PLAN.FREE && subscription.subscription && subscription.subscription.current_period_end > (new Date()).getTime()/1000) {
            return true;
        }
    }
    return null;
});
Template.registerHelper( 'paymentSource', () => {
    if (Meteor.userId() &&  Roles.userIsInRole(Meteor.userId(), [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP))
    {
        const subscription = Subscriptions.findOne({schoolId: Meteor.user().schoolId});
        if(subscription)
        {
            try{
                return subscription.customer.sources.data[0];
            }catch(err)
            {
                return null;
            }
        }
    }
    return null;
});
Template.registerHelper( 'userTypeStringify', () => {
    if(!Meteor.userId())
    {
        return "";
    }
    if (Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP))
    {
        return "Super Admin";
    }
    if (Roles.userIsInRole(Meteor.userId(), [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP))
    {
        return "School Admin";
    }
    if (Roles.userIsInRole(Meteor.userId(), [ROLES.GOVERNMENTUSER], Roles.GLOBAL_GROUP))
    {
        return "Government Admin";
    }
    return "User";
});
Template.registerHelper( 'membershipStringify', (plan) => {
    let memberShipDict = {"basic": "Basic", "free": "Free", "premium":"Premium"};
    if(memberShipDict[plan])
    {
        return memberShipDict[plan];
    }
    return memberShipDict.free;
});
Template.registerHelper( 'canManageSchool', (schoolId) => {
    if(Meteor.user())
    {
        if(Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP))
        {
            return true;
        }
        else if(Roles.userIsInRole(Meteor.userId(), [ROLES.SCHOOLADMIN], Roles.GLOBAL_GROUP) && Meteor.user().schoolId == schoolId)
        {
            return true;
        }
    }
    return false;
});

Template.registerHelper( 'dateStringFromUnixTimestamp', (unixTimestamp) => {
    return moment(new Date(unixTimestamp * 1000)).format('MMMM Do YYYY');
});