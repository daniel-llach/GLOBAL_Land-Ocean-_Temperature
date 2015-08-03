define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "text!/assets/years/templates/year.html"
], function (Marionette, Radio, Shim, YearsTemplate) {

    var YearsConstructor = function(channelName, events){

        var Years = new Marionette.Application();
        Years.Channel = Radio.channel(channelName);

        Years.ItemView = Marionette.ItemView.extend({
            className: "year",
            template: _.template(YearsTemplate),
            events: {
              "mouseover": "getData"
            },
            initialize: function(){
              console.log(this.model);
            },
            templateHelpers: function () {
              return {
                JanColor: this.setColor(this.model.get("Jan")),
                FebColor: this.setColor(this.model.get("Feb")),
                MarColor: this.setColor(this.model.get("Mar")),
                AprColor: this.setColor(this.model.get("Apr")),
                MayColor: this.setColor(this.model.get("May")),
                JunColor: this.setColor(this.model.get("Jun")),
                JulColor: this.setColor(this.model.get("Jul")),
                AugColor: this.setColor(this.model.get("Aug")),
                SepColor: this.setColor(this.model.get("Sep")),
                OctColor: this.setColor(this.model.get("Oct")),
                NovColor: this.setColor(this.model.get("Nov")),
                DecColor: this.setColor(this.model.get("Dec"))
                }
            },
            setColor: function(degree){
              var per = degree * 100 / ( 80 * 250 );
              var hue = -0.33 * (1.0 - per) * 240;
              return "hsl(" + hue + ", 100%, 50%)";
            },
            getData: function(event){
              var year = this.model.get("Year");
              var month = $(event.target).data("month");
              var value = $(event.target).data("value");
              var color = $(event.target).css('backgroundColor');
              console.log(color);
              $(".viewer").html("<span>" + month + "</span> <span>" + year + " : </span>  <span>" + value / 100 + " ºC / </span><span>" + (value/100*1.8).toFixed(1) + "ºF</span>" );
              $(".viewer").css({
                "color": color
              });
            }
        });

        Years.CollectionView = Marionette.CollectionView.extend({
            tagName: "div",
            className: "years",
            childView: Years.ItemView
        });

        Years.on("start", function(args){
          // create collection
          var emptyCollection = Backbone.Collection.extend();
          Years.collection = new emptyCollection(args.decadeData);


          Years.collectionview = new Years.CollectionView({
              collection: Years.collection
          });

          Years.Channel.reply("get:root", function(){
              return Years.collectionview;
          });


        });

        return Years;

    };

    return YearsConstructor;

});
