function setCurrentSong(trackId) {
    let url = `http://localhost:3000/discover/track/${trackId}`;
    $.get(url, (data) => {
        $('#curr-name').text(data.name);
        $('#artists').children().remove();
        data.artists.forEach((artist) => {
            let nameElement = document.createElement('h3');
            nameElement.innerText = artist.name;
            $('#artists').append(nameElement);
        }) 
        $('#curr-song').text();
        $('#curr-album').text(data.album.name);
        $('#album-art').attr("src", data.album.images[1].url);

         // Update iframe src
        $('#song-src').attr("src", "https://open.spotify.com/embed?uri=spotify:track:" + data.id);
    });
}
