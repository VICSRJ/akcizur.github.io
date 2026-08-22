<script setup>
defineProps({
  items: { type: Array, required: true },
})
</script>

<template>
  <section id="portfolio" class="portfolio" data-motion-section>
    <div class="container" data-motion-preset="ParallaxCinematic">
      <div class="section-label" data-motion="fade" data-motion-preset="FadeSoft">VYBRANÉ PROJEKTY</div>
      <h2 class="section-title" data-motion="slide-up" data-motion-preset="ZoomCinematic">PORTFOLIO</h2>
      <div class="portfolio-grid">
        <div
          v-for="(item, index) in items"
          :key="item.number"
          class="portfolio-item"
          data-motion="scale"
          data-motion-preset="DepthCinematic"
          :style="{ '--i': index }"
        >
          <div class="portfolio-bg" data-motion-preset="ScaleDeep"></div>
          <div class="portfolio-content" data-motion-preset="GlideFluid">
            <div class="portfolio-number" data-motion-preset="FloatDeep">{{ item.number }}</div>
            <h3 data-motion-preset="RiseCinematic">
              <span v-for="(line, lineIndex) in item.title.split('\n')" :key="`${item.number}-${lineIndex}`">
                {{ line }}<br v-if="lineIndex < item.title.split('\n').length - 1" />
              </span>
            </h3>
            <p data-motion-preset="FadeSmooth">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
