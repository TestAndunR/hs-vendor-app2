let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');
let authService = require('./authService');

exports.handler = function (event, context, callback) {

    let userUUID = event["queryStringParameters"]['uuid'];
    let userName = event["queryStringParameters"]['username'];
    let vendor_id = event["pathParameters"]['vendor_id'];

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
            getVendor(vendor_id, callback);
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
    });

    callback(null, 'Successfully executed');
}

function getVendor(vendorId, callback) {
    dynamoDBService.getVendor(vendorId).then(data => {
        let items = data.Items;
        console.log(items);

        if (items.length > 0) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify(items[0])
            });
        } else {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 502,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": 'No user with the provided user id'
            });
        }

    }).catch(error => {
        console.log(error);
        callback(null, {
            "isBase64Encoded": true,
            "statusCode": 502,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": 'Faild to retreive the user for id : ' + userId
        });
    })
}