var request = require('request');
var keys = require('./keys.js');
var Twitter = require('twitter');
var inquirer = require('inquirer');
var spotify = require('spotify');
var fs = require('fs');
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

inquirer.prompt([{
    type: "list",
    message: "What you want to display",
    choices: ["my-tweets", "movie-this", "spotify-this-song", "do-what-it-says"],
    name: "action"
}, {
    type: "input",
    message: "Search for ... : ",
    name: "searchInput"
}, {
    type: "confirm",
    message: "Are you sure:",
    name: "confirm",
    default: true

}]).then(function(user) {

    // If the user confirms. 
    if (user.confirm) {

        //switch statement
        switch (user.action) {
            case 'movie-this':
                omdbMovie(user.searchInput);
                break;

            case 'my-tweets':
                myTweets();
                break;

            case 'spotify-this-song':
                spotifySong(user.searchInput);
                break;

            case 'do-what-it-says':
                doWhatItSays();
                break;

        }
    } else {
        console.log('Try again with Options.');
    }
});




// function to create movie information entered by the user 
function omdbMovie(movieName) {
    // storing arguments in an array
    // var nodeArgs = process.argv;

    // empty variable for holding movie name
    var movieName = movieName;

    // loop through all the words in nodeArgs
    // for (var i = 3; i < nodeArgs.length; i++) {
    // 	if(i > 3 && i < nodeArgs.length) {
    // 		movieName = movieName + "+" + nodeArgs[i];
    // 	}
    // 	else {
    // 		movieName += nodeArgs[i];
    // 	}
    // }

    // Default value for movieName
    if (movieName === '') {
        movieName = "Mr. Nobody"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&r=json";

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            var json = JSON.parse(body);
            console.log("release year : " + json.Year + "\nTitle of the movie : " + json.Title +
                "\nIMDB Rating of the movie : " + json.imdbRating +
                "\nCountry where the movie was produced : " + json.Country +
                "\nLanguage of the movie : " + json.Language + "\nPlot of the movie : " +
                json.Plot + "\nActors in the movie : " + json.Actors + "\nRotten Tomatoes Rating : " +
                json.tomatoRating + "\nRotten Tomatoes URL : " + json.tomatoURL);
        }
    });
}

// function to display top 20 tweets from my twitter account
function myTweets() {
    // sets screen_name to fix value.
    var params = {
        screen_name: 'poornima sewak'
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) throw error;
        // Loop through to get top 20 tweets.
        for (var i = 0; i < 20; i++) {
            console.log("Tweets : " + tweets[i].quoted_status.text + "\nCreated at : " + tweets[i].quoted_status.created_at);
        }
    });
}


// function to display spotify
function spotifySong(songTitle) {

    var song = songTitle;
    // If user entered nothing then 'The Sign' is the song title spotify look for to get data
    if (song === '') {
        song = 'The Sign';
    }

    spotify.search({
        type: 'track',
        query: song
    }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        // Loop through to get all the artists name
        for (var i = 0; i < 1; i++) {
            var track = data.tracks.items[i];
            console.log("Album Name : " + track.album.name);
            console.log("Song Name : " + track.name);
            console.log("Spotify Preview Link : " + track.preview_url);
            for (j = 0; j < track.artists.length; j++) {
                console.log("Artist : " + track.artists[j].name);
            }
        }
    });
}

//function to display do what it says
function doWhatItSays() {
    // read file random.txt and get data inside it.
    fs.readFile('random.txt', 'utf8', function(err, data) {
        // define an array variable an put split data in it
        var dataArr = data.split(',');
        // calling spotify function to display song info
        spotifySong(dataArr[1]);
    });

}