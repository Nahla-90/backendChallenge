# NodeJs Backend Challenge

## Installation
payment API (Symfony): http://paymentvalidator.dev

##Usage : 
 
     URL: localhost:8080/create
     METHOD: POST
     DATA: {
        "template": "File", 
        "image": "File", 
        "imageDetails": {{imageDetails}}
        }
        
###Note : In PreRequest Script tab in postman  add
     
     var imageDetails={
         "startPoint": [2035,1558],
         "width": 1675,
         "height": 1215,
         "angle": 186
       };
     pm.globals.set("imageDetails", JSON.stringify(imageDetails));
