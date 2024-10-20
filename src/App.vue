<template>
  <div v-if="MusicInfo" class="main">
    <Playlist
      v-show="playlistShow"
      :mode="mode"
      :music-list="MusicInfo"
      :song-index="songIndex"
      :song-list="playlist"
      @addSong="addSong"
      @changeId="changeId"
      @changeMode="changeMode"
      @removeSong="removeSong"
    ></Playlist>
    <AudioVisualization v-show="audioVis" :border-radius="imgBorderRadius" :line-color="MusicInfo[songIndex].lineColor"></AudioVisualization>
    <MainImage :border-radius="imgBorderRadius" :src="srcList[songIndex]"></MainImage>
    <div>
      <OptionBar @audioVisHandle="audioVisHandle" @clockHandler="clockHandle" @playerHandler="playerHandle"
                 @playlistHandler="playlistHandle"></OptionBar>
    </div>
    <Clock v-if="MusicInfo && clockShow" :text-show="MusicInfo[songIndex].clockTextShadow"></Clock>
    <Player
      v-show="player"
      :music-list="MusicInfo"
      :replay="playerIcon[0]"
      :shuffle="playerIcon[1]"
      :song-index="songIndex"
      @changeSong="changeSong"
      @reShuffle="reShuffle"
    ></Player>
  </div>
</template>

<script setup>
import {nextTick, onMounted, ref} from 'vue';
import Clock from "@/components/Clock.vue";
import Player from "@/components/Player.vue";
import OptionBar from "@/components/OptionBar.vue";
import AudioVisualization from "@/components/AudioVisualization.vue";
import Playlist from "@/components/Playlist.vue";
import MainImage from "@/components/MainImage.vue";

const player = ref(true) // 播放条显示
const mode = ref(0)
const clockShow = ref(true) // 时间显示隐藏
const playlistShow = ref(false)
const audioVis = ref(true)
const playerIcon = ref([false, false])
const songIndex = ref(0)
const playlist = ref([[], []])
const key = ref(0)

const imgBorderRadius = ref('0')

//新 初始化配置
const getOptions = () => {
  try {
    player.value = getItem('player') ? getItem('player') : true
    mode.value = getItem('mode') ? getItem('mode') : '0'
    clockShow.value = getItem('clockShow') ? getItem('clockShow') : true
    playlistShow.value = getItem('playlistShow') ? getItem('playlistShow') : false
    audioVis.value = getItem('audioVis') ? getItem('audioVis') : true
    playerIcon.value = getItem('playerIcon') ? getItem('playerIcon') : [false, false]
    playlist.value = getItem('playlist') ? getItem('playlist') : [[], []]
  } catch (e) {
    player.value = true
    localStorage.setItem('player', player.value)
    mode.value = 0
    localStorage.setItem('mode', mode.value)
    playlistShow.value = false
    localStorage.setItem('playlistShow', playlistShow.value)
    clockShow.value = true
    localStorage.setItem('clockShow', clockShow.value)
    audioVis.value = true
    localStorage.setItem('audioVis', audioVis.value)
    playerIcon.value = [false, false]
    localStorage.setItem('playerIcon', JSON.stringify(playerIcon.value))
    playlist.value = [[], []]
    localStorage.setItem('playlist', JSON.stringify(playlist.value))
  }

  try {
    window.wallpaperPropertyListener = {
      applyUserProperties: function(properties) {
        console.log('事件更新')
        if (properties.shapes) {
          console.log("shapes----》", properties.shapes.value)
          if (properties.shapes.value === "1"){
            imgBorderRadius.value = '0'
          }else if (properties.shapes.value === "2"){
            imgBorderRadius.value = '50%'
          }
        }
      },
    };
    console.log("wallpaer环境")
  }catch (e) {
    console.warn("no wallpaper engine",e)
  }
}
// 修改player状态
const reShuffle = (x, y) => {
  //Replay and Shuffle
  if (x === "shuffle") {
    playerIcon.value[1] = y
    playerIcon.value[0] = false;
    localStorage.setItem("playerIcon", JSON.stringify(playerIcon.value));
  } else {
    playerIcon.value[0] = y
    playerIcon.value[1] = false;
    localStorage.setItem("playerIcon", JSON.stringify(playerIcon.value));
  }
};
// 切换音乐
const changeSong = (e) => {
  if (mode.value === 0) {
    // 默认播放列表
    if (!playerIcon.value[1]) {
      // 非随机播放
      if (e === true) {
        // 下一首
        if (songIndex.value + 1 >= MusicInfo.value.length) {
          songIndex.value = 0;
        } else {
          songIndex.value += 1;
        }
      } else {
        // 上一首
        if (songIndex.value - 1 < 0) {
          songIndex.value = MusicInfo.value.length - 1;
        } else {
          songIndex.value -= 1;
        }
      }
    } else {
      // 随机播放
      songIndex.value = Math.floor(Math.random() * MusicInfo.value.length);
    }
  } else if (Array.isArray(playlist.value[mode.value - 1]) && playlist.value[mode.value - 1].length) {
    // 自定义播放列表 1 或 2，并且检查列表是否为空
    const currentList = playlist.value[mode.value - 1];
    if (!playerIcon.value[1]) {
      if (e === true) {
        // 下一首
        if (key.value + 1 < currentList.length) {
          key.value += 1;
          setKeyAndIndex(key.value);
        } else {
          key.value = 0
          setKeyAndIndex(key.value);
        }
      } else {
        // 上一首
        if (key.value - 1 >= 0) {
          key.value -= 1;
          setKeyAndIndex(key.value);
        } else {
          key.value = currentList.length - 1
          setKeyAndIndex(key.value);
        }
      }
    } else {
      // 随机播放
      const randomIndex = Math.floor(Math.random() * currentList.length);
      songIndex.value = currentList[randomIndex] - 1;
    }
  }
  nextTick(() => {
    setStyle()
  })
};

// 更新歌曲索引和 key
const setKeyAndIndex = (newKey) => {
  const currentList = playlist.value[mode.value - 1];
  songIndex.value = currentList[newKey];
};

const playerHandle = () => {
  player.value = !player.value
  localStorage.setItem("player", player.value);
};

const clockHandle = () => {
  clockShow.value = !clockShow.value
  localStorage.setItem("clockShow", clockShow.value);
}

const audioVisHandle = () => {
  audioVis.value = !audioVis.value
  localStorage.setItem("audioVis", audioVis.value);
}

const playlistHandle = () => {
  playlistShow.value = !playlistShow.value
  localStorage.setItem("playlistShow", playlistShow.value);
};

const changeId = (e) => {
  console.log('点击的id', e)
  songIndex.value = e
  setStyle()
}

const changeMode = (e) => {
  mode.value = e
  key.value = 0
  localStorage.setItem("mode", e);
};

const addSong = (x, y) => {
  if (playlist.value[y - 1].includes(x)) {

  } else {
    playlist.value[y - 1].push(x)
    localStorage.setItem("playlist", JSON.stringify(playlist.value));
  }
}

const removeSong = (x, y) => {
  playlist.value[y] = playlist.value[y].filter(item => item !== x)
  localStorage.setItem("playlist", JSON.stringify(playlist.value));
}

const getItem = (value) => {
  return JSON.parse(getItem(value))
}

const setStyle = () => {
  const main = document.getElementsByClassName('main')[0]
  main.style.backgroundColor = MusicInfo.value[songIndex.value].backgroundColor
}

onMounted(() => {
  getOptions()
  loadConfig()
  getImageList()
});

const loadConfig = () => {
  return new Promise((resolve, reject) => {
    // 动态创建 script 标签
    const script = document.createElement('script');
    script.src = './config.js';  // 指向 public 目录中的 config.js 文件
    script.onload = () => {
      if (window.musicConfig) {
        resolve(window.musicConfig);  // 成功加载，返回 config
      } else {
        reject("Config not found in the loaded script.");
      }
    };
    script.onerror = () => {
      reject("Failed to load config.js");
    };
    document.head.appendChild(script);
  });
};


// 基本设置
const MusicInfo = ref(null); // 歌曲对象
const srcList = ref([]); // 图片路径列表


const getImageList = async () => {
  try {
    // 动态加载 config.js
    let MuiseData = await loadConfig();

    MusicInfo.value = MuiseData;

    MusicInfo.value.forEach(item => {
      srcList.value.push("./assets/images/".concat(item.name, ".jpg"))
    })
    await nextTick(() => {
      setStyle()
    })
  } catch (error) {
    console.error("Error loading config:", error);
  }
};
</script>

<style>
.main {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: orange;
  color: white;
  position: relative;
}

@keyframes boxRotate {
  50% {
    transform: rotate(180deg)
  }
}

@keyframes boxTurn {
  33% {
    transform: rotate(45deg)
  }
  66% {
    transform: rotate(-45deg)
  }
  to {
    transform: rotate(0deg)
  }
}
</style>
