<script setup>
import {nextTick, onMounted, ref, watch} from "vue";

const emit = defineEmits(['reShuffle', 'changeSong']);
const props = defineProps({
  // 当前音乐信息
  musicList: {
    type: Array,
    default: () => []
  },
  songIndex: {
    type: Number,
    default: 0
  },
  // 是否循环播放
  replay: {
    type: Boolean,
    default: false
  },
  // 是否随机播放
  shuffle: {
    type: Boolean,
    default: false
  },
  playerTextShadow: {
    type: String,
    default: '3px 3px rgba(237, 112 ,154 ,.7)'
  },
})
const playBarIcon = [
  './assets/icons/replay.png',
  './assets/icons/replayToggle.png',
  './assets/icons/volumeMinus.png',
  './assets/icons/backward.png',
  './assets/icons/pause.png',
  './assets/icons/play.png',
  './assets/icons/forward.png',
  './assets/icons/volumePlus.png',
  './assets/icons/shuffle.png',
  './assets/icons/shuffleToggle.png',
]
const isPlaying = ref(true);

const audio = new Audio();
const currentTime = ref(0); // 当前播放时间
const duration = ref(0); // 音频的总时长

onMounted(() => {
  initAudio();
  nextTick(()=>{
    setStyle()
  })
})

// 拖动进度条，调整音频播放时间
const onSeek = () => {
  if (audio) {
    audio.currentTime = currentTime.value;
  }
};

const reShuffle = (type, value) => {
  emit('reShuffle', type, value);
}
const changePlaying = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    audio.play()
  } else {
    audio.pause();
  }
}
// 音量减小
const lessVolume = () => {
  if (audio.volume >= 0.1) {
    audio.volume -= 0.1;
  }
}
// 音量增大
const addVolume = () => {
  if (audio.volume <= 0.9) {
    audio.volume += 0.1;
  }
}
// 上一首
const prevSong = () => {
  changeSong(false)
  initAudio()
}
// 下一首
const nextSong = () => {
  changeSong(true)
  initAudio()
}

const changeSong = (value) => {
  emit('changeSong', value);
}

const initAudio = () => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  audio.src = `./assets/songs/${props.musicList[props.songIndex].name}.flac`
  // 当音频元数据加载完成后，获取音频的总时长
  audio.onloadedmetadata = () => {
    duration.value = audio.duration;
  };
  // 监听音频的时间更新事件，更新 currentTime
  audio.ontimeupdate = () => {
    currentTime.value = audio.currentTime;
  };
  audio.onended = () => {
    if (props.replay) {
      audio.play();
    } else {
      nextSong();
    }
  };
  audio.addEventListener('canplaythrough', () => {
    audio.play().then(
      () => {
        isPlaying.value = true;
      }
    )
  })
};
const setStyle = () => {
  const musicName = document.getElementsByClassName('musicName')[0]
  const playTime = document.getElementsByClassName('playTime')[0]

  musicName.style.textShadow = props.musicList[props.songIndex].playerTextShadow
  playTime.style.textShadow = props.musicList[props.songIndex].playerTextShadow
}

watch(() => props.songIndex, (newValue, oldValue) => {
  console.log(`songIndex changed from ${oldValue} to ${newValue}`);
  initAudio(); // 重新初始化音频
});

// 格式化时间，将秒数转换为 分:秒 格式
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
</script>

<template>
  <div class="player">
    <div class="musicName flex-center">
      {{ musicList[songIndex].name }}
    </div>
    <div class="playBar">
      <input
        v-model="currentTime"
        :max="duration"
        class="audio-progress"
        step="0.1"
        type="range"
        @input="onSeek"
      />
    </div>
    <div class="playTime">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
    <div class="playerBtn">
      <img :src="props.replay ? playBarIcon[1]: playBarIcon[0]" alt class="audioIcon"
           @click="reShuffle('replay', props.replay!==true)"/>
      <img :src="playBarIcon[2]" alt class="audioIcon" @click="lessVolume"/>
      <img :src="playBarIcon[3]" alt class="audioIcon" @click="prevSong"/>
      <img :src="isPlaying ? playBarIcon[4]: playBarIcon[5]" alt class="audioIcon" @click="changePlaying"/>
      <img :src="playBarIcon[6]" alt class="audioIcon" @click="nextSong"/>
      <img :src="playBarIcon[7]" alt class="audioIcon" @click="addVolume"/>
      <img :src="props.shuffle ? playBarIcon[9]: playBarIcon[8]" alt class="audioIcon"
           @click="reShuffle('shuffle', props.shuffle!==true)"/>
    </div>
  </div>
</template>

<style scoped>
.player {
  height: 10%;
  width: 25%;
  position: absolute;
  top: 83.5%;
  left: 0;
  right: 0;
  margin: 0 auto;

  .musicName {
    width: 100%;
    height: 30%;
    font-size: 1.25rem;
  }

  .playBar {
    width: 100%;
    height: 25%;
    display: flex;
    justify-content: center;

    .audio-progress {
      margin-top: .5vh;
      outline: none;
      position: relative;
      width: calc(100% - 50px);
    }
  }

  .playTime {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
  }

  .playerBtn {
    width: 100%;
    height: 45%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    overflow: hidden;

    .audioIcon {
      display: inline;
      height: 3vh;
      position: relative;
      top: 8%;
      width: 3vh;
      transition: .5s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>