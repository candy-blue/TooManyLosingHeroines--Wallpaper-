<script setup>
import {onMounted, onBeforeUnmount, ref, nextTick} from "vue";

const props = defineProps({
  textShow: {
    type: String,
    default: '3px 3px rgba(237, 112 ,154 ,.7)'
  }
})

const hour = ref('00');
const minute = ref('00');
const second = ref('00');
let timer = null;

const updateClock = () => {
  const now = new Date();
  hour.value = String(now.getHours()).padStart(2, '0');
  minute.value = String(now.getMinutes()).padStart(2, '0');
  second.value = String(now.getSeconds()).padStart(2, '0');
};

const setClockStyle = () => {
  const color = props.textShow;
  const clock = document.getElementsByClassName('mainClock')[0]
  if (color) {
    console.log(clock)
    clock.style.textShadow = color
  }
};

onMounted(() => {
  updateClock();
  nextTick(()=>{
    setClockStyle();
  })
  timer = setInterval(updateClock, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="mainClock opacity-80 absolute">
    {{ hour }}:{{ minute }}
    <span class="mainSecond">{{ second }}</span>
  </div>
</template>

<style scoped>
.mainClock{
  font-size: 8rem;
  top: 79vh;
  right: 2vw;
  color: white;
  .mainSecond {
    font-size: 1.875rem;
    color: white;
    line-height: 2.25rem;
    top: 0;
    position: relative;
    right: 3vh;
  }
}

</style>
