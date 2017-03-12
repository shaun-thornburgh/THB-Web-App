import { Meteor } from 'meteor/meteor';
//import { ReactiveVar } from 'meteor/reactive-var';
//import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
//import { ActiveRoute } from 'meteor/zimme:active-route';
//import { FlowRouter } from 'meteor/kadira:flow-router';
//import { TAPi18n } from 'meteor/tap:i18n';
//import { T9n } from 'meteor/softwarerero:accounts-t9n';
//import { _ } from 'meteor/underscore';
//import { $ } from 'meteor/jquery';
import './main.html';
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);

Template.mainLayout.rendered = function(){
    if(!Meteor.userId())
    {
        //$('body').addClass('gray-bg');
    }
    else
    {
        $('body').removeClass('gray-bg');
    }
    // Minimalize menu when screen is less than 768px
    $(window).bind("resize load", function () {
        if ($(this).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    });

    // Fix height of layout when resize, scroll and load
    //$(window).bind("load resize scroll", function() {
        //if(!$("body").hasClass('body-small')) {
        //
        //    var navbarHeigh = $('nav.navbar-default').height();
        //    var wrapperHeigh = $('#page-wrapper').height();
        //
        //    if(navbarHeigh > wrapperHeigh){
        //        $('#page-wrapper').css("min-height", navbarHeigh + "px");
        //    }
        //
        //    if(navbarHeigh < wrapperHeigh){
        //        $('#page-wrapper').css("min-height", $(window).height()  + "px");
        //    }
        //
        //    if ($('body').hasClass('fixed-nav')) {
        //        if (navbarHeigh > wrapperHeigh) {
        //            $('#page-wrapper').css("min-height", navbarHeigh  + "px");
        //        } else {
        //            $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
        //        }
        //    }
        //}
    //});


    // SKIN OPTIONS
    // Uncomment this if you want to have different skin option:
    // Available skin: (skin-1 or skin-3, skin-2 deprecated, md-skin)
    // $('body').addClass('md-skin');

    // FIXED-SIDEBAR
    // Uncomment this if you want to have fixed left navigation
    // $('body').addClass('fixed-sidebar');
    // $('.sidebar-collapse').slimScroll({
    //     height: '100%',
    //     railOpacity: 0.9
    // });

    // BOXED LAYOUT
    // Uncomment this if you want to have boxed layout
    // $('body').addClass('boxed-layout');


};


Template.mainLayout.destroyed = function(){
    // Remove special color for blank layout
    if(!Meteor.userId())
    {
        $('body').removeClass('gray-bg');
    }

};