let playlists = {
    "Top Temas": [
        { title: "Edgardo Vereda - Tomi", url: "audios/edgardovereda.mp3" },
        { title: "La Tibia y Perone - Tomi, Ale", url: "audios/latibia.mp3" },
        { title: "La Mansión - Jere, Ale, Brandon", url: "audios/La Mansion.mp3" }
    ],
    "Obras Industriales 2": [
        { title: "Tomas Mierdalan - Tomi", url: "audios/tomascorvalan.mp3" },
        { title: "Braian Camierda - Tomi", url: "audios/braiancamierda.mp3" },
        { title: "La Tibia y Perone - Tomi, Ale", url: "audios/latibiayperone.mp3" },
        { title: "Tiradera Andrés - Jere, Nacho, Ale", url: "audios/tiraderaandres.mp3" },
        { title: "Debate Presidencial - Jere", url: "audios/debate.mp3" },
        { title: "Tomi Cabrera Botón - Jere", url: "audios/tomicabreraboton.mp3" }
    ],
    "Obras Industriales 1": [
        { title: "Salamaleco - Tomi", url: "audios/Salamaleco.mp3" },
        { title: "Yo no Quiero Estudiar - Ale, Jere", url: "audios/yonoquieroestudiar.mp3" },
        { title: "Caminaba por el Parque - Andrés", url: "audios/caminabaporelparque.mp3" }
    ],
    "Linda Amarilla New Era": [
        { title: "Dembow La Linda Amarilla - Tomi", url: "audios/Dembow.mp3" },
        { title: "La Mansión - Jere, Brandon, Ale", url: "audios/braiancamierda.mp3" },
        { title: "Niño Prodijio - Ale", url: "audios/Niño prodijio final.mp3" },
        { title: "Conjunto del Nacional - Tomi", url: "audios/conjuntonacional.mp3" },
        { title: "ICE CUP - Ale, Jere, Nacho, Andrés", url: "audios/icecup.mp3" }
    ]
};

let currentPlaylist = [];
let currentSongIndex = 0;
let playing = false;

const audioPlayer = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.getElementById('progress-bar-container');
const currentTimeDisplay = document.getElementById('current-time');
const durationTimeDisplay = document.getElementById('duration-time');

function loadPlaylist(name) {
    currentPlaylist = playlists[name];
    currentSongIndex = 0;

    const container = document.getElementById('song-list-container');
    const list = document.getElementById('song-list');
    const title = document.getElementById('playlist-title');

    title.textContent = name;
    list.innerHTML = '';
    container.style.display = 'block';

    currentPlaylist.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.onclick = () => playSong(index);
        list.appendChild(li);
    });

    playSong(0); // autoplay primera canción
}

function togglePlay() {
    if (playing) {
        audioPlayer.pause();
        playing = false;
    } else {
        audioPlayer.play();
        playing = true;
    }
}

function playPrev() {
    currentSongIndex = (currentSongIndex === 0) ? currentPlaylist.length - 1 : currentSongIndex - 1;
    playSong(currentSongIndex);
}

function playNext() {
    currentSongIndex = (currentSongIndex === currentPlaylist.length - 1) ? 0 : currentSongIndex + 1;
    playSong(currentSongIndex);
}

audioPlayer.addEventListener('timeupdate', () => {
    updateProgressBar();
    updateSongTime();
});

audioPlayer.addEventListener('ended', () => {
    playNext();
});

function updateProgressBar() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateSongTime() {
    const currentTime = formatTime(audioPlayer.currentTime);
    const durationTime = formatTime(audioPlayer.duration);
    currentTimeDisplay.textContent = currentTime;
    durationTimeDisplay.textContent = durationTime;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

// Reproduce la canción seleccionada
function playSong(index) {
    const song = currentPlaylist[index];
    audioPlayer.src = song.url;
    audioPlayer.play();
    playing = true;
    currentSongIndex = index;
    updateSongList();
}

function updateSongList() {
    const listItems = document.querySelectorAll('#song-list li');
    listItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentSongIndex) {
            item.classList.add('active');
        }
    });
}

// Click en playlist
document.querySelectorAll('.playlist-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const playlistName = this.querySelector('p').textContent;
        loadPlaylist(playlistName);
    });
});

// 🔁 Nueva funcionalidad: clic para adelantar o retroceder en la barra de progreso
progressBarContainer.addEventListener('click', function (e) {
    const rect = progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    audioPlayer.currentTime = percentage * audioPlayer.duration;
});
