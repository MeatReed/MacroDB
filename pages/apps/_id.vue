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
      <v-col>
        <v-card tile>
          <v-card-title>
            Change the QRCode
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="modelQRCodeLevel"
              label="QRCode Level"
              :items="itemsQRCode"
              dense
              outlined
            />
            <v-slider
              v-model="QRCodeSize"
              min="100"
              max="500"
              label="QRCode Size"
            />
            <qrcode-vue
              :value="app.download"
              class="qrcode text-center ma-2"
              :size="QRCodeSize"
              :level="modelQRCodeLevel"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title class="headline"
            >{{ app.name }}({{ app.tid }})</v-card-title
          >
          <v-card-text
            >Description: {{ app.description }}<br />Category: {{ app.category
            }}<br />Author: {{ app.author }}<br />Version: {{ app.version
            }}<br />Github: {{ app.github }}<br />Download: {{ app.download
            }}<br />Released at:
            {{
              new Date(app.released_at)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ')
            }}
          </v-card-text>
          <v-card-actions>
            <v-btn text :href="app.github" target="_blank" color="indigo">
              Github Repository
            </v-btn>
            <v-btn text :href="app.download" color="indigo">
              Download
            </v-btn>
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
  async fetch() {
    const appResponse = await this.$axios.$get(
      this.$axios.defaults.baseURL + `/api/apps/id/${this.$route.params.id}`
    )
    this.app = appResponse
  },
  data: () => ({
    app: null,
    itemsQRCode: ['L', 'M', 'Q', 'H'],
    modelQRCodeLevel: 'M',
    QRCodeSize: 300,
  }),
}
</script>
