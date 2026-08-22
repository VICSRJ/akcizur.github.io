<script setup>
defineProps({
  items: { type: Array, required: true },
})
</script>

<template>
  <section id="o-mne" class="about" data-motion-section>
    <div class="container" data-motion-preset="FocusCinematic">
      <div class="section-label" data-motion="fade" data-motion-preset="FadeSoft">FILOZOFIE</div>
      <h2 class="section-title" data-motion="slide-up" data-motion-preset="ClipCinematic">DESIGN JE O ŘEŠENÍ<br />PROBLÉMŮ PLYNULÉ INTERAKCE</h2>
      <div class="about-grid">
        <div
          v-for="(item, index) in items"
          :key="item.title"
          class="about-item"
          data-motion="lift"
          data-motion-preset="DepthFluid"
          :style="{ '--i': index }"
        >
          <div class="icon" data-motion-preset="FloatSoft">
            <img :src="item.icon" :alt="item.alt" width="40" height="40" />
          </div>
          <h3 data-motion-preset="RiseSmooth">{{ item.title }}</h3>
          <p data-motion-preset="FadeSoft">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
