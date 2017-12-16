#!/usr/bin/env node

var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var googletts = require('google-tts-api'); 
var googlettsaccent = 'us';
var notify = function(host,text) { 
    require('cld').detect(text, function(err, result) { 
        console.log(result); 
        googletts(text, result.languages[0].code, 1, 1000, googlettsaccent)
            .then(function (url) { 
                onDeviceUp(host, url);
            }).catch(function (err) {
                console.error(err.stack);
            });
    });
};
function onDeviceUp(host,url) {
      var client = new Client();
      client.connect(host, function() {
            console.log('connected, launching app ...%s:%s',host,url);
            client.launch(DefaultMediaReceiver, function(err, player) {
                  var media = {
                        contentId:url,
                            contentType: 'audio/mp3',
                            streamType: 'BUFFERED', // or LIVE 
                      };
                  player.on('status', function(status) {
                        console.log('status broadcast playerState=%s', status.playerState);
                      });

                  console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);
                  player.load(media, { autoplay: true }, function(err, status) {
                        console.log('media loaded playerState=%s', status.playerState);
                client.close();
                console.log('Device notified');
                      });
                });
          });
      client.on('error', function(err) {
            console.log('Error: %s', err.message);
            client.close();
          });
}
console.log(process.argv);
notify(process.argv[2],process.argv[3]);
