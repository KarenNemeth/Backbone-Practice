const multer = require('multer');
const express = require('express');
const app = express();
const path = require('path');
const util = require('util');
const hb = require('express-handlebars');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
    }
});
var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});
var staticURL = path.join(__dirname, 'Static');
app.use(express.static(staticURL));
var staticURL2 = path.join(__dirname, 'uploads');
app.use(express.static(staticURL2));

app.get('/upload', function(req,res){
    res.render('upload');
});
app.post('/upload', uploader.single('file'), function(req, res) {
    if (req.file) {
        console.log("Worked? Check Uploads!");
        console.log(util.inspect(req.file, {showHidden: false, depth: null}));
        res.json({
            success: true,
            file: req.file.filename
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, console.log('Listening on port 8080'));
