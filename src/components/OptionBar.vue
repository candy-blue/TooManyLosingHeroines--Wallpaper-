<script setup>
import {ref} from "vue";

const emit = defineEmits(['playerHandler','clockHandler','audioVisHandle','playlistHandler'])

const optionIcon = [
  './assets/icons/darkclock.png',
  './assets/icons/darksound.png',
  './assets/icons/darkbackground.png',
  './assets/icons/darkheadphones.png',
  './assets/icons/playlist.png'
]

const settingIcon = './assets/icons/darksetting.png'

const optStatus = ref(false)

const optionEvent = (value) => {
  console.log()
  if (value === 1){
    clockHandler()
  }else if (value === 2){
    audioVisHandle()
  }else if (value === 3){

  }else if (value === 4){
    playerHandler()
  }else if (value === 5){
    playlistHandler()
  }
}

const playerHandler = () => {
  emit('playerHandler')
}

const clockHandler = () => {
  emit('clockHandler')
}

const audioVisHandle = () => {
  emit('audioVisHandle')
}

const playlistHandler = () => {
  emit('playlistHandler')
}
</script>

<template>
  <div>
    <div class="optionBar" v-show="optStatus">
      <img v-for="(item,index) in optionIcon" :key="index" alt class="optionIcon" :src="item" :style="{ top: `${7.5 * index}%` }" @click="optionEvent(index+1)" >
    </div>
    <img :src="settingIcon" alt class="navigation opacity-70" height="5vh" width="5vh" @click="optStatus=!optStatus">
  </div>
</template>

<style scoped>
.optionBar {
  height: 37vh;
  position: absolute;
  right: 1.5vh;
  top: 15%;
  width: 8vh;

  .optionIcon {
    animation: boxTurn 9s infinite;
    height: 5vh;
    margin: auto;
    position: relative;
    width: 5vh;
    opacity: 0.2;
    transition: .5s ease;

    &:hover {
      cursor: pointer;
      opacity: 0.9;
    }
  }
}

.navigation {
  animation: boxRotate 5s infinite;
  height: 5vh;
  position: absolute;
  right: 3vh;
  top: 5.5%;
  width: 5vh;
  opacity: 0.2;
  transition: .5s ease;

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
}

@keyframes boxTurn {
  33% {
    transform: rotate(45deg);
  }
  66% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes boxRotate {
  50% {
    transform: rotate(180deg);
  }
}

</style>