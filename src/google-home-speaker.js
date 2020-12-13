import GoogleHomeAudioPlay from 'google-home-audioplay';
import LanguageDetect from 'langdetect';
import {getAudioUrl} from 'google-tts-api';
/**
 ** main class of GoogleHomeSpeaker
 */
export default class GoogleHomeSpeaker {
    /**
     * @constructor
     */
    constructor() {
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
            if ( typeof this.detector === 'undefined') {
                this.detector = LanguageDetect;
            }
            let result = this.detector.detectOne(text);
            if (typeof result === 'string' &&
                result.length === 2 ) {
                return resolve(result);
            }
            return resolve('ja');
        });
    }
    /**
     * convert text to mp3
     * @param {string} text
     * @return {string} url
     */
    async textToMp3(text) {
        if ( typeof this.tts === 'undefined') {
            this.tts = getAudioUrl;
        }
        return this.tts(text,{
          lang : await this.detect(text),
          slow: false ,
          host: 'https://translate.google.com'
        });
    }
    /**
     * run commands
     * @param {string} host
     * @param {string} text
     * @return {void}
     */
    async run(host, text) {
        let gha = new GoogleHomeAudioPlay(host, await this.textToMp3(text));
        return gha.run();
    }
}
