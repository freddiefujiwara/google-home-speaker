import {Client} from 'castv2-client';
import {DefaultMediaReceiver} from 'castv2-client';
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
     * @param {string} host
     * @param {string} text
     * @return {void}
     */
    async run(host, text) {
        if ( typeof this.detector === 'undefined') {
            this.detector = detect;
        }
        if ( typeof this.tts === 'undefined') {
            this.tts = tts;
        }
        let url = await this.textToMp3(text);
        let client = new Client();
        let reciever = DefaultMediaReceiver;
        client.connect(host, () => {
            console.log('host:%s', host);
            console.log('text:%s', text);
            client.launch(reciever, (err, player) => {
                let media = {
                    contentId: url,
                    contentType: 'audio/mp3',
                    streamType: 'BUFFERED',
                };
                player.on('status', (status) => {
                    console.log('status:%s',
                        status.playerState);
                });

                console.log('displayName:%s', player.session.displayName);
                console.log('url:%s', media.contentId);
                player.load(media, {autoplay: true}, (err, status) => {
                    if (err === null) {
                        console.log('status:%s',
                            status.playerState);
                        console.log('spoke');
                    } else {
                        console.error(err);
                    }
                    client.close();
                });
            });
        });
        client.on('error', (err) => {
            console.log('Error:%s', err.message);
            client.close();
        });
    }
}
