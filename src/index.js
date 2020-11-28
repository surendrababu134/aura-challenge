// // lambda-like handler function
// module.exports.handler = async event => {
//   // do stuff...
// };

var express = require('express');
var app = express();
var fs = require("fs");

app.get('/search', function (req, res) {
   fs.readFile( __dirname + "/" + "data.json", 'utf8', function (err, data) {
      let keyList = Object.keys(req.query);
      let latOutput;
      let lonOutput;
      let dataList = [];
      let dataApp = JSON.parse(data);
      keyList.map(keyVal=>{
        if(keyVal !== "latitude" || keyVal !== "longitude"){
          if(dataList.length === 0){
            dataList = dataApp.filter(o=>o[keyVal].includes(req.query[keyVal]));
          }else{
            dataList = dataList.filter(o=>o[keyVal].includes(req.query[keyVal]))
          }
        } else{
          if(dataList.length === 0){
            let closest = Math.min(...dataApp.map(a=>Math.abs(a[keyVal]-req.query[keyVal])));
            let x1=dataApp.find(a=>a[keyVal]===req.query[keyVal]-closest);
            let x2=dataApp.find(a=>a[keyVal]===req.query[keyVal]+closest);
            dataList = [...new Set([x1,x2].filter(x=>x))];
          }else{
            let closest = Math.min(...dataList.map(a=>Math.abs(a[keyVal]-req.query[keyVal])));
            let x1=dataList.find(a=>a[keyVal]===req.query[keyVal]-closest);
            let x2=dataList.find(a=>a[keyVal]===req.query[keyVal]+closest);
            dataList = [...new Set([x1,x2].filter(x=>x))];
          }

        }
      })
      console.log(dataList)
      res.json( dataList );
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
