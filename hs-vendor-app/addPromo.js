let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');

exports.handler = function(event, context, callback) {
    
    let body = JSON.parse(event.body);
    let promoData = {
        promoId : uuidv4(),
        vendorId : body.vendorId,
        offerType : body.offerType,
        discount : body.discount,
        startDate : body.startDate,
        endDate : body.endDate,
        selectedDays : body.selectedDays,
        description : body.description,
        title : body.title,
        unitPrice : body.unitPrice,
        imgUrl : body.imgUrls,
        terms : body.terms,
        businessType : body.businessType
    };

    dynamoDBService.addPromo(promoData).then(function (data) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": 'Successfully added vendor with name : ' + vendorName
            });
        }).catch(function (err) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 502,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": err.message
            });
        });
        
    callback(null,'Successfully executed');
}