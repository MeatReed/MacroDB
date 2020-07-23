<template>
  <v-container fluid>
    <v-row class="pa-5">
      <h2>Panel Admin</h2>
    </v-row>
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
    <v-row v-else justify="center">
      <v-col>
        <v-card color="indigo" dark nuxt to="/admin/apps">
          <v-card-title class="headline">Apps verified</v-card-title>

          <v-card-subtitle>{{ apps.length }}</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col>
        <v-card color="indigo" dark to="/admin/unverified">
          <v-card-title class="headline">Apps unverified</v-card-title>

          <v-card-subtitle>{{ appsUnverified.length }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async fetch() {
    const appsResponse = await this.$axios.$get(
      this.$axios.defaults.baseURL + `/api/apps/all`
    )
    this.apps = appsResponse
    const appsUnverifiedResponse = await this.$axios.$get(
      this.$axios.defaults.baseURL + `/api/apps/unverified`
    )
    this.appsUnverified = appsUnverifiedResponse
  },
  middleware: 'auth',
  data: () => ({
    apps: null,
    appsUnverified: null,
  }),
}
</script>
