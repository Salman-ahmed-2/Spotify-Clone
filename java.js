let currentSong = '';
let isPlaying = false;
let currentIcon = null;
let currentTrackName = "";

async function playFromDeezer(div, song) {
  const thisIcon = div.querySelector('.a1 img');

  if (!thisIcon) return;

  
  if (currentSong === song && isPlaying) {
    audio.pause();
    isPlaying = false;
    thisIcon.src = 'img/play.svg';
    return;
  }

  const proxyUrl = 'https://corsproxy.io/?';
  const apiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(song)}`;
  const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
  const data = await response.json();
  const track = data.data.find(t => t.preview);

  if (track && track.preview) {
    audio.src = track.preview;
    audio.play();

    document.querySelectorAll('.a1 img').forEach(img => img.src = 'img/play.svg');
    thisIcon.src = 'img/pause.svg';

    currentSong = song;
    currentIcon = thisIcon;
    isPlaying = true;
    currentTrackName = track.title;

    sinfo.textContent = `Now Playing: ${currentTrackName}`;

    audio.onended = () => {
      thisIcon.src = 'img/play.svg';
      playBtn.src = "img/play.svg";
      isPlaying = false;
      sinfo.textContent = `Finished: ${currentTrackName}`;
    };
  } else {
    alert(`Preview not available for "${song}"`);
  }
}
const audio = document.getElementById('tracks');
const playBtn = document.getElementById('play');
const volumeControl = document.getElementById('volumeControl');
const seekBar = document.getElementById('seekBar');
const currentTimeText = document.getElementById('currentTime');
const durationText = document.getElementById('duration');
const sinfo = document.querySelector('.sinfo');


playBtn.addEventListener('click', () => {
  if (!audio.src) return;
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});


audio.addEventListener('play', () => {
  playBtn.src = "img/pause.svg";
  playBtn.alt = "Pause";
  if (currentTrackName) sinfo.textContent = `${currentTrackName}`;
});

audio.addEventListener('pause', () => {
  playBtn.src = "img/play.svg";
  playBtn.alt = "Play";
  if (currentTrackName) sinfo.textContent = `${currentTrackName}`;
});


volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});


audio.addEventListener('timeupdate', () => {
  seekBar.value = audio.currentTime;
  currentTimeText.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  seekBar.max = audio.duration;
  durationText.textContent = formatTime(audio.duration);
});


seekBar.addEventListener('input', () => {
  audio.currentTime = seekBar.value;
});


function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

 function toggleSidebar() {
    const sidebar = document.querySelector('.left .down');
    sidebar.classList.toggle('active');
  }