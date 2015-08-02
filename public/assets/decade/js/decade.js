define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "text!/assets/decade/templates/decade.html"
], function (Marionette, Radio, Shim, DecadeTemplate) {

    var DecadeConstructor = function(channelName, events){

        var Decade = new Marionette.Application();
        Decade.Channel = Radio.channel(channelName);

        Decade.ItemView = Marionette.ItemView.extend({
            className: "decade",
            template: _.template(DecadeTemplate),
            events: {
              // "mouseenter": "showTags",
              // "mouseleave": "hideTags"
            },
            onRender: function(){
              this.setColor(this.model.get("change_celsius"));
              this.paint();
            },
            setColor: function(degree){
              var hue;
              Decade.Color = function(){
                hue = -0.3 * (1.0 - degree) * 240
                return "hsl(" + hue + ", 100%, 50%)";
              }
            },
            paint: function(){
              this.$el.css({
                "background-color": Decade.Color,
                "color": Decade.Color
              });
            },
            showTags: function(){
              this.$el.find(".celsius").fadeIn();
              this.$el.find(".fahrenheit").fadeIn();
            },
            hideTags: function(){
              this.$el.find(".celsius").fadeOut();
              this.$el.find(".fahrenheit").fadeOut();
            }
        });

        Decade.CollectionView = Marionette.CollectionView.extend({
            tagName: "div",
            className: "decades",
            childView: Decade.ItemView,
            onShow: function(){
              this.$el.find(".decade:last-child .year").text("2010");
            }
        });

        Decade.on("start", function(args){

          // calulate decade percentage object
          var averageArray = [];
          _.each(args.decadeData, function(decade){
            var decData;
            _.each(decade, function(year){
              decData = _.map(year, function(num, key){
                return num
              });
            });
            var change = 0;
            for (i = 1; i < 13; i++) {
              var actual = decData[i];
              if(actual == "NA"){
              }else{
                change = change + actual;
              }
            };
            changeCelsius = ( change / 12 ) / 100;
            changeFahrenheit = changeCelsius * 1.8;

            // the expected object
            averageArray.push({
              "year" : decData[0],
              "change_celsius" : changeCelsius,
              "change_fahrenheit" : changeFahrenheit
            });
          });

          // create collection
          var emptyCollection = Backbone.Collection.extend();
          Decade.collection = new emptyCollection(averageArray);

          console.log("averageArray: ", averageArray);

          Decade.collectionview = new Decade.CollectionView({
              collection: Decade.collection
          });

          Decade.Channel.reply("get:root", function(){
              return Decade.collectionview;
          });


        });

        return Decade;

    };

    return DecadeConstructor;

});
