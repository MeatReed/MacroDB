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
        <a href="https://github.com/MeatReed/MacroDB" target="_blank"
          >Github Repository</a
        >.
      </v-alert>
      <nuxt />
      <v-btn
        v-show="fab"
        v-scroll="onScroll"
        bottom
        color="indigo"
        dark
        fab
        fixed
        right
        @click="toTop"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
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
      fab: false,
    }
  },
  beforeCreate() {
    if (!this.$cookiz.get('dark')) {
      this.$cookiz.set('dark', false)
    }
    this.$vuetify.theme.dark = this.$cookiz.get('dark')
  },
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    },
  },
}
</script>
<style>
.qrcode canvas {
  border: 20px solid #ffffff;
}

.v-card__subtitle {
  padding-top: 0px;
}

.v-card__title {
  padding-bottom: 0px;
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
