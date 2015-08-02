"use strict";

require.config({
    paths : {
        backbone : "../bower_components/backbone/backbone",
        underscore : "../bower_components/underscore/underscore",
        jquery : "../bower_components/jquery/dist/jquery",
        "backbone.marionette" : "../bower_components/backbone.marionette/lib/core/backbone.marionette",
        "backbone.radio" : "../bower_components/backbone.radio/build/backbone.radio",
        "backbone.babysitter" : "../bower_components/backbone.babysitter/lib/backbone.babysitter",
        text: "../bower_components/requirejs-text/text",
        "async": "../bower_components/async/lib/async"
    },
    enforceDefine: true,
    map: {
        '*': {
            'backbone.wreqr': 'backbone.radio'
        }
    }
});

define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "visualization",
    "text!/json/data.json"
], function (Marionette, Radio, Shim, Visualization, dataJson) {
    window.Radio = Radio;

    // create main App
    var App = new Marionette.Application();
    App.Channel = Radio.channel("visualization");

    // create main region
    var mainregion = Marionette.Region.extend({
      el: 'body'
    });
    App.addRegions({
      main: "body"
    });


    // start visualization
    var visualization = new Visualization("visualization");
    var visualizationChannel = visualization.Channel;
    visualization.start({
        dataArray : JSON.parse(dataJson)
    });
    var visualizationView = visualizationChannel.request("get:root");
    App.main.show(visualizationView);




});
