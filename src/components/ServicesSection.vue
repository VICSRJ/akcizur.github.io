<script setup>
defineProps({
  items: { type: Array, required: true },
})
</script>

<template>
  <section id="sluzby" class="services" data-motion-section data-motion-sequence="ServicesRhythm">
    <div class="container" data-motion-preset="TrackCinematic">
      <div class="section-label" data-motion="fade" data-motion-preset="FadeMicro">CO NABÍZÍM</div>
      <h2 class="section-title" data-motion="slide-up" data-motion-preset="SplitWide">SLUŽBY</h2>
      <div class="services-list">
        <div
          v-for="(item, index) in items"
          :key="item.number"
          class="service-item"
          data-motion="slide-left"
          data-motion-preset="TrackFluid"
          :style="{ '--i': index }"
        >
          <div class="service-number" data-motion-preset="DepthMicro">{{ item.number }}</div>
          <h3 data-motion-preset="SlideLeftCinematic">{{ item.title }}</h3>
          <p data-motion-preset="FadeSmooth">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
