/**
 * Created by Martin_Bliznachki on 7/7/2016.
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var list = [];
var domain = 'https://www.youtube.com';
var url = '/watch?v=phaJXp_zMYM';
var title;
app.get('', function(req, res) {

    var nextSong = function(url) {

        request(domain + url, function(error, response, html) {

            if (!error) {

                var $ = cheerio.load(html);
              
                title = $('#eow-title').text().trim();

                if(checkForUrl(list, url)){

                    list.push({link: url, name: title});
                }

                url = $('.autoplay-bar .thumb-wrapper').children()[0].attribs['href'];

                if(list.length >= 10){

                    res.send(songs(list));
                    return;

                } else {

                    nextSong(url)   ;

                }
            }
        })
    };

    nextSong(url);

});

app.listen('8081');
console.log('Magic happens on port 8081');

function songs(list){
     var str = '';
     for(var i = 0; i < list.length; i++){
         str += '<p><a href="'+ domain + list[i].link +'">' + list[i].name + '</a></p>';
     }
    return str;
}

function checkForUrl(arr, url){
    for(var i = 0; i < arr.length; i++){
        if(arr[i].link == url){
            return false;
        }
    }
    return true;
}
