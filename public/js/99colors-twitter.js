'use strict';

// http://stackoverflow.com/questions/9215806/how-to-update-the-twitter-share-button-url-with-dynamic-content
// call this method after load 
function setTweet(){
	var name = $.uriAnchor.makeAnchorMap().name;

	// remove any previous clone
	$('#tweet-area').empty()

	// create a clone of the twitter share button template
	var clone = $('.twitter-share-button-template').clone()

	// fix up our clone
	clone.removeAttr('style'); // unhide the clone
	clone.attr('data-url', location.href);
	clone.attr('class', 'twitter-share-button'); 

	// copy cloned button into div that we can clear later
	$('#tweet-area').append(clone);

	// reload twitter scripts to force them to run, converting a to iframe
	$.getScript('http://platform.twitter.com/widgets.js');
}

// https://dev.twitter.com/web/javascript/events
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));

// Wait for the asynchronous resources to load
twttr.ready(function(twttr) {
    // Now bind our custom intent events
    // twttr.events.bind('click', updateRating);
    twttr.events.bind('tweet', updateRating);
    // twttr.events.bind('retweet', function(){console.log('retweet');});
    // twttr.events.bind('favorite', function(){console.log('favorite');});
    // twttr.events.bind('follow', function(){console.log('follow');});
});

function updateRating() {
    var name = $.uriAnchor.makeAnchorMap().name;
    $.post('/api/updateRating/' + name, null)
        .fail(function(xhr) {
            fail(xhr)
        });
}