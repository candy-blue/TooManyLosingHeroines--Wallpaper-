<script setup>
const props = defineProps({
  src:{
    type: String,
    default: ''
  },
  borderRadius: {
    type: String,
    default: '0'
  }
})

</script>

<template>
  <img :src="src" alt class="image-box"
       :style="{
          borderRadius: props.borderRadius,
        }"
  />
</template>

<style scoped>
.image-box {
  position: absolute;
  top: 17.5%;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 65%;
  aspect-ratio: 1;
  font-size: 30px;
  background-color: skyblue;
  color: black;
  box-shadow: rgb(21, 6, 37) 1px 1px 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>