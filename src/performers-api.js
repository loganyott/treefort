'use strict';

console.log('Loading function');

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const response = require('./lib/response');
const PerformerController = require('./controllers/performer/performer-controller').PerformerController;

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = response(callback);
    if (!Boolean(event.stageVariables)) {
        console.error('ERROR: event.stageVariables.current_wave has not been set');
        done(new Error('Internal server error'));
    }
    const performerController = new PerformerController(dynamo, event.stageVariables.current_wave);

    switch (event.httpMethod) {
        case 'POST':
            performerController
                .create((event.pathParameters ? event.pathParameters : null))
                .then((response) => done(null, response))
                .catch((error) => done(error));
            break;
        case 'GET':
            let pathParameters = null;

            if (event.pathParameters && event.pathParameters.performerId) {
                pathParameters = event.pathParameters.performerId;
            }
            performerController
                .get(pathParameters)
                .then((response) => done(null, response))
                .catch((error) => done(error));
            break;
        case 'PUT':
            performerController
                .update(event.pathParameters.performerId, JSON.parse(event.body).performer)
                .then((response) => done(null, response))
                .catch((error) => done(error));
            break;
        case 'DELETE':
            performerController
                .remove(event.pathParameters.performerId)
                .then((response) => done(null, response))
                .catch((error) => done(error));
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
