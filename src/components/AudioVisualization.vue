<script setup>
// 音频响应
import { onMounted, ref } from "vue";

const props = defineProps({
  lineColor: {
    type: String,
    default: '#fff'
  },
  borderRadius: {
    type: String,
    default: '0'
  }
});

const audioCanvasRef = ref(null);
let audioCanvasCtx = null;
let previousAudioArray = []; // 保存前一帧的音量数据
const smoothingFactor = 0.8; // 平滑系数，越接近1越平滑

const initCanvas = () => {
  const audioCanvas = audioCanvasRef.value;
  audioCanvasCtx = audioCanvas.getContext('2d');
};

const smoothTransition = (currentValue, previousValue) => {
  return previousValue + (currentValue - previousValue) * smoothingFactor;
};

const wallpaperAudioListener = (audioArray) => {
  if (!audioCanvasCtx) return;
  const audioCanvas = audioCanvasRef.value;
  audioCanvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
  if (props.borderRadius === '0' ){
    audioCanvas.width = window.innerHeight * 0.65;
    audioCanvas.height = window.innerHeight * 0.175;
    audioCanvas.style.top = '4px';
    drawBar(audioArray);
  } else {
    audioCanvas.style.top = '0';
    audioCanvas.width = window.innerHeight;
    audioCanvas.height = window.innerHeight;
    audioCanvasCtx = audioCanvas.getContext('2d');
    drawCircularBars(audioArray);
  }

};

const drawBar = (audioArray) => {
  const audioCanvas = audioCanvasRef.value;

  // 清除画布
  audioCanvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);

  const totalBars = 64; // 绘制的音频条总数
  const barWidth = audioCanvas.width / (totalBars + totalBars - 1); // 每个条的宽度
  const halfCount = Math.min(audioArray.length / 2, totalBars);

  // 初始化 previousAudioArray，如果它为空
  if (previousAudioArray.length === 0) {
    previousAudioArray = new Array(audioArray.length).fill(0);
  }

  // 设置条的颜色
  audioCanvasCtx.fillStyle = props.lineColor;

  // 绘制左声道音频条
  for (let i = 0; i < halfCount; ++i) {
    const smoothedHeight = smoothTransition(audioArray[i], previousAudioArray[i]);
    const height = audioCanvas.height * Math.min(smoothedHeight, 1);

    audioCanvasCtx.fillRect(
      (barWidth + barWidth) * i,
      audioCanvas.height - height,
      barWidth,
      height
    );

    // 保存更新后的平滑音量数据
    previousAudioArray[i] = smoothedHeight;
  }

  // 绘制右声道音频条
  for (let i = 0; i < halfCount; ++i) {
    const smoothedHeight = smoothTransition(audioArray[halfCount + i], previousAudioArray[halfCount + i]);
    const height = audioCanvas.height * Math.min(smoothedHeight, 1);

    audioCanvasCtx.fillRect(
      (barWidth + barWidth) * (i + halfCount),
      audioCanvas.height - height,
      barWidth,
      height
    );

    previousAudioArray[halfCount + i] = smoothedHeight;
  }
};

const drawCircularBars = (audioArray) => {
  const audioCanvas = audioCanvasRef.value;
  const centerX = audioCanvas.width / 2;
  const centerY = audioCanvas.height / 2;
  const outerRadius = Math.min(centerX, centerY) * 0.65; // 外环半径
  const totalBars = 128; // 音频条总数
  const angleIncrement = (Math.PI * 2) / totalBars; // 每个条的角度增量
  const barHeight = outerRadius * 0.3; // 每个条的最大高度

  // 清除画布
  audioCanvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
  audioCanvasCtx.fillStyle = props.lineColor;

  for (let i = 0; i < totalBars; i++) {
    const angle = angleIncrement * i; // 当前条的角度
    const smoothedHeight = smoothTransition(audioArray[i % (audioArray.length / 2)], previousAudioArray[i % (audioArray.length / 2)]);
    const currentHeight = barHeight * Math.min(smoothedHeight, 1); // 根据音频值调整条的高度

    // 计算条的宽度
    const barWidth = outerRadius * (Math.PI * 2 / totalBars) * 0.5; // 每个条的宽度

    // 计算条的起始和结束位置（向外）
    const startX = centerX + Math.cos(angle) * outerRadius; // 外侧起点
    const startY = centerY + Math.sin(angle) * outerRadius;
    const endX = centerX + Math.cos(angle) * (outerRadius + currentHeight); // 终点在外侧
    const endY = centerY + Math.sin(angle) * (outerRadius + currentHeight);

    // 绘制条
    audioCanvasCtx.beginPath();
    audioCanvasCtx.moveTo(startX, startY);
    audioCanvasCtx.lineTo(endX, endY);
    audioCanvasCtx.lineWidth = barWidth; // 使用计算出的条宽度
    audioCanvasCtx.strokeStyle = props.lineColor;
    audioCanvasCtx.stroke();

    // 更新平滑的音量数据
    previousAudioArray[i % (audioArray.length / 2)] = smoothedHeight;
  }
};

onMounted(() => {
  if (window.wallpaperRegisterAudioListener) {
    console.log('注册音频监听');
    window.wallpaperRegisterAudioListener(wallpaperAudioListener);
  } else {
    console.log('未注册音频监听');
  }
  initCanvas();
});
</script>

<template>
  <canvas ref="audioCanvasRef" class="mainCanvas"></canvas>
</template>

<style scoped>
.mainCanvas {
  position: absolute;
  margin: 0 auto;
  text-align: center;
  left: 0;
  right: 0;
  top: 10px;
}
</style>
