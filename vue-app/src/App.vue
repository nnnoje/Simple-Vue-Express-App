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
          <!-- Poster -->
          <img
            v-if="item.image"
            :src="item.image"
            alt="poster"
            class="movie-img"
          />

          <!-- Title -->
          <p class="movie-title">{{ item.name }}</p>

          <!-- Star Rating -->
          <div class="star-rating">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= (item.rating || 0) }"
              @click="setRating(item.id, star)"
            >★</span>
          </div>

          <!-- Reviews section -->
          <div class="reviews-box">
            <h3>Reviews</h3>
            <div class="review-form">
              <input
                v-model="newReviews[item.id]"
                type="text"
                placeholder="Write a review..."
                class="review-input"
              />
              <button class="btn submit" @click="addReview(item.id)">Submit</button>
            </div>
            <ul class="review-list">
              <li
                v-for="(review, idx) in item.reviews || []"
                :key="idx"
                class="review-item"
              >
                <span class="review-text">{{ review }}</span>
                <button class="btn danger" @click="deleteReview(item.id, idx)">×</button>
              </li>
            </ul>
          </div>
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
const newReviews = ref({});

// background image
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

async function addReview(movieId) {
  if (!newReviews.value[movieId]) return;
  
  try {
    const response = await fetch(`http://localhost:3000/api/items/${movieId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review: newReviews.value[movieId]
      })
    });
    
    if (response.ok) {
      const updatedMovie = await response.json();
      // Update local state with server data
      const movieIndex = items.value.findIndex(item => item.id === movieId);
      if (movieIndex !== -1) {
        items.value[movieIndex] = updatedMovie;
      }
      newReviews.value[movieId] = "";
    }
  } catch (error) {
    console.error('Error adding review:', error);
  }
}

async function deleteReview(movieId, idx) {
  try {
    const response = await fetch(`http://localhost:3000/api/items/${movieId}/reviews/${idx}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      const updatedMovie = await response.json();
      // Update local state with server data
      const movieIndex = items.value.findIndex(item => item.id === movieId);
      if (movieIndex !== -1) {
        items.value[movieIndex] = updatedMovie;
      }
    }
  } catch (error) {
    console.error('Error deleting review:', error);
  }
}

async function setRating(movieId, star) {
  try {
    const response = await fetch(`http://localhost:3000/api/items/${movieId}/rating`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: star
      })
    });
    
    if (response.ok) {
      const updatedMovie = await response.json();
      // Update local state with server data
      const movieIndex = items.value.findIndex(item => item.id === movieId);
      if (movieIndex !== -1) {
        items.value[movieIndex] = updatedMovie;
      }
    }
  } catch (error) {
    console.error('Error setting rating:', error);
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.app-root {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: "Lustria", serif;
  position: relative;
  background-color: #000;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60px;
}

.site-title {
  font-weight: 800;
  margin-bottom: 32px;
  font-size: 80px;
  color: #ffffff !important;
}

/* Movie grid - fixed layout */
.movie-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.movie-card {
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  width: 220px; /* fixed width */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  animation: fadeZoomIn 0.8s ease forwards;
  opacity: 0;
  transform: scale(0.9);
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
  width: 100%;
  height: 320px; /* fixed poster size */
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.movie-img:hover {
  transform: scale(1.08);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.8);
}

.movie-title {
  margin-top: 12px;
  font-size: 22px;
  font-weight: 600;
  color: #ffffff !important;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
}

/* Star rating */
.star-rating {
  margin: 8px 0 0 0;
  display: flex;
  justify-content: center;
  gap: 2px;
}
.star {
  font-size: 22px;
  color: #777;
  cursor: pointer;
  transition: color 0.2s ease;
}
.star.filled {
  color: gold;
}
.star:hover {
  color: orange;
}

/* Reviews section */
.reviews-box {
  margin-top: 8px;
  padding: 12px;
  background: #2c2c2c;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.reviews-box h3 {
  font-size: 16px;
  margin: 0 0 10px 0;
  color: #ffffff;
  font-family: "Lustria", serif;
  text-align: center;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  align-items: stretch;
}

.review-input {
  padding: 8px 10px;
  border-radius: 6px;
  border: none;
  font-family: "Lustria", serif;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

/* Submit button */
.btn.submit {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: white;
  font-family: "Lustria", serif;
  font-size: 14px;
  transition: background 0.3s ease, transform 0.2s ease;
  align-self: center;
  width: fit-content;
  min-width: 80px;
}
.btn.submit:hover {
  background: #666;
  transform: scale(1.05);
}

/* Delete button */
.btn.danger {
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  font-size: 14px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  flex-shrink: 0;
}
.btn.danger:hover {
  background: #f44336;
}

.review-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.review-item {
  display: flex;
  align-items: flex-start;
  background: #3a3a3a;
  color: #ffffff;
  font-family: "Lustria", serif;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  gap: 8px;
  min-height: 24px;
}

.review-text {
  flex: 1;
  line-height: 1.4;
  word-wrap: break-word;
  text-align: left;
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