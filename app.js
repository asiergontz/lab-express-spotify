require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require("body-parser")

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");

app.use(bodyParser.urlencoded({extended: true})); 

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/artist-search", (req,res,next) => {
    let artist = req.query.artist
    spotifyApi
    .searchArtists(artist)
    .then((data)=>{
        res.render("artist-search-results", {artists: data.body.artists.items, buttonContent: "View Albums", isArtistSearch: true})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistName/:artistId', (req, res, next) => {
    let id = req.params.artistId;
    let name = req.params.artistName;
    spotifyApi.getArtistAlbums(id)
    .then((data)=>{
    res.render("albums", {artists: data.body.items, name, buttonContent: "View Tracks", isArtistSearch: false})
    })
});


app.get("/", (req,res,next)=>{
    res.render("home")
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
