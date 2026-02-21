let audio = new Audio();
let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];

// Initialize
window.onload = () => {
    // We don't auto-play empty samples anymore to avoid errors
    updatePlaylistDisplay();
};

function togglePlayPause() {
    if (playlist.length === 0) return alert("Please add some songs first!");
    
    const playBtn = document.getElementById('playBtn');
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play().catch(e => console.error("Playback failed", e));
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        const song = {
            name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
            artist: "Local File",
            url: URL.createObjectURL(file)
        };
        playlist.push(song);
    });
    updatePlaylistDisplay();
    if (playlist.length === files.length) playSong(0); // Play first song if list was empty
}

function playSong(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentSongIndex = index;
    const song = playlist[index];
    
    audio.src = song.url;
    document.getElementById('songName').textContent = song.name;
    document.getElementById('artistName').textContent = song.artist;
    
    audio.play();
    isPlaying = true;
    document.getElementById('playBtn').innerHTML = '<i class="fas fa-pause"></i>';
    updatePlaylistDisplay();
}

function updatePlaylistDisplay() {
    const container = document.getElementById('playlistItems');
    container.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const div = document.createElement('div');
        div.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        div.onclick = () => playSong(index);
        div.innerHTML = `
            <div style="flex:1">
                <div style="font-size:14px; font-weight:500">${song.name}</div>
                <div style="font-size:12px; color:#aaa">${song.artist}</div>
            </div>
            <i class="fas ${index === currentSongIndex && isPlaying ? 'fa-volume-up' : 'fa-play'}" style="color:var(--primary)"></i>
        `;
        container.appendChild(div);
    });
}

// Progress Bar Logic
audio.addEventListener('timeupdate', () => {
    const fill = document.getElementById('progressFill');
    const current = document.getElementById('currentTime');
    const total = document.getElementById('totalTime');
    
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + '%';
        current.textContent = formatTime(audio.currentTime);
        total.textContent = formatTime(audio.duration);
    }
});

function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function seekTo(e) {
    const bar = e.currentTarget;
    const pct = e.offsetX / bar.offsetWidth;
    audio.currentTime = pct * audio.duration;
}

function changeVolume(val) {
    audio.volume = val / 100;
}

function skipNext() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playSong(currentSongIndex);
}

function skipPrevious() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playSong(currentSongIndex);
}

function addSongToPlaylist() {
    document.getElementById('fileInput').click();
}

audio.addEventListener('ended', skipNext);