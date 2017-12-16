import {Client} from 'castv2-client';
import {DefaultMediaReceiver as reciever} from 'castv2-client';
import {detect} from 'cld';
import tts from 'google-tts-api';
/**
 ** main class of GoogleHomeSpeaker
 */
export default class GoogleHomeSpeaker {
    /**
    * @constructor
    */
    constructor() {
        this.client = undefined;
        this.reciever = undefined;
        this.detector = undefined;
        this.tts = undefined;
    }
    /**
    * detect language
    *
    * @param {string} text
    * @return {string} code
    */
    async detect(text) {
        return await new Promise((resolve) => {
            this.detector(text, (err, result) => {
                if ( err === null &&
                    typeof result === 'object' &&
                    typeof result.languages === 'object' &&
                    result.languages.length > 0) {
                    return resolve(result.languages[0].code);
                }
                return resolve('ja');
            });
        });
    }
    /**
    * convert text to mp3
    * @param {string} text
    * @return {string} url
    */
    async textToMp3(text) {
        return this.tts(text, await this.detect(text), 1);
    }
    /**
    * run commands
    * @return {void}
    */
    run() {
        if ( typeof this.client === 'undefined') {
            this.client = new Client();
        }
        if ( typeof this.reciever === 'undefined') {
            this.reciever = reciever;
        }
        if ( typeof this.detector === 'undefined') {
            this.detector = detect;
        }
        if ( typeof this.tts === 'undefined') {
            this.tts = tts;
        }
        const line = this.readLine();
        if ( '' === line ) {
            this.cl.end().then(() => {
                fs.closeSync(this.fd);
            }).catch(console.error.bind(console));
            return;
        }
        const args = this.parseLine(line);
        this.cl[args.shift()](...args)
            .then((result) =>{
                if (typeof result === 'string') {
                    console.log(result);
                }
                this.run(); // loop
            }).catch((e) => {
                console.error(e);
            });
    }
}
