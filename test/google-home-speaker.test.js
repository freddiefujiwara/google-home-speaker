/* eslint require-jsdoc: 1 */
import chai from 'chai';
chai.should();
import GoogleHomeSpeaker from '../src/google-home-speaker';
describe('GoogleHomeSpeaker test.', (suite) => {
    it('should have properties ', () => {
        const ghs = new GoogleHomeSpeaker();
        ghs.should.be.a('object');
        ghs.should.have.property('tts').with.equal(undefined);
        ghs.should.have.property('detector').with.equal(undefined);
    });
    it('should detect properly ', async () => {
        const ghs = new GoogleHomeSpeaker();
        ghs.detector = detectMockOK;
        ghs.should.have.property('detect').with.be.a('function');
        let code = await ghs.detect('Hello my name is Ken');
        code.should.be.a('string').with.equal('en');
        ghs.detector = detectMockNG;
        code = await ghs.detect('hello');
        code.should.be.a('string').with.equal('ja');
    });
    it('should convert text to mp3 properly ', async () => {
        const ghs = new GoogleHomeSpeaker();
        ghs.detector = detectMockOK;
        ghs.tts = ttsMockOK;
        ghs.should.have.property('textToMp3').with.be.a('function');
        let mp3 = await ghs.textToMp3('Hello my name is Ken');
        mp3.should.be.a('string').with.equal('https://translate.google.com/translate_tts?ie=UTF-8&q=Hello%20my%20name%20is%20Ken&tl=en&total=1&idx=0&textlen=20&tk=407544.24021&client=t&prev=input&ttsspeed=1');
        ghs.tts = ttsMockNG;
        try {
            ghs.textToMp3(undefined);
        } catch (e) {
            e.should.be.a(Error);
        }
    });
    it('should run properly ', async () => {
        const ghs = new GoogleHomeSpeaker();
        ghs.should.have.property('run').with.be.a('function');
    });
});

/**
* mock of function detect with OK
*
* @param {string} text
* @param {function} callback
*/
async function detectMockOK(text, callback) {
    callback(null, {reliable: true,
        textBytes: 22,
        languages: [
        {name: 'ENGLISH',
            code: 'en',
            percent: 95,
            score: 1121}], chunks: []});
}

/**
* mock of function detect with NG
*
* @param {string} text
* @param {function} callback
*/
async function detectMockNG(text, callback) {
    callback({message: 'Failed to identify language'}, undefined);
}

/**
* mock of function tts with OK
*
* @param {string} text
* @param {string} code
* @param {number} speed
* @return {Promise}
*/
async function ttsMockOK(text, code, speed) {
    return new Promise((resolve) => {
 resolve('https://translate.google.com/translate_tts?ie=UTF-8&q=Hello%20my%20name%20is%20Ken&tl=en&total=1&idx=0&textlen=20&tk=407544.24021&client=t&prev=input&ttsspeed=1');
});
}

/**
* mock of function tts with NG
*
* @param {string} text
* @param {string} code
* @param {number} speed
* @return {Promise}
*/
async function ttsMockNG(text, code, speed) {
    return new Promise((resolve) => {
        resolve();
        throw new TypeError('NG');
});
}
