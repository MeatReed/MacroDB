<template>
  <v-container>
    <v-row>
      <v-col>
        <v-alert v-if="alertMessage" :type="alertType">
          {{ alertMessage }}
        </v-alert>
        <v-card>
          <v-card-title>
            <span class="headline">Submit</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form ref="formSubmitApp" v-model="validForm">
                <v-text-field
                  v-model="nameField"
                  label="Name*"
                  :rules="requiertRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="tidField"
                  label="TID(Title ID)*"
                  :rules="tidRules"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="descriptionField"
                  label="Short description*"
                  :rules="requiertRules"
                  required
                ></v-textarea>
                <v-text-field
                  v-model="githubField"
                  label="Github link*"
                  :rules="githubRules"
                  required
                ></v-text-field>
                <v-select
                  v-if="!$fetchState.pending"
                  v-model="categoryField"
                  :items="categories"
                  :rules="requiertRules"
                  return-object
                  item-text="title"
                  item-value="name"
                  label="Category*"
                ></v-select>
              </v-form>
            </v-container>
            <small>*required field</small>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="indigo" @click="submitApp">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :color="snackbarColor" top right>
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  async fetch() {
    const categoriesResponse = await this.$axios.$get(
      this.$axios.defaults.baseURL + `/api/apps/categories`
    )
    this.categories = categoriesResponse
  },
  data: () => ({
    validForm: true,
    categories: null,
    nameField: null,
    tidField: null,
    descriptionField: null,
    githubField: null,
    categoryField: null,
    alertMessage: null,
    alertType: null,
    snackbar: false,
    snackbarColor: 'success',
    snackbarMessage: null,
  }),
  computed: {
    requiertRules() {
      const rules = []
      const requiert = (v) => !!v || 'Required field !'
      rules.push(requiert)
      return rules
    },
    tidRules() {
      const rules = []
      const tidLength = (v) =>
        (v && v.length === 16) || 'The title ID must contain 16 characters'
      const requiert = (v) => !!v || 'Required field !'
      rules.push(tidLength)
      rules.push(requiert)
      return rules
    },
    githubRules() {
      const rules = []
      // eslint-disable-next-line prettier/prettier
      const urlregex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/)
      const isURL = (v) =>
        (v && v.match(urlregex)) || "Github field isn't a link!"
      const requiert = (v) => !!v || 'Required field !'
      rules.push(isURL)
      rules.push(requiert)
      return rules
    },
  },
  methods: {
    submitApp() {
      if (this.$refs.formSubmitApp.validate()) {
        this.$store
          .dispatch('submitApp', {
            name: this.nameField,
            tid: this.tidField,
            description: this.descriptionField,
            github: this.githubField,
            category: this.categoryField.name,
          })
          .then((response) => {
            this.alertType = 'success'
            this.alertMessage = 'Your application has been submitted.'
            this.snackbar = true
            this.snackbarColor = 'success'
            this.snackbarMessage = 'Your application has been submitted.'
          })
          .catch((error) => {
            this.alertType = 'error'
            this.alertMessage = error.response.data.error
          })
      }
    },
  },
}
</script>
