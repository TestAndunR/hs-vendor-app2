let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');

exports.handler = function(event, context, callback) {
    
    dynamoDBService.getPromo.then(function (data) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify(data.Items)
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