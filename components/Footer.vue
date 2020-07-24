<template>
  <v-footer padless absolute app>
    <v-card flat tile width="100%" class="indigo text-center">
      <v-card-text>
        <v-btn to="/" nuxt class="mx-4" icon>
          <v-icon size="24px">mdi-home</v-icon>
        </v-btn>
        <v-btn
          href="https://github.com/MeatReed/TinyDB"
          target="_blank"
          class="mx-4"
          icon
        >
          <v-icon size="24px">mdi-github</v-icon>
        </v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>MeatReed</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>
