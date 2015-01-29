var irc = require('twitch-irc');
var channel = process.argv[2];
var minutes = process.argv[3];

var db_manager = require('./dbManager.js');

var elapsed_time, curr_time;
var count = 0;


var client = new irc.client({
    identity: {
        username: 'MiddleFingerBot9000',
        password: 'oauth:lhk5bwz53tkqev7dfeuznpglkj4b9a'
    },
    channels: [channel]
});

client.connect();

var start_time = new Date().getTime();

var record_holder;
db_manager.getHighestKPM(function(query_result) {
    console.log('Found record holder: ' + query_result);
    record_holder = query_result;
});

client.addListener('chat', function (channel, user, message) {
    console.log('hi');
    curr_time = new Date().getTime();
    elapsed_time = curr_time - start_time;

    if (elapsed_time >= (60000 * minutes)) {
        var final_kpm = count / minutes;
        db_manager.addKPMToDatabase(channel, final_kpm);
        var msg = '/me ~~ KPMBOT9000: Kappa per minute was ' + final_kpm + '! Current record holder is ' + record_holder.channel + '\'s stream with a KPM of ' + record_holder.kpm.toFixed(1) + '!';
        //client.say(channel, msg);
        console.log(msg);
        start_time = new Date().getTime();
        count = 0;
    }

    count += occurrences(message, "Kappa");
    console.log('[' + (elapsed_time/1000).toFixed(1) + '] Kappa Count: ' + count);
});

function occurrences(string, subString, allowOverlapping) {
    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
    
}
