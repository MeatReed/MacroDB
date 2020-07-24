<template>
  <v-app>
    <Header id="navigation-desktop" />
    <header-mobile id="navigation-mobile" />
    <v-main>
      <v-alert type="info" class="ma-2">
        This is a community-maintained database of some of the most common and
        useful apps and tools for a hacked Nintendo 3DS family system. Trusted
        applications are automatically scanned for new releases every hour. If
        you have any questions or feature requests please open an issue on our
        <a href="https://github.com/MeatReed/TinyDB" target="_blank"
          >Github Repository</a
        >.
      </v-alert>
      <nuxt />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
    }
  },
}
</script>
<style>
.qrcode canvas {
  border: 15px solid #ffffff;
}

#navigation-desktop {
  display: block;
}
#navigation-mobile {
  display: none;
}
@media (max-width: 800px) {
  #navigation-desktop {
    display: none;
  }
  #navigation-mobile {
    display: block;
  }
}
</style>
