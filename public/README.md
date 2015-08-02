# Public folder
In this folder *visualization.js* recibe the *GISTEMP json* from *json folder*
divide this in chunk and start the assets *decade* and *years*.

## decade:
This assets calculate the percentage of ten years and display the base tag of each
chunk coloring the box and the text of the degrees.

## years:
This assets paint boxes that represent the twelves months of every years coloring
by value.

###* color palette: I use HSL Color System and calculate this value
```javascript
setColor: function(degree){
  var per = degree * 100 / ( 80 * 250 );
  var hue = -0.33 * (1.0 - per) * 240;
  return "hsl(" + hue + ", 100%, 50%)";
}
```
