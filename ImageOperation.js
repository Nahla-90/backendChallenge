var validator = require('validator');
var sharp = require('sharp');
var sizeOf = require('image-size');

function ImageOperation(files, imageDetails) {

    /* parse image Details*/
    this._imageDetailsString = imageDetails;
    this._imageDetails = JSON.parse(this._imageDetailsString);


    /* arrange uploaded image */
    this._image = undefined;
    this._template = undefined;
 
    files.forEach(file=>{
        if(file.fieldname==='image'){
            this._image=file.path;
        }else if(file.fieldname==='template'){
            this._template=file.path;
        }
    });

    this._validationErrors = [];
    this.error = '';

    this.finalTemplate = '/finalTemplate.png';

}

/* Validate data*/
ImageOperation.prototype.isValid = function isValid() {

    /* Validate Image Details*/
    if (validator.isEmpty(this._imageDetailsString) || this._imageDetails == null) {
        this._validationErrors.push('Image Details is required');
    } else {

        /* Validate Image Details start points*/
        if (this._imageDetails.startPoint === undefined) {
            this._validationErrors.push('Image Details start point is required');
        } else {

            /* Validate Image Details start points if exist*/
            if (this._imageDetails.startPoint[0] === undefined || this._imageDetails.startPoint[1] === undefined) {
                this._validationErrors.push('Image Details start points is required');
            } else {
                /* Validate Image Details start points if numeric */
                if (!validator.isNumeric(this._imageDetails.startPoint[0].toString()) || !validator.isNumeric(this._imageDetails.startPoint[1].toString())) {
                    this._validationErrors.push('Invalid Image Details start points');
                }

                /* Validate if start point of x is inside the template*/
                let endPointX= this._imageDetails.startPoint[0]+this._imageDetails.width;
                let endPointY= this._imageDetails.startPoint[1]+this._imageDetails.height;

                let templateDimensions = sizeOf(this._template);
                if(endPointX > templateDimensions.width){ /* Check if endpoint x  inside the image*/
                    this._validationErrors.push('Invalid Image Details start points');
                }else if(endPointY > templateDimensions.height){ /* Check if endpoint h  inside the image*/
                    this._validationErrors.push('Invalid Image Details start points');
                }
            }
        }

        /* Validate Image Details width if exist*/
        if (this._imageDetails.width === undefined) {
            this._validationErrors.push('Image Details Width is required');
        } else {

            /* Validate Image Details width if numeric */
            if (!validator.isNumeric(this._imageDetails.width.toString())) {
                this._validationErrors.push('Invalid Image Details width');
            }
        }
        /* Validate Image Details height if exist*/
        if (this._imageDetails.height === undefined) {
            this._validationErrors.push('Image Details height is required');
        } else {

            /* Validate Image Details height if numeric */
            if (!validator.isNumeric(this._imageDetails.height.toString())) {
                this._validationErrors.push('Invalid Image Details height');
            }
        }

        /* Validate Image Details angle if exist*/
        if (this._imageDetails.angle === undefined) {
            this._validationErrors.push('Image Details angle is required');
        } else {

            /* Validate Image Details angle if numeric */
            if (!validator.isNumeric(this._imageDetails.angle.toString())) {
                this._validationErrors.push('Invalid Image Details angle');
            }
        }
    }

    /* Validate Image if exist*/
    if (this._image === undefined) {
        this._validationErrors.push('Image is required');
    }

    /* Validate Template if exist*/
    if (this._template === undefined) {
        this._validationErrors.push('Template is required');
    }


    /* Check validation errors contain errors after validation*/
    if (this._validationErrors.length > 0) {
        return false;
    } else {
        return true;
    }

}

ImageOperation.prototype.getValidationErrors = function getValidationErrors() {
    return this._validationErrors;
}

/* Composite Two images */
ImageOperation.prototype.composite = function composite() {

    /* Init Data*/
    var left = this._imageDetails.startPoint[0];
    var top = this._imageDetails.startPoint[1];
    var templatePath = this._template;

    /* Start operation on image (resize and rotate)*/
    sharp(this._image)
        .rotate(360 - this._imageDetails.angle)
        .resize(this._imageDetails.width, this._imageDetails.height)
        .toFile('uploads/tmpImage.png') /*Save result of resize&rotate in tmpImage */
        .then(function () {

            /* Start composite operation of template to add  tmpImage*/
            sharp(templatePath)
                .composite([{
                    input: 'uploads/tmpImage.png',
                    gravity: 'southeast',
                    blend: 'dest-over',
                    left: left,
                    top: top
                }])
                .toFile('uploads/finalTemplate.png').then(data=>{

            }).catch(err=>{
                this.error = err;
            });
        })
        .catch(err => {
            this.error = err;
        });
}

module.exports = ImageOperation;
