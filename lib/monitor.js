'use strict';

const Hoek = require('hoek');
const Joi = require('joi');
const Pumpify = require('pumpify');
const Schema = require('./schema');

const internals = {};


class Monitor {

    constructor(log, configuration, context) {

        this._log = log;
        this._configuration = internals.validate(configuration);
        console.log(this._configuration);
        this._transports = internals.configureReporters(this._configuration);
        this._context = context;
    }

    start() {

        const eventHandlers = this._configuration.eventHandlers;

        for (const event in eventHandlers) {
  
            const EventHandlerModule = require(eventHandlers[event]);
            const eventHandler = new EventHandlerModule(event, this._transports, this._context);

            this._log.on(event,  (level, payload, timestamp) => {
                
                eventHandler.handler(level, payload, timestamp);
            });
        }

        this._log.on('error', console.error);
    }

    stop() {

        this._log.removeAllListeners();

        for (const transport of this._transports.values()) {

            transport.end();
        }
    }
}

internals.validate = function (options = {}) {

    const _options = Hoek.applyToDefaults({
        reporters: {
            myConsoleReporter: [
                {
                    module: './reporters/console'
                },
                'stdout'
            ]
        }
    }, options);

    const result = Joi.validate(_options, Schema.monitor);

    if (result.error) {
        throw result.error;
    }

    return result.value;
};

internals.configureReporters = function (configuration) {

    const reporters = new Map();

    for (const name in configuration.reporters)  {

        const config = configuration.reporters[name];
        const stream = internals.configureReporter(config);

        reporters.set(name, stream);
    }

    return reporters;
};

internals.configureReporter = function (configurations) {

    const streams = [];

    for (const configuration of configurations) {

        if (typeof configuration === 'object') {
            const Reporter = require(configuration.module);
            const _reporter = new Reporter(configuration.options);

            streams.push(_reporter);
            continue;
        }

        streams.push(process[configuration]);
    }

    if (streams.length === 1) {
        return streams[0];
    }

    return Pumpify.obj(streams);
};

module.exports = Monitor;