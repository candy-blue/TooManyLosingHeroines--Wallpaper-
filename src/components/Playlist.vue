<template>
  <div
    :style="{
      fontSize: `${titleSize * props.textSize}rem`,
      border: `4.5px solid ${props.musicList[props.songIndex].lineColor}`,
      boxShadow: '1px 1px 6px #150625',
    }"
    class="playlist"
  >
    <!-- 导航部分 -->
    <div class="playlistNavigation" style="height: 10%">
      <button
        :style="{
          borderBottom: `3px solid ${props.musicList[props.songIndex].lineColor}`,
          borderRight: `3px solid ${props.musicList[props.songIndex].lineColor}`,
        }"
        class="h-full w-1/3"
        @click="changeMode(0)"
      >
        Default
      </button>
      <button
        :style="{
          borderBottom: `3px solid ${props.musicList[props.songIndex].lineColor}`,
          borderRight: `3px solid ${props.musicList[props.songIndex].lineColor}`,
        }"
        class="h-full w-1/3"
        @click="changeMode(1)"
      >
        Playlist 1
      </button>
      <button
        :style="{ borderBottom: `3px solid ${props.musicList[props.songIndex].lineColor}` }"
        class="w-1/3 h-full"
        @click="changeMode(2)"
      >
        Playlist 2
      </button>
    </div>

    <!-- 歌曲列表部分 -->
    <div class="playlist-container" style="height: 80%">
      <div class="playlist-item-container">
        <div v-if="props.mode === 0" class="h-full">
          <div
            v-for="(song, index) in props.musicList.slice(playlistPages * 5, playlistPages * 5 + 5)"
            :key="index"
            class="playlist-item"
            @click="changeId(song.id - 1)"
          >
            <p
              :style="{
                opacity: '.85',
                borderBottom: `3px solid ${props.musicList[props.songIndex].lineColor}`,
              }"
            >
              {{ song.id }}. {{ song.name }}
            </p>
          </div>
        </div>

        <div v-if="props.mode === 1" class="h-full">
          <div
            v-for="(song, index) in props.songList[0].slice(playlistPages * 5, playlistPages * 5 + 5)"
            :key="index"
            class="playlist-item"
            @click="changeId(song)"
          >
            <p
              :style="{
                opacity: '.85',
                borderBottom: `3px solid ${props.musicList[props.songIndex].lineColor}`,
              }"
            >
              {{ playlistPages * 5 + index + 1 }}. {{ props.musicList.find(item => item.id === (song + 1)).name }}</p>
          </div>
        </div>

        <div v-if="props.mode === 2" class="h-full">
          <div
            v-for="(song, index) in props.songList[1].slice(playlistPages * 5, playlistPages * 5 + 5)"
            :key="index"
            class="playlist-item"
            @click="changeId(song)"
          >
            <p
              :style="{
                opacity: '.85',
                borderBottom: `3px solid ${props.musicList[props.songIndex].lineColor}`,
              }"
            >{{ playlistPages * 5 + index + 1 }}. {{ props.musicList.find(item => item.id === (song + 1)).name }}</p>
          </div>
        </div>
      </div>

      <!-- 分页控制 -->
      <div
        :style="{ borderLeft: `2px solid ${props.musicList[props.songIndex].lineColor}` }"
        class="playlist-scroll"
      >
        <div class="playlist-scroll-img" style="top: 12%" @click="onPages(-1)">
          <img alt="" :src="icon[0]"/>
        </div>
        <div class="playlist-scroll-img" style="bottom: 10%" @click="onPages(1)">
          <img alt="" :src='icon[1]'/>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div
      :style="{ height: '10%', borderTop: `4.5px solid ${props.musicList[props.songIndex].lineColor}` }"
      class="playlistNavigation"
    >
      <div v-if="props.mode === 0" class="h-full">
        <button
          :style="{ borderRight: `3px solid ${props.musicList[props.songIndex].lineColor}` }"
          class="w-1/2 h-full"
          @click="onFooter(true, 1)"
        >
          Playlist 1
        </button>
        <button class="w-1/2 h-full" @click="onFooter(true, 2)">Playlist 2</button>
      </div>
      <div v-else class="w-full h-full">
        <button class="h-full w-full" @click="onFooter(false, 0)">Remove Current Song</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';

const emit = defineEmits(['changeId', 'addSong', 'changeMode', 'removeSong']);
const props = defineProps({
  musicList: {
    type: Array,
    default: () => []
  },
  textSize: {
    type: Number,
    default: 1
  },
  songIndex: {
    type: Number,
    default: 0
  },
  songList: {
    type: Array,
    default: () => []
  },
  mode: {
    type: Number,
    default: 0
  }
})

const icon = [
  "./assets/icons/upBar.png",
  "./assets/icons/downBar.png"
]

const playlistPages = ref(0);
const titleSize = ref(1);

const onFooter = (add, playlistIndex) => {
  if (add) {
    addSong(props.songIndex, playlistIndex);
  } else {
    removeSong(props.songIndex, playlistIndex);
  }
};

const onPages = (direction) => {
  const currentListLength = props.mode === 0 ? props.musicList.length : props.songList[props.mode - 1].length;

  if (direction === -1 && playlistPages.value + direction >= 0) {
    playlistPages.value += direction;
  } else if (direction === 1 && playlistPages.value + direction < currentListLength / 5) {
    playlistPages.value += direction;
  } else {
    playlistPages.value = direction === -1 ? Math.floor(currentListLength / 5) : 0;
  }
};

onMounted(() => {
  if (window.innerWidth <= 1370) {
    titleSize.value = 0.875;
  }

  const handleResize = () => {
    titleSize.value = window.innerWidth <= 1370 ? 0.875 : 1;
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
});

const changeId = (id) => {
  emit('changeId', id);
}

const changeMode = (mode) => {
  emit('changeMode', mode);
}

const addSong = (id, playlistIndex) => {
  emit('addSong', id, playlistIndex);
}

const removeSong = (id, playlistIndex) => {
  emit('removeSong', id, playlistIndex);
}

watch(() => props.mode, () => {
  playlistPages.value = 0;
});
</script>

<style scoped>
.playlist-item-container {
  height: 100%;
}
</style>
