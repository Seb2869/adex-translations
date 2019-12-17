#!/usr/bin/env node
// NOTE: used until we do not have any translations  for faster fix the other langs

var path = require("path");
var fs = require("fs");

var en = require("../en-US");

//if (p.match("en-US")) return; 

var p = path.resolve(process.cwd(), process.argv[2]);
console.log("replace all props to "+p);
var other = require(p);

var rewritten = { };

Object.keys(en).forEach(function(key) {
	rewritten[key] =  en[key];
});

console.log("re-writing to "+p);

fs.writeFile(p, JSON.stringify(rewritten,null,"\t"), function(err) {
	console.log(err || "successfully re-written file");
	process.exit(err ? 1 : 0);
})
