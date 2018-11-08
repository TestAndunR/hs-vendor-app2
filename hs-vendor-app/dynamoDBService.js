let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

module.exports = {

    getUser: function (userId) {
        return ddb.query({
            TableName: 'HS_user',
            ExpressionAttributeValues: {
                ':user_id': userId
            },
            KeyConditionExpression: 'user_id = :user_id'
        }).promise()

    },

    /*
     userData={
         name : string,
         role : string,
         vender_id : string
     }
     */
    addUser: function (userData) {
        let userId = userData.uid;
        let name = userData.name;
        let role = userData.role;
        let vendor_id = userData.vendor_id;
        return ddb.put({
            TableName: 'HS_user',
            Item: {
                'user_id': userId,
                'name': name,
                'role': role,
                'vendor_id': vendor_id
            }
        }).promise();
    },

    /*
     userData={
         name : string
     }
     */
    addVendor: function (vendorData) {
        let vendorId = uuidv4();
        let name = vendorData.name;
        return ddb.put({
            TableName: 'HS_vendor',
            Item: {
                'vendor_id': vendorId,
                'name': name
            }
        }).promise();
    },

    getVendors: function () {
        return ddb.scan({
            TableName: 'HS_vendor'
        }).promise();

    },

    addPromo: function (promoData) {
        return ddb.put({
            TableName: 'Promotions',
            Item: {
                'PromoId': promoData.promoId,
                'VendorId': promoData.vendorId,
                'OfferType': promoData.offerType,
                'StartDate': promoData.startDate,
                'EndDate': promoData.endDate,
                'selectedDays': promoData.selectedDays,
                'Description': promoData.description,
                'UnitPrice': promoData.unitPrice,
                'Title': promoData.title,
                'ImgUrls': promoData.imgUrls,
                'Discount': promoData.discount,
                'Terms': promoData.terms,
                'BusinessType': promoData.businessType
            }
        }).promise();
    },

    getPromo: function (vendor) {
        return ddb.scan({
            TableName: 'Promotions',
            ExpressionAttributeValues: {
                ':vendor': vendor
            },
            FilterExpression: 'VendorId = :vendor'
        }).promise();
    }
}