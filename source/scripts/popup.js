

jQuery.getJSON("../manifest.json",function(data) {
	document.title = data.name;
});




function openPopup(artist, song, lyrics){

	chrome.runtime.getBackgroundPage(function(bgWindow) {
		bgWindow.storeBackgroundTempData(artist, song, lyrics);
		chrome.windows.create({'url': '../pages/popup_window.html', 'type': 'detached_panel', 'width': $(window).width()+30, 'height': $(window).height()-20, 'focused':true });
		window.close();
	});
	
}

restart();
function restart(){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {query:"getInfo" },
			function(response) {
				// We need to check if the user is actually playing a song
				$("#top_bar_song_delay").css("display", "none");
				$("#top_bar_autoscroll").css("display", "none");
				clearInterval(lyricsSyncInterval);
				if(!response.currentSong || !response.currentArtist){
					if(!response.isPlaying){
						$("#status").html("Play a song first ;)");
					} else {
						showInputFields("We could not identify your song, <br/>please use the form above.", response.currentArtist, response.currentSong);
					}
				}
				else{
					fetchLyrics(response.currentArtist, response.currentSong);
				}
			}
		);
	});
}
