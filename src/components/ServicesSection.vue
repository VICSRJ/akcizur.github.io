<template>
  <section id="sluzby" class="services" data-motion-section data-motion-sequence="ServicesRhythm">
    <div class="container" data-motion-preset="TrackCinematic" data-motion-id="services-camera" data-motion-role="camera">
      <div class="section-label" data-motion="fade" data-motion-preset="FadeMicro" data-motion-id="services-label">CO NABÍZÍM</div>
      <h2 class="section-title" data-motion="slide-up" data-motion-preset="SplitWide" data-motion-id="services-title" data-motion-role="title">SLUŽBY</h2>
      <div class="services-list">
        <div
          v-for="(item, index) in items"
          :key="item.number"
          class="service-item"
          data-motion="slide-left"
          data-motion-preset="TrackFluid"
          data-motion-role="row"
          :data-motion-id="`service-${index + 1}`"
          :style="{ '--i': index }"
        >
          <div class="service-number" data-motion-preset="DepthMicro" data-motion-role="index">{{ item.number }}</div>
          <h3 data-motion-preset="SlideLeftCinematic" data-motion-role="heading">{{ item.title }}</h3>
          <p data-motion-preset="FadeSmooth" data-motion-role="body">{{ item.text }}</p>
          <span class="service-rule" data-motion-preset="TraceMicro" data-motion-role="rule" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  </section>
</template>
