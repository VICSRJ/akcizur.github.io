<template>
  <section id="portfolio" class="portfolio" data-motion-section data-motion-sequence="PortfolioSweep">
    <div class="container" data-motion-preset="ParallaxCinematic" data-motion-id="portfolio-camera" data-motion-role="camera">
      <div class="section-label" data-motion="fade" data-motion-preset="FadeSoft" data-motion-id="portfolio-label">VYBRANÉ PROJEKTY</div>
      <h2 class="section-title" data-motion="slide-up" data-motion-preset="ZoomCinematic" data-motion-id="portfolio-title" data-motion-role="title">PORTFOLIO</h2>
      <div class="portfolio-grid">
        <div
          v-for="(item, index) in items"
          :key="item.number"
          class="portfolio-item"
          data-motion="scale"
          data-motion-preset="DepthCinematic"
          data-motion-role="card"
          :data-motion-id="`portfolio-card-${index + 1}`"
          :style="{ '--i': index }"
        >
          <div class="portfolio-bg" data-motion-preset="ScaleDeep" data-motion-role="surface"></div>
          <div class="portfolio-content" data-motion-preset="GlideFluid" data-motion-role="content">
            <div class="portfolio-number" data-motion-preset="FloatDeep" data-motion-role="index">{{ item.number }}</div>
            <h3 data-motion-preset="RiseCinematic" data-motion-role="heading">
              <span v-for="(line, lineIndex) in item.title.split('\n')" :key="`${item.number}-${lineIndex}`">
                {{ line }}<br v-if="lineIndex < item.title.split('\n').length - 1" />
              </span>
            </h3>
            <p data-motion-preset="FadeSmooth" data-motion-role="meta">{{ item.text }}</p>
            <span class="portfolio-rule" data-motion-preset="TraceMicro" data-motion-role="rule" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
