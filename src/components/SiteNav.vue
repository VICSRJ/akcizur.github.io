<template>
  <nav id="nav" data-motion-nav>
    <div class="nav-container">
      <a href="#top" class="logo" aria-label="Přejít na začátek" data-motion-preset="MagneticMicro" data-motion-id="nav-logo" data-motion-role="brand">
        <img src="/img/logo.svg" alt="RJ Logo" width="32" height="32" />
      </a>

      <button
        class="menu-toggle"
        id="menuToggle"
        :class="{ active: isOpen }"
        aria-label="Otevřít menu"
        :aria-expanded="isOpen ? 'true' : 'false'"
        data-motion-preset="SnapMicro"
        data-motion-id="nav-menu-toggle"
        data-motion-role="control"
        @click="$emit('toggle-menu')"
      >
        <span></span><span></span><span></span>
      </button>

      <ul class="nav-links" id="navLinks" :class="{ active: isOpen }" data-motion-sequence="NavigationCascade">
        <li v-for="(link, index) in links" :key="link.href" :style="{ '--nav-i': index }">
          <a
            :href="link.href"
            data-motion-preset="GlideMicro"
            data-motion-role="nav-link"
            :data-motion-id="`nav-link-${index + 1}`"
            @click="$emit('navigate')"
          >{{ link.label }}</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  links: { type: Array, required: true },
  isOpen: { type: Boolean, default: false },
})

defineEmits(['toggle-menu', 'navigate'])
</script>
