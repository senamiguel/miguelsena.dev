<style>
    .win95-card {
  --card-bg: #c0c0c0;
  --card-border-light: #ffffff;
  --card-border-dark: #808080;
  --card-border-darker: #404040;
  --card-titlebar: linear-gradient(90deg, #000080, #1084d0);
  --card-title-text: #ffffff;
  --card-text: #000000;
  --card-display-bg: #000000;
  --card-display-text: #00ff00;

  font-family: "Segoe UI", Tahoma, sans-serif;
  font-size: 1em;
  width: 18em;
  background: var(--card-bg);
  border: 0.0625em solid;
  border-color: var(--card-border-light) var(--card-border-darker)
    var(--card-border-darker) var(--card-border-light);
  box-shadow:
    inset 0.0625em 0.0625em 0 var(--card-border-light),
    inset -0.0625em -0.0625em 0 var(--card-border-dark);
}

.card-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25em 0.25em 0.25em 0.5em;
  background: var(--card-titlebar);
  color: var(--card-title-text);
}

.card-title-text {
  font-size: 0.8125em;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.card-controls {
  display: flex;
  gap: 0.125em;
}

.card-btn {
  width: 1em;
  height: 0.875em;
  background: var(--card-bg);
  border: 0.0625em solid;
  border-color: var(--card-border-light) var(--card-border-darker)
    var(--card-border-darker) var(--card-border-light);
  cursor: pointer;
  position: relative;
  padding: 0;
  outline: none;
}

.card-btn:active {
  border-color: var(--card-border-darker) var(--card-border-light)
    var(--card-border-light) var(--card-border-darker);
}

.card-btn:focus {
  outline: 0.0625em dotted var(--card-text);
  outline-offset: -0.1875em;
}

.card-btn-min::after {
  content: "";
  position: absolute;
  bottom: 0.125em;
  left: 50%;
  transform: translateX(-50%);
  width: 0.375em;
  height: 0.125em;
  background: var(--card-text);
}

.card-btn-max::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.4375em;
  height: 0.375em;
  border: 0.0625em solid var(--card-text);
  border-top-width: 0.125em;
  background: transparent;
}

.card-btn-close::before,
.card-btn-close::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5em;
  height: 0.0625em;
  background: var(--card-text);
}

.card-btn-close::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.card-btn-close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.card-menubar {
  display: flex;
  gap: 0.125em;
  padding: 0.25em 0.375em;
  border-bottom: 0.0625em solid var(--card-border-dark);
}

.menu-item {
  font-size: 0.75em;
  padding: 0.125em 0.5em;
  color: var(--card-text);
  cursor: pointer;
}

.menu-item:hover {
  background: #000080;
  color: #ffffff;
}

.card-body {
  padding: 0.75em;
}

.player-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  margin-bottom: 0.5em;
  background: var(--card-display-bg);
  border: 0.0625em solid;
  border-color: var(--card-border-dark) var(--card-border-light)
    var(--card-border-light) var(--card-border-dark);
  box-shadow: inset 0.0625em 0.0625em 0 var(--card-border-darker);
}

.track-name {
  font-size: 0.6875em;
  font-family: monospace;
  color: var(--card-display-text);
  animation: blink-text 1s step-end infinite;
}

@keyframes blink-text {
  50% {
    opacity: 0.7;
  }
}

.track-time {
  font-size: 0.625em;
  font-family: monospace;
  color: var(--card-display-text);
}

.player-progress {
  position: relative;
  height: 0.75em;
  margin-bottom: 0.625em;
  background: var(--card-bg);
  border: 0.0625em solid;
  border-color: var(--card-border-dark) var(--card-border-light)
    var(--card-border-light) var(--card-border-dark);
  box-shadow: inset 0.0625em 0.0625em 0 var(--card-border-darker);
}

.progress-fill {
  width: 21%;
  height: 100%;
  background: #000080;
}

.progress-thumb {
  position: absolute;
  top: -0.0625em;
  left: 21%;
  width: 0.5em;
  height: 0.875em;
  background: var(--card-bg);
  border: 0.0625em solid;
  border-color: var(--card-border-light) var(--card-border-darker)
    var(--card-border-darker) var(--card-border-light);
  transform: translateX(-50%);
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 0.25em;
}

.ctrl-btn {
  width: 2em;
  height: 1.5em;
  background: var(--card-bg);
  border: 0.125em solid;
  border-color: var(--card-border-light) var(--card-border-darker)
    var(--card-border-darker) var(--card-border-light);
  cursor: pointer;
  position: relative;
  outline: none;
}

.ctrl-btn:hover {
  background: #d4d4d4;
}

.ctrl-btn:active {
  border-color: var(--card-border-darker) var(--card-border-light)
    var(--card-border-light) var(--card-border-darker);
}

.ctrl-btn:focus {
  outline: 0.0625em dotted var(--card-text);
  outline-offset: -0.25em;
}

.ctrl-prev::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 40%;
  border: 0.25em solid transparent;
  border-right: 0.3125em solid var(--card-text);
  transform: translate(-50%, -50%);
}

.ctrl-prev::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 30%;
  width: 0.125em;
  height: 0.5em;
  background: var(--card-text);
  transform: translate(-50%, -50%);
}

.ctrl-play::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 55%;
  border: 0.3125em solid transparent;
  border-left: 0.375em solid var(--card-text);
  transform: translate(-50%, -50%);
}

.ctrl-stop::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5em;
  height: 0.5em;
  background: var(--card-text);
  transform: translate(-50%, -50%);
}

.ctrl-next::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 60%;
  border: 0.25em solid transparent;
  border-left: 0.3125em solid var(--card-text);
  transform: translate(-50%, -50%);
}

.ctrl-next::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 70%;
  width: 0.125em;
  height: 0.5em;
  background: var(--card-text);
  transform: translate(-50%, -50%);
}

.card-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25em 0.375em;
  background: var(--card-bg);
  border-top: 0.0625em solid var(--card-border-light);
  box-shadow: inset 0 0.0625em 0 var(--card-border-dark);
}

.status-text {
  font-size: 0.6875em;
  color: var(--card-text);
  padding: 0.125em 0.25em;
  border: 0.0625em solid;
  border-color: var(--card-border-dark) var(--card-border-light)
    var(--card-border-light) var(--card-border-dark);
  flex: 1;
}

.status-vol {
  font-size: 0.625em;
  padding: 0.125em 0.375em;
  margin-left: 0.25em;
  background: var(--card-bg);
  border: 0.0625em solid;
  border-color: var(--card-border-dark) var(--card-border-light)
    var(--card-border-light) var(--card-border-dark);
  color: var(--card-text);
}
</style>

<div class="win95-card cursor-grab">
  <div class="card-titlebar">
    <span class="card-title-text">Media Player - My fav songs </span>
    <div class="card-controls">
      <button class="card-btn card-btn-min" aria-label="minimize"></button>
      <button class="card-btn card-btn-max" aria-label="maximize"></button>
      <button class="card-btn card-btn-close" aria-label="close"></button>
    </div>
  </div>
  <div class="card-menubar">
    <span class="menu-item">File</span>
    <span class="menu-item">Play</span>
    <span class="menu-item">Options</span>
  </div>
  <div class="card-body">
    <div class="player-display">
      <span class="track-name">{songs[currentSongIndex].name}.mp3</span>
      <span class="track-time">{currentDuration[0]}:{currentDuration[1]} / {trackDuration[0]}:{trackDuration[1]}</span>
    </div>
    <div class="player-progress">
      <div class="progress-fill"></div>
      <div class="progress-thumb"></div>
    </div>
    <div class="player-controls">
      <button class="ctrl-btn ctrl-prev" aria-label="previous" on:click={handlePrev}></button>
      <button class="ctrl-btn ctrl-play" aria-label="play" on:click={handlePlay}></button>
      <button class="ctrl-btn ctrl-stop" aria-label="stop" on:click={handleStop}></button>
      <button class="ctrl-btn ctrl-next" aria-label="next" on:click={handleNext}></button>
    </div>
  </div>
  <div class="card-statusbar">
    <span class="status-text">{currentState}</span>
    <span class="status-vol">Vol: 75%</span>
  </div>
</div>

<script>
  import { onMount } from 'svelte';
  const STATES = {
    PLAYING: 'playing',
    PAUSED: 'paused',
    STOPPED: 'stopped'
  };
  const songs = [{
          "name": "Xtal",
          "artist": "Aphex Twin",
          "url": "https://dn720309.ca.archive.org/0/items/selected-ambient-works-85-92-flac/01.%20Aphex%20Twin%20-%20Xtal.mp3"
        },
        {
          "name": "Tha",
          "artist": "Aphex Twin",
          "url": "https://ia800800.us.archive.org/8/items/selected-ambient-works-85-92-flac/02.%20Aphex%20Twin%20-%20Tha.mp3"
        },
        {
          "name": "Aria Math",
          "artist": "C418",
          "url": "https://archive.org/download/minecraft-volume-beta/Minecraft%20Volume%20Beta%2F13.%20Aria%20Math.mp3"
        },
        {
          "name": "The great gig in the sky",
          "artist": "Pink Floyd",
          "url": "https://shell.lug.mtu.edu/~dane/files/The%20Dark%20Side%20Of%20The%20Moon/05%20-%20Pink%20Floyd%20-%20The%20Great%20Gig%20in%20the%20Sky%20%282023%20Remaster%29.flac"
        }];
  let Amplitude;
  let currentState = STATES.STOPPED;
  let currentSongIndex = 0;
  let currentDuration = ['0'.padStart(2,'0'),'0'.padStart(2,'0')];
  let trackDuration = ['0'.padStart(2,'0'),'0'.padStart(2,'0')];

  const handlePlay = () =>{
    if (currentState == STATES.PLAYING){
      Amplitude?.pause();
      currentState = Amplitude.getPlayerState()
    }
    else{
      Amplitude?.play();
      currentState = Amplitude.getPlayerState();
    }
  }
  const handleStop = () =>{
    Amplitude?.stop();
    currentState = Amplitude.getPlayerState();
  }
  const handleNext = () =>{
    Amplitude?.next();
    currentState = Amplitude.getPlayerState();
  }
  const handlePrev = () =>{
    if(Amplitude.getSongPlayedSeconds() > 5 || currentSongIndex == 0){
      Amplitude.skipTo(0, Amplitude.getActiveIndex());
    }
    else{
      Amplitude?.prev();
    }
  }
  function formatMinutesSeconds(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');  
      return [formattedMinutes, formattedSeconds];
  }
  onMount(async () => {
    Amplitude = (await import('amplitudejs')).default;
        Amplitude.init({
          songs, callbacks: {
            loadeddata: function(){
              currentSongIndex = Amplitude.getActiveIndex();
              trackDuration = formatMinutesSeconds(Amplitude.getSongDuration());
            },
            timeupdate: function(){
              currentDuration = formatMinutesSeconds(Amplitude.getSongPlayedSeconds());
            }
          }
        })
    });

</script>