'use strict';

const Joi = require('joi');
const Stream = require('stream');
const Stringify = require('fast-safe-stringify');


const internals = {
    colors: {
        info: 32,
        debug: 34,
        warn: 33,
        error: 31
    }
};


class Console extends Stream.Transform {

    constructor(options) {

        super({ objectMode: true });
        this.options = internals.processOptions(options);
    }

    _transform(data, encoding, callback) {

        if (typeof data === 'object') {
            return callback(null, this._format(data));
        }

        return callback(null, data);
    }

    _format(data) {

        let level = data.level;

        if (this.options.colorize) {
            const color = internals.colors[level];
            level = `\x1b[1;${color}m${level}\x1b[0m`;
        }

        const date = new Date(data.timestamp);
        let payload = data.payload;
        let context = data.context;

        if (typeof payload === 'object') {
            payload = Stringify(payload, internals.replacer);
        }

        if (typeof context === 'object') {
            context = Stringify(context, internals.replacer);
        }

        if (context) {
            return `${date} ${level} ${context} ${payload} \n`;
        }

        return `${date} ${level} ${payload} \n`;
    }
}

internals.replacer = function (key, value) {

    if (value instanceof Error) {
        return {
            name: value.name,
            message: value.message,
            stack: value.stack
        };
    }

    return value
};

internals.processOptions = function (options) {

    const result = Joi.validate(options, internals.schema);

    if (result.error) {
        throw result.error;
    }

    return result.value;
};

internals.schema = Joi.object().keys({
    colorize: Joi.boolean().default(true)
});

module.exports = Console;