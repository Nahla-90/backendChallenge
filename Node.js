var express = require('express');
var multer = require('multer');
fs = require('fs');
var ImageOperation = require('./ImageOperation.js');

/* Listen to port 8080 */
var app = express();
app.listen(8080);

/* Define upload destination for multer*/
var upload = multer({
    dest: 'uploads/',
    onError: function (err, next) {
        next(err);
    }
});

/* Define post request upload files */
var cpUpload = upload.any();

app.post("/create", cpUpload, function (req, res) {

    try {
        /* Init image Operation Object */
        var imageOperation = new ImageOperation(req.files, req.body.imageDetails);

        /* Check input data validation */
        if (imageOperation.isValid()) {

            /* Composite operation */
            imageOperation.composite();

            /* Check if composite operation error */
            if (imageOperation.error === '') {

                /* Success composite operation */
                res.status(200).send({"finalTemplateURL": req.headers.host + imageOperation.finalTemplate}).end();
            } else {

                /* Fail composite operation */
                res.status(500).send({error: imageOperation.error}).end();
            }
        } else {

            /* Invalid data for composite operation */
            res.status(500).send({error: imageOperation.getValidationErrors().toString()}).end();
        }
    } catch (e) {
        res.status(500).send({error: e.toString()}).end();
    }
});

/* Define Get request for finalTemplate*/
app.get("/finalTemplate.png", function (req, res) {

    /* Read requested file*/
    fs.readFile('uploads/finalTemplate.png', function (err, content) {

        if (err) {

            /* if error happened when read file, then return errors */
            res.status(400).send({error: {message: err}}).end();

        } else {

            /* if success when read file, then return image content */
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(content);
        }
    });
});
