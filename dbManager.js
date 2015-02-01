var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kpm');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function(callback) {
    console.log("Sucessfully opened Mongo!");
});

var kpm_schema = mongoose.Schema({
    channel: String,
    kpm: Number,
    date: Date
});

var KPM = mongoose.model('KPM', kpm_schema);

module.exports = {
    addKPMToDatabase: function(twitch_channel, kappa_per_minute, curr_date, callback) {
        var kpm_record = new KPM({
            channel: twitch_channel,
            kpm: kappa_per_minute,
            date: curr_date
        });
        kpm_record.save(function(err, kpm_rec) {
            if (err)
                console.log('Error adding KPM record to DB!');

            console.log('Successfully added KPM record ' + kpm_record + 'to DB!');
        });
        callback();
    },
    getHighestKPM: function(callback) {
        var highest = KPM.findOne({}, {}, {
            sort: {
                'kpm': -1
            }
        }, function(err, query) {
            if (err) console.log('Error in query: ' + err);
            callback(query);
        });
    }
};
