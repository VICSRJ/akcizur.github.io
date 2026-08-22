<template>
  <section id="o-mne" class="about" data-motion-section data-motion-sequence="EditorialCurtain">
    <div class="container" data-motion-preset="FocusCinematic" data-motion-id="about-camera" data-motion-role="camera">
      <div class="section-label" data-motion="fade" data-motion-preset="FadeSoft" data-motion-id="about-label">FILOZOFIE</div>
      <h2 class="section-title" data-motion="slide-up" data-motion-preset="ClipCinematic" data-motion-id="about-title" data-motion-role="title">DESIGN JE O ŘEŠENÍ<br />PROBLÉMŮ PLYNULÉ INTERAKCE</h2>
      <div class="about-grid">
        <div
          v-for="(item, index) in items"
          :key="item.title"
          class="about-item"
          data-motion="lift"
          data-motion-preset="DepthFluid"
          data-motion-role="card"
          :data-motion-id="`about-card-${index + 1}`"
          :style="{ '--i': index }"
        >
          <div class="icon" data-motion-preset="FloatSoft" data-motion-role="icon">
            <img :src="item.icon" :alt="item.alt" width="40" height="40" />
          </div>
          <h3 data-motion-preset="RiseSmooth" data-motion-role="heading">{{ item.title }}</h3>
          <p data-motion-preset="FadeSoft" data-motion-role="body">{{ item.text }}</p>
          <span class="about-rule" data-motion-preset="TraceMicro" data-motion-role="rule" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  </section>
</template>
