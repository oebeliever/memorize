/**
 * 🎵 音乐回忆簿 — 板块模块
 */
(function() {
  'use strict';

  function initMusicMemories() {
    const container = document.getElementById('recordPlayer');
    if (!container) return;

    const songs = CONFIG.musicMemories || [];
    if (songs.length === 0) {
      container.innerHTML = '<p style="color:#999;padding:40px;">还没有添加歌曲哦~</p>';
      return;
    }

    let currentIndex = 0;
    let isPlaying = false;
    let audio = null;

    const disc = document.getElementById('recordDisc');
    const arm = document.getElementById('recordArm');
    const label = document.getElementById('recordLabel');
    const title = document.getElementById('recordTitle');
    const artist = document.getElementById('recordArtist');
    const memory = document.getElementById('recordMemory');
    const playBtn = document.getElementById('recordPlay');
    const prevBtn = document.getElementById('recordPrev');
    const nextBtn = document.getElementById('recordNext');

    function loadSong(index) {
      const song = songs[index];
      if (!song) return;

      // 停止当前播放
      stopPlayback();

      title.textContent = song.title;
      artist.textContent = song.artist;
      memory.textContent = song.memory || '🎵';
      label.textContent = song.coverEmoji || '🎵';

      // 更新唱片颜色
      label.style.background = song.color || 'var(--primary)';

      // 如果有音乐源，创建 audio
      if (song.src) {
        audio = new Audio(song.src);
        audio.loop = false;
        audio.addEventListener('ended', () => {
          nextSong();
        });
      } else {
        audio = null;
      }
    }

    function playSong() {
      if (audio) {
        audio.play().catch(() => {});
      }
      isPlaying = true;
      disc.classList.add('playing');
      arm.classList.add('playing');
      playBtn.textContent = '⏸';
    }

    function stopPlayback() {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      isPlaying = false;
      disc.classList.remove('playing');
      arm.classList.remove('playing');
      if (playBtn) playBtn.textContent = '▶';
    }

    function togglePlay() {
      if (isPlaying) {
        stopPlayback();
      } else {
        playSong();
      }
    }

    function nextSong() {
      currentIndex = (currentIndex + 1) % songs.length;
      loadSong(currentIndex);
      if (isPlaying) playSong();
    }

    function prevSong() {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      loadSong(currentIndex);
      if (isPlaying) playSong();
    }

    // 事件绑定
    disc.addEventListener('click', togglePlay);
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    // 加载第一首
    loadSong(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicMemories);
  } else {
    initMusicMemories();
  }
})();
