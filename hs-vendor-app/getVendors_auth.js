let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');
let authService = require('./authService');

exports.handler = function (event, context, callback) {
    let userUUID = event["queryStringParameters"]['uuid'];
    let userName = event["queryStringParameters"]['username'];

    authService.validateUser(userUUID, userName, function (response) {
        if (response.error) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 502,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify(response.error)
            });
        } else if (response.validated) {
            getVendors(callback);
        } else {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 403,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": "User validation failed."
            });
        }
    })
}

function getVendors(callback) {
    dynamoDBService.getVendors().then(function (data) {
        console.log(data);
        callback(null, {
            "isBase64Encoded": true,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": JSON.stringify(data.Items)
        });
    }).catch(err => {
        console.log(err);
        callback(null, {
            "isBase64Encoded": true,
            "statusCode": 502,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": err.message
        })
    });
}