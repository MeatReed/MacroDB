<template>
  <v-container fluid>
    <v-row class="pa-5">
      <v-btn nuxt to="/admin">Back</v-btn>
    </v-row>
    <v-row class="pa-5">
      <h2>Unverified apps</h2>
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
      <v-col v-for="(item, index) of apps" :key="index" color="indigo">
        <v-card class="mx-auto" tile>
          <v-card-title>
            {{ item.name }}
          </v-card-title>
          <div>
            <v-card-subtitle
              >Description: {{ item.description ? item.description : 'none'
              }}<br />TID: {{ item.tid ? item.tid : 'unknown' }}
            </v-card-subtitle>
          </div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text color="indigo" @click="verifyApp(item.tid)">
              Verify
            </v-btn>
            <v-btn text :href="item.github" target="_blank" color="indigo">
              Github Repository
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-if="appVerify" v-model="verifyDialog" persistent>
      <v-card>
        <v-card-title class="headline"
          >{{ appVerify.db.name }}({{ appVerify.db.tid }})</v-card-title
        >
        <v-card-text
          >Description: {{ appVerify.db.description }}<br />Category:
          {{ appVerify.db.category }}
          <v-select
            v-model="fileField"
            :items="appVerify.github.assets"
            return-object
            item-text="name"
            item-value="name"
            label="Name File*"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            :href="appVerify.db.github"
            target="_blank"
            color="indigo"
          >
            Github Repository
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteApp()">Delete</v-btn>
          <v-btn color="success" text @click="acceptApp()">Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" top right>
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  async fetch() {
    const appsResponse = await this.$axios.$get(
      this.$axios.defaults.baseURL + `/api/apps/unverified`
    )
    this.apps = appsResponse
  },
  data: () => ({
    apps: null,
    verifyDialog: false,
    appVerify: null,
    fileField: null,
    snackbar: false,
    snackbarColor: 'success',
    snackbarMessage: null,
  }),
  methods: {
    verifyApp(tid) {
      this.$axios
        .$post(this.$axios.defaults.baseURL + '/api/apps/verify', {
          tid,
        })
        .then((response) => {
          this.appVerify = response
          this.verifyDialog = true
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err.response.data.error)
          this.appVerify = null
          this.verifyDialog = false
        })
    },
    acceptApp() {
      if (!this.fileField) {
        this.snackbar = true
        this.snackbarColor = 'error'
        this.snackbarMessage = 'Choose file name'
        return
      }
      this.$store
        .dispatch('acceptUnverifiedApp', {
          name: this.appVerify.db.name,
          tid: this.appVerify.db.tid,
          description: this.appVerify.db.description,
          author: this.appVerify.github.author.login,
          version: this.appVerify.github.tag_name,
          github: this.appVerify.db.github,
          category: this.appVerify.db.category,
          released_at: new Date(this.fileField.created_at)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '),
          name_file: this.fileField.name,
          assets: this.appVerify.github.assets,
        })
        .then((response) => {
          this.$fetch()
          this.appVerify = null
          this.verifyDialog = false
          this.snackbar = true
          this.snackbarColor = 'success'
          this.snackbarMessage = 'Accept'
        })
        .catch((err) => {
          this.snackbar = true
          this.snackbarColor = 'error'
          this.snackbarMessage =
            'An error has occurred: ' + err.response.data.error
        })
    },
    deleteApp() {
      this.$store
        .dispatch('deleteUnverifiedApp', {
          tid: this.appVerify.db.tid,
        })
        .then((response) => {
          this.$fetch()
          this.appVerify = null
          this.verifyDialog = false
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
