var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require("fs");
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/save',function(req,res,next){
  let body = JSON.parse(Object.keys(req.body)[0])
  console.log(body);
  let array = [];
  Object.keys(body).forEach(key => array.push(body[key]));
  console.log(array);
  appendFileData(array.join(",")+'\n').then(result => {
    res.send("success");
    sendMail(array.pop());
  });

})

router.options('/save',function(req,res,next){
  console.log(req.body);
  console.log("success");
  res.send("success")
})

function sendMail(mailAddress)
{
  if(mailAddress){
    //https://myaccount.google.com/lesssecureapps?pli=1
    //enable lesssecure app in google account
    var transporter = nodemailer.createTransport(
      'smtps://emailid:password@smtp.gmail.com');

    var mailOptions = {
    from: 'hariprasath.er@gmail.com',
    to: mailAddress,
    subject: 'slot booking',
    text: 'your slot is booked!'
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    });
  }
  
}

function readFileData()
{
  var readFilePromise = new Promise(function(resolve,reject){
    var filePath = path.join(__dirname,"/../public/data/data.json");
    fs.readFile(filePath,function(err,data){
      if(err){
        console.log(err);
        reject(err);
      }
      let parsedData = JSON.parse(data);
      resolve(parsedData);
    })
  })
  return readFilePromise;
}

function appendFileData(inputData)
{
  var writeFilePromise = new Promise(function(resolve,reject){
    var filePath = path.join(__dirname,"/../public/data/data.csv");
    fs.appendFile(filePath,inputData,'utf8',function(err){
      if(err)
      {
        console.log(err);
        reject(err);
      }
      console.log("File written");
      resolve("success");
    })
  })
  return writeFilePromise;
}

function writeFileData(inputData)
{
  var writeFilePromise = new Promise(function(resolve,reject){
    var filePath = path.join(__dirname,"/../public/data/data.json");
    fs.writeFile(filePath,inputData,'utf8',function(err){
      if(err)
      {
        console.log(err);
        reject(err);
      }
      console.log("File written");
      resolve("success");
    })
  })
  return writeFilePromise;
}

function truncateFileData()
{
  var truncateFileData = new Promise(function(resolve,reject){
    var filePath = path.join(__dirname,"/../public/data/data.json");
    fs.truncate(filePath,(err) => {
      if(err)
      {
        console.log(err);
      }
      console.log('truncate success');
      resolve("success");
    });
  })
  return truncateFileData;
}

module.exports = router;
