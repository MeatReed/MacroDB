<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="headline">Login</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="errorLoginAlert" type="error">
            {{ errorLoginAlert }}
          </v-alert>
          <v-form ref="formLogin" v-model="validLogin">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="emailLogin"
                  :rules="emailRules"
                  label="Email*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="passwordLogin"
                  :rules="passwordRules"
                  label="Password*"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <small>*Required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo" text @click="validateLogin">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: 'isAuth',
  data() {
    return {
      dialogLogin: false,
      errorLoginAlert: '',
      validLogin: true,
      emailLogin: '',
      passwordLogin: '',
      emailRules: [
        (v) => !!v || 'Required email',
        (v) => /.+@.+\..+/.test(v) || 'The email must be valid!',
      ],
      passwordRules: [(v) => !!v || 'Required password'],
    }
  },
  methods: {
    validateLogin() {
      if (this.$refs.formLogin.validate()) {
        this.$store
          .dispatch('login', {
            email: this.emailLogin,
            password: this.passwordLogin,
          })
          .then((response) => {
            this.$router.push('/admin')
          })
          .catch((err) => {
            this.errorLoginAlert = err.response.data.error
          })
      }
    },
  },
}
</script>
