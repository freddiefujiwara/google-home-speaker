/* eslint require-jsdoc: 0 */
import fs from 'fs';
import chai from 'chai';
chai.should();
import GoogleHomeNotifierCLI from '../src/google-home-notifier-cli';
describe('GoogleHomeNotifierCLI test.', (suite) => {
    it('should have properties ', () => {
        const ghncli = new GoogleHomeNotifierCLI(process.stdin);
        ghncli.should.be.a('object');
        ghncli.should.have.property('fd').with.a('object');
        ghncli.should.have.property('cl').with.equal(undefined);
    });
});

class GoogleHomeNotifierMock {
    constructor() {}
    async end() {
console.log('end');
}
    async screenshot() {
return 'screenshot';
}
    async goto(url) {
return url;
}
    async type(string, target) {
return `${string} ${target}`;
}
    async click(target) {
return target;
}
    async wait(target) {
return target;
}
}
