'use strict';

class LogHandler {

    constructor(event, transports, context) {
        
        this._event = event;
        this._transports = transports;
        this._context = context;
    }

    handler (level, payload, timestamp) {

        for(const transport of this._transports.values()) {

            transport.write(new Payload(this._event, level, payload, timestamp, this._context));
        }
    }
}

class Payload {

    constructor(event, level, payload, timestamp, context) {
        
        this.event = event;
        this.level = level;
        this.context = context;
        this.payload = payload;
        this.timestamp = timestamp;
    }
}

module.exports = LogHandler;