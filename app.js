var irc = require('twitch-irc');
var date_format = require('date-format');
var db_manager = require('./dbManager.js');
var occurrences = require('./occurrences.js');

var argv_channel = process.argv[2];
var minutes = process.argv[3];
var elapsed_time, curr_time;
var count = 0;

var client = new irc.client({
    identity: {
        username: 'MiddleFingerBot9000',
        password: 'oauth:lhk5bwz53tkqev7dfeuznpglkj4b9a'
    },
    channels: [argv_channel]
});

client.connect();
console.log("Connected to channel " + argv_channel + " and logging for " + minutes + " minutes. ");
var start_time = new Date().getTime();

var record_holder;

client.addListener('chat', function (channel, user, message) {
    /* When a new message comes in, get the current time and
     * generate elapsed time. */
    curr_time = new Date().getTime();
    elapsed_time = curr_time - start_time;

    count += occurrences(message, "Kappa");
    console.log('[' + (elapsed_time/1000).toFixed(1) + '] Kappa Count: ' + count);

    /* If we finished logging */
    if (elapsed_time >= (60000 * minutes)) {
        var final_kpm = count / minutes;

        /* Reset variables */
        start_time = new Date().getTime();
        count = 0;

        console.log("HI1");
        /* Add the new KPM to the database */
        db_manager.addKPMToDatabase(channel, final_kpm, new Date(), function() {
            /* Get the higest KPM from the database */
            db_manager.getHighestKPM(function(query_result) {
                record_holder = query_result;
                console.log('Found record holder: ' + record_holder);

                /* Generate the end message and log it/say in channel */
                var msg = generateMessageSync(final_kpm, record_holder);
                client.say(channel, msg);
                console.log(msg);
            });
        });
    }
});

function generateMesageSync(final_kpm, record_holder_query) {
        console.log("FUK");
        var formattedDate = date_format.asString('MM/dd/yy', record_holder_query.date);
        var msg = '/me ~~ KPMBOT9000: Kappa per minute was ' + final_kpm + '! Current record holder is ' + record_holder_query.channel + '\'s stream with a KPM of ' + record_holder_query.kpm.toFixed(1) + ' on ' + formattedDate + '!';
        return msg;
}
