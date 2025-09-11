<template>
  <div class="app-root" :style="bgStyle">
    <div class="overlay"></div>

    <div class="content">
      <!-- Title animation -->
      <transition name="fade-zoom">
        <h1 v-if="showTitle" class="site-title">
          MOVIES
        </h1>
      </transition>

      <!-- Movie gallery -->
      <div class="movie-grid">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="movie-card"
          :style="{ animationDelay: (index * 200) + 'ms' }"
        >
          <img
            v-if="item.image"
            :src="item.image"
            alt="poster"
            class="movie-img"
          />
          <p class="movie-title">{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const items = ref([]);
const error = ref(false);
const showTitle = ref(false);

const bgFilename = "39bddc50eaf3f45f6e19c1058c838396.jpg";
const bgUrl = `http://localhost:3000/images/${bgFilename}`;

const bgStyle = computed(() => ({
  backgroundImage: `url('${bgUrl}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
}));

onMounted(async () => {
  setTimeout(() => (showTitle.value = true), 200);
  try {
    const res = await fetch("http://localhost:3000/api/items");
    items.value = await res.json();
  } catch (err) {
    console.error("Error fetching items:", err);
    error.value = true;
  }
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.app-root {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Lustria", serif;
  position: relative;
  background-color: #000;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0,0,0,0.45);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.site-title {
  font-weight: 800;
  margin-bottom: 32px;
  font-size: 80px;
  color: #ffffff !important;
}

/* ✅ 3x3 grid */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  width: 100%;
  max-width: 1200px;
  justify-items: center;
}

.movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  /* ✅ Start hidden and animate in */
  opacity: 0;
  transform: scale(0.9);
  animation: fadeZoomIn 0.8s ease forwards;
}

@keyframes fadeZoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.movie-img {
  width: 180px;
  height: 260px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 6px 14px rgba(0,0,0,0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.movie-img:hover {
  transform: scale(1.08);
  box-shadow: 0 10px 20px rgba(0,0,0,0.8);
}

.movie-title {
  margin-top: 14px;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff !important;
}

/* Title fade animation */
.fade-zoom-enter-active {
  transition: all 0.8s ease;
}
.fade-zoom-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.fade-zoom-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
