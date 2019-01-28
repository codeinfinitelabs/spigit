'use strict';

const EventEmitter = require('events').EventEmitter;
const Monitor = require('./monitor');


class Spigit extends EventEmitter {

    constructor(options, context) {

        super();

        this._monitor = new Monitor(this, options, context);
        this._monitor.start();
    }

    debug(message) {

        return this._emit('debug', message);
    }

    info(message) {

        return this._emit('info', message);
    }

    warn(message) {

        return this._emit('warn', message);
    }

    error(message) {

        return this._emit('error', message);
    }

    stop() {

        return this._monitor.stop()
    }
    
    _emit(level, payload) {

        return this.emit('log', level, payload, Date.now());
    }
};

module.exports = Spigit;