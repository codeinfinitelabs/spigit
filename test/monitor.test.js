'use strict';

const Stream = require('stream');
const EventEmitter = require('events').EventEmitter;
const Spigit = require('../lib');
const Monitor = require('../lib/monitor');
const Chai = require('chai');

const expect = Chai.expect;


describe('Spigit monitor', () => {
    
    it('handles bad options', (done) => {

        expect(() => new Monitor(null, { reporters: { blowtthisup: { somekey: 'some val'}}}, null)).to.throw();
        done();
    });

    it('streams events to reporters', (done) => {

        const streamTransform = new Stream.Transform({ objectMode: true });
        const eventEmitter = new EventEmitter();
        eventEmitter.setMaxListeners(100);
        const monitor = new Monitor(eventEmitter, { reporters: { myConsoleReporter: [], myReporter: []}});
        monitor.start();
        eventEmitter.emit('log', 'info', 'this is cool', Date.now());
        monitor.stop();
        done();
    });

});