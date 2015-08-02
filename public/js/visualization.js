define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "../assets/decade/js/decade",
    "../assets/years/js/years.js",
    "text!templates/visualization.html",
], function (Marionette, Radio, Shim, Decade, Years, VisualizationTemplate) {

    var VisualizationConstructor = function(channelName){
        var Visualization = new Marionette.Application();
        Visualization.Channel = Radio.channel(channelName);

        var visualizationLayout = Marionette.LayoutView.extend({
            className: "visualization",
            template: _.template(VisualizationTemplate),
            regions: {
                header: "header",
                top: ".top",
                content: ".content",
                rotatemodal: ".rotatemodal",
                footer: "footer"
            },
            onShow: function(){
              Visualization.Channel.trigger("start:decade");
            }
        });

        Visualization.on("start", function(args){

            Visualization.mainlayout = new visualizationLayout();

            Visualization.Channel.reply("get:root", function(){
                return Visualization.mainlayout;
            });

            // show myevents
            Visualization.Channel.on("start:decade", function(){

              // decade chunk
              var data = args.dataArray;
              var n = 10;
              var decadeData = _.groupBy(data, function(element, index){
                return Math.floor(index/n);
              });
              decadeData = _.toArray(decadeData); //Added this to convert the returned object to an array.

                // start decade
                var decade = new Decade("decade");
                var decadeChannel = decade.Channel;
                decade.start({
                    decadeData: decadeData
                });

                var decadeView = decadeChannel.request("get:root");
                Visualization.mainlayout.getRegion('content').show(decadeView);

                // start years
                var years = new Years("years");
                var yearsChannel = years.Channel;
                years.start({
                    decadeData: args.dataArray
                });

                var yearsView = yearsChannel.request("get:root");
                Visualization.mainlayout.getRegion('top').show(yearsView);
            });

        });

        return Visualization;

    };

    return VisualizationConstructor;

});
