var request = require('request');
var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var fs = require('fs');
var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});
var action = process.argv[2];
var searchInput = process.argv[3];

//switch statement
        switch (action) {
            case 'movie-this':
                omdbMovie(searchInput);
                break;

            case 'my-tweets':
                myTweets();
                break;

            case 'spotify-this-song':
                spotifySong(searchInput);
                break;

            case 'do-what-it-says':
                doWhatItSays();
                break;

        }


// function to create movie information entered by the user 
function omdbMovie(movieName) {
    
    // Default value for movieName
    if (movieName === undefined) {
        movieName = "Mr. Nobody";
    }
    // empty variable for holding movie name
    var movieName = movieName;

    // storing arguments in an array
    // var nodeArgs = process.argv;    
    // loop through all the words in nodeArgs
    // for (var i = 3; i < nodeArgs.length; i++) {
    // 	if(i > 3 && i < nodeArgs.length) {
    // 		movieName = movieName + "+" + nodeArgs[i];
    // 	}
    // 	else {
    // 		movieName += nodeArgs[i];
    // 	}
    // }
 
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&r=json";

    // request npm package sends the queryUrl and call back function returns the data called by the API.
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
    // Client get method send the user's tweets request and recieve the tweets in a call back function.
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    	// if there is an error then throw an exception.
        if (error) throw error;
        // Loop through to get top 20 tweets.
        for (var i = 0; i < 20; i++) {
        	var k = i+1;
            console.log(k+". Tweets : " + tweets[i].quoted_status.text + "\n"+ k +". Created at : " + tweets[i].quoted_status.created_at);
        }
    });
}

// function to display spotify
function spotifySong(songTitle) {

    var song = songTitle;
    // If user entered nothing then 'The Sign' is the song title spotify look for to get data
    if (song === undefined) {
        song = 'The Sign';
    }
    // Spotify API call for data for a query and its type. In this case its a track and song.
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
        // calling spotify function to display random.txt info
        if(dataArr[0] === 'spotify-this-song'){
        spotifySong(dataArr[1]);
        }
        else if(dataArr[0] === 'my-tweets'){
        	myTweets();
             }
             else if (dataArr[0] === 'movie-this'){
             	omdbMovie(dataArr[1]);
             }
             else{
             	console.log('File is empty.');
             }
    });

}