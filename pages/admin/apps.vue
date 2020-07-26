<template>
  <v-container fluid>
    <v-row class="pa-5">
      <v-btn nuxt to="/admin">Back</v-btn>
    </v-row>
    <v-row class="pa-5">
      <h2>Apps</h2>
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
    <v-row v-if="!$fetchState.pending" justify="center">
      <v-col v-for="(item, index) of apps" :key="index" color="indigo">
        <v-card width="250" class="mx-auto" tile>
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
            :value="
              item.assets.find((cias) => cias.file_name === item.app.name_file)
                .file_download
            "
            class="qrcode text-center ma-2"
            :size="200"
          />
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text color="indigo" @click="modifyApp(item.app.tid)">
              Modify
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-if="appSelect" v-model="modifyDialog">
      <v-card>
        <v-card-title class="headline"
          >{{ appSelect.app.name }}({{ appSelect.app.tid }})</v-card-title
        >
        <v-card-text
          >Description: {{ appSelect.app.description }}<br />Category:
          {{ appSelect.app.category }}<br />Author: {{ appSelect.app.author
          }}<br />Version: {{ appSelect.app.version }}<br />Github:
          {{ appSelect.app.github }}<br />Download file:
          {{ appSelect.app.name_file }}<br />Released at:
          {{
            new Date(appSelect.app.released_at)
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ')
          }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            :href="appSelect.app.github"
            target="_blank"
            color="indigo"
          >
            Github Repository
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="indigo" text @click="modifyDialog = false">Close</v-btn>
          <v-btn color="error" text @click="deleteApp()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" top right>
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    QrcodeVue,
  },
  middleware: 'auth',
  fetchOnServer: false,
  async fetch() {
    const appsResponse = await this.$axios.$get(
      this.$axios.defaults.baseURL + `/api/apps/all`
    )
    this.apps = appsResponse
  },
  data: () => ({
    apps: null,
    modifyDialog: false,
    appSelect: null,
    fileField: null,
    snackbar: false,
    snackbarColor: 'success',
    snackbarMessage: null,
  }),
  methods: {
    modifyApp(tid) {
      this.$axios
        .$get(this.$axios.defaults.baseURL + '/api/apps/tid/' + tid)
        .then((response) => {
          this.appSelect = response
          this.modifyDialog = true
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err.response.data.error)
          this.appSelect = null
          this.modifyDialog = false
        })
    },
    deleteApp() {
      this.$store
        .dispatch('deleteApp', {
          tid: this.appSelect.app.tid,
        })
        .then((response) => {
          this.$fetch()
          this.appSelect = null
          this.modifyDialog = false
          this.snackbar = true
          this.snackbarColor = 'success'
          this.snackbarMessage = 'Deleted'
        })
        .catch((err) => {
          this.snackbar = true
          this.snackbarColor = 'error'
          this.snackbarMessage =
            'An error has occurred: ' + err.response.data.error
        })
    },
  },
}
</script>
