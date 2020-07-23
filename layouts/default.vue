<template>
  <v-app>
    <Header id="navigation-desktop" />
    <header-mobile id="navigation-mobile" />
    <v-main>
      <nuxt />
    </v-main>
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
