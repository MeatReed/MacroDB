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
      <h2>Tools({{ apps.length }})</h2>
    </v-row>
    <v-row v-if="!$fetchState.pending" justify="center">
      <v-col v-for="(item, index) of apps" :key="index" color="indigo">
        <v-card
          width="250"
          class="mx-auto"
          tile
          nuxt
          :to="'/apps/' + item.app.id"
        >
          <v-card-title>
            {{ item.app.name }}
          </v-card-title>
          <div>
            <v-card-subtitle
              >Description:
              {{ item.app.description ? item.app.description : 'none'
              }}<br />TID: {{ item.app.tid ? item.app.tid : 'unknown'
              }}<br />Last Updated:
              {{
                item.app.released_at
                  ? new Date(item.app.released_at)
                      .toISOString()
                      .slice(0, 19)
                      .replace('T', ' ')
                  : 'unknown'
              }}
            </v-card-subtitle>
          </div>
          <v-divider></v-divider>
          <qrcode-vue
            v-if="
              item.assets.find((cias) => cias.file_name === item.app.name_file)
            "
            :value="
              item.assets.find((cias) => cias.file_name === item.app.name_file)
                .file_download
            "
            class="qrcode text-center ma-2"
            :size="200"
          />
          <v-divider></v-divider>
          <v-card-actions>
            <v-chip> Latest: {{ item.app.version }} </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue,
  },
  fetchOnServer: false,
  async fetch() {
    const appsResponse = await this.$axios.$get(
      this.$axios.defaults.baseURL + `/api/apps/category/tools`
    )
    this.apps = appsResponse
  },
  data: () => ({
    apps: null,
  }),
}
</script>
