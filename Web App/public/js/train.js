function submitRating(index, audio, rating) {
    let formElement = document.createElement('form');
    formElement.action = 'rating';

    let audioElement = document.createElement('input');
    audioElement.name = 'audioInfo';
    audioElement.value = audio;
    formElement.appendChild(audioElement);

    let indexElement = document.createElement('input');
    indexElement.name = 'index';
    indexElement.value = index;
    formElement.appendChild(indexElement);

    let ratingElement = document.createElement('input');
    ratingElement.name = 'likeOrUnlike';
    ratingElement.value = rating;
    formElement.appendChild(ratingElement);

    document.body.appendChild(formElement);
    formElement.submit();
}

function submitRatingFromPlaylist() {
    let formElement = document.createElement('form');
    formElement.action = 'ratingFromPlaylist';

    let inputElement = document.createElement('input');
    inputElement.name = 'trackId'
    inputElement.value = $('#track-id').value;
    formElement.appendChild(inputElement);

    document.body.appendChild(formElement);
    formElement.submit();
}

function setCurrentSong(song, audio) {
    let songObject = JSON.parse(song);

    $('#current-song').children().remove();

    let nameElement = document.createElement('h1');
    nameElement.innerText = songObject.name;
    $('#current-song').append(nameElement);


    // Clear from current-song
    for (let i=0; i<songObject.artists.length; i++) {
        let artistElement = document.createElement('h3');
        artistElement.innerText = songObject.artists[i].name;
        $('#current-song').append(artistElement);
    }

    let albumElement = document.createElement('h3');
    albumElement.innerText = songObject.album.name;
    $('#current-song').append(albumElement);

    // Update Album Art
    let albumArtElement = document.createElement('img');
    albumArtElement.src = songObject.album.images[1].url;
    $('#current-song').append(albumArtElement);

    let idElement = document.createElement('input');
    idElement.id = 'track-id';
    idElement.type = 'hidden';
    idElement.value = songObject.id;
    $('#current-song').append(idElement);

    // Update iframe src
    $('#song-src').attr("src", "https://open.spotify.com/embed?uri=spotify:track:" + songObject.id);

    $('current-song').attr("current-song", song);
    $('current-song').attr("current-audio", audio);  
}