function submitLikeForm(object, audio) {
    let formElement = document.createElement('form');
    formElement.action = 'like';
    
    let inputElement = document.createElement('input');
    inputElement.name = 'songInfo';
    inputElement.value = object;
    formElement.appendChild(inputElement);

    let audioElement = document.createElement('input');
    audioElement.name = 'audioInfo';
    audioElement.value = audio;
    formElement.appendChild(audioElement);

    document.body.appendChild(formElement);
    formElement.submit();
}

function submitDislikeForm(object, audio) {
    let formElement = document.createElement('form');
    formElement.action = 'dislike';
    
    let inputElement = document.createElement('input');
    inputElement.info = object;
    formElement.appendChild(inputElement);

    let audioElement = document.createElement('input');
    audioElement.name = 'audioInfo';
    audioElement.value = audio;
    formElement.appendChild(audioElement);

    document.body.appendChild(formElement);
    formElement.submit();
}

function setCurrentSong(apples) {
    $('#curr-song').innerHtml = $this.innerHtml;
    $('#curr-artist').innerHtml = $this.attr('artist');
    $('#curr-album').innerHtml = $this.attr('album');
}