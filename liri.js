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
// console.log(client);

//variable to contain particular action for switch
var action = process.argv[2];
inquirer.prompt([
	 {
	 	type: "list",
		message: "What you want to display",
		choices: ["my-tweets", "movie-this", "spotify-this-song", "do-what-it-says"],
		name: "action"
	 },
	 {
		type: "input",
		message: "Search for ... : ",
		name : "searchInput"
	 },
	 {
		type: "confirm",
		message: "Are you sure:",
		name: "confirm",
		default: true

	}]).then(function (user) {
	

	// If we log that user as a JSON, we can see how it looks.
	console.log(JSON.stringify(user, null, 2));

	// If the user confirms, we displays the user's name and pokemon from the answers. 
	if (user.confirm){

			console.log("Welcome " + user.action + user.searchInput);
			//switch statement
			switch (user.action) {
							case 'movie-this' : omdbMovie(user.searchInput);
							break;

							case 'my-tweets' : myTweets();
							break;

							case 'spotify-this-song' : spotifySong(user.searchInput);
							break;

							case 'do-what-it-says' : doWhatItSays();
							break;
            }
	
	// If the user does not confirm, then a message is provided and the program quits. 
	}
});




// function to create movie information entered by the user 
function omdbMovie(movieName){
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
 console.log(queryUrl);
 request(queryUrl, function(error, response, body){
 	if(!error && response.statusCode === 200){
 		// console.log(response);
 		var json = JSON.parse(body);
 		console.log("release year : " + json.Year + "\nTitle of the movie : " + json.Title
 			+ "\nIMDB Rating of the movie : " + json.imdbRating + 
 			"\nCountry where the movie was produced : " + json.Country + 
 			"\nLanguage of the movie : " + json.Language + "\nPlot of the movie : " + 
 			json.Plot + "\nActors in the movie : " + json.Actors + "\nRotten Tomatoes Rating : "
 			+ json.tomatoRating + "\nRotten Tomatoes URL : " + json.tomatoURL);
 
 	}
 });
}

// function to display top 20 tweets from my twitter account
function myTweets() {
 var params = {screen_name: 'poornima sewak'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if(error) throw error;
  // console.log(typeof tweets);  // The favorites. 
  // console.log(response);  // Raw response object. 
  // No need to parse tweets as they already in the object form
  for(var i = 0; i < tweets.length; i++){
  console.log("Tweets : "+tweets[i].quoted_status.text + "\nCreated at : " + tweets[i].quoted_status.created_at);
}
});

}


// function to display spotify
function spotifySong(songTitle) {

	var song = songTitle;

	if(song == ''){
		song = 'The Sign';
	}

	spotify.search({ type: 'track', query: song }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
    console.log(song);
    for(var i = 0; i < data.tracks.items.length; i++){
     console.log("Album Name : " + data.tracks.items[i].album.name);
     console.log("Song Name : " + data.tracks.items[i].name);
     console.log("Spotify Preview Link : " + data.tracks.items[i].preview_url);
      for (j = 0; j < data.tracks.items[i].artists.length; j++) {
        console.log("Artist : " + data.tracks.items[i].artists[j].name);
      }
    }
    
});

}

//function to display do what it says
function doWhatItSays() {

	fs.readFile('random.txt','utf8',function (err,data){
	console.log(data);
	// add spotify function with song coming from random.txt
	});

}

