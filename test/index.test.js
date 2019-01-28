'use strict';


const Spigit = require('../lib');
const Chai = require('chai');

const expect = Chai.expect;


describe('Spigit log', () => {

    it('debug', (done) => {

        const log = new Spigit();

        log.on('log', (level, payload, timestamp) => {

            expect(level).to.equal('debug');
            expect(payload).to.equal('Hey its me debug');
            expect(timestamp).to.exist;
            log.stop();
            done();
        });

        log.debug('Hey its me debug');
    });

    it('info', (done) => {

        const log = new Spigit();

        log.on('log', (level, payload, timestamp) => {

            expect(level).to.equal('info');
            expect(payload).to.equal('Hey its me info');
            expect(timestamp).to.exist;
            log.stop();
            done();
        });

        log.info('Hey its me info');
    });

    it('warn', (done) => {

        const log = new Spigit();

        log.on('log', (level, payload, timestamp) => {

            expect(level).to.equal('warn');
            expect(payload).to.equal('Hey its me warn');
            expect(timestamp).to.exist;
            log.stop();
            done();
        });

        log.warn('Hey its me warn');
    });

    it('error', (done) => {

        const log = new Spigit();
    
        log.on('log', (level, payload, timestamp) => {

            expect(level).to.equal('error');
            expect(payload).to.equal('Hey its me error');
            expect(timestamp).to.exist;
            log.stop();
            done();
        });

        log.error('Hey its me error');
    });
});