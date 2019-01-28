'use strict';

const Joi = require('joi');

exports.monitor = Joi.object().keys({
    reporters: Joi.object().pattern(/./, Joi.array().items(
        Joi.string().valid('stdout', 'stderr'),
        Joi.object().keys({
            module: Joi.string().required(),
            options: Joi.object().default({})
        })
    )).default({}),
    eventHandlers: Joi.object().keys({
        log: Joi.string()
    }).pattern(Joi.string(), Joi.string())
    .default({
        log: './handlers/log'
    })
}).unknown(false);