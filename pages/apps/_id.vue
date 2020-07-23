<template>
  <v-container fluid>
    <v-row v-if="$fetchState.pending">
      <v-col class="text-center">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          color="indigo"
        />
      </v-col>
    </v-row>
    <v-row v-if="!$fetchState.pending" class="pa-5">
      <h2>{{ app.name }}</h2>
    </v-row>
    <v-row v-if="!$fetchState.pending" justify="center">
      <qrcode-vue
        :value="app.download"
        class="qrcode text-center"
        :size="500"
      />
    </v-row>
  </v-container>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue,
  },
  async fetch() {
    const appResponse = await this.$axios.$get(
      this.$axios.defaults.baseURL + `/api/apps/id/${this.$route.params.id}`
    )
    this.app = appResponse
  },
  data: () => ({
    app: null,
  }),
}
</script>

<style scoped>
.v-card__subtitle {
  padding-top: 0px;
}

.v-card__title {
  padding-bottom: 0px;
}
</style>
