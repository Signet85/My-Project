"use strict";

require("core-js/modules/es.array.concat.js");
var arr = [23, 44, 44];
var myfunc = function myfunc(a) {
  console.log("too: ".concat(a));
};
var arr2 = [].concat(arr, [44, 123]);
myfunc(arr2[1]);