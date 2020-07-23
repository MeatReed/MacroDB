<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="headline">Register</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="errorRegisterAlert" type="error">
            {{ errorRegisterAlert }}
          </v-alert>
          <v-form ref="formRegister" v-model="validRegister">
            <v-text-field
              v-model="emailRegister"
              :rules="emailRules"
              label="Email*"
              required
            ></v-text-field>
            <v-text-field
              v-model="passwordRegister"
              :rules="passwordRules"
              label="Password*"
              required
              type="password"
            ></v-text-field>
            <v-text-field
              v-model="passwordConfirmRegister"
              :rules="passwordConfirmRules"
              label="Password Confirmation*"
              required
              type="password"
            ></v-text-field>
          </v-form>
        </v-container>
        <small>*Required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo" text @click="validateRegister">Register</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: 'isAuth',
  data() {
    return {
      dialogRegister: false,
      errorCodeAlert: null,
      errorRegisterAlert: '',
      validRegister: true,
      emailRegister: '',
      usernameRegister: '',
      passwordRegister: '',
      passwordConfirmRegister: '',
    }
  },
  computed: {
    passwordRules() {
      const rules = []
      const passwordLength = (v) =>
        (v && v.length >= 3) ||
        'The password must be at least 3 characters long!'
      const requiert = (v) => !!v || 'Required password!'
      rules.push(passwordLength)
      rules.push(requiert)
      return rules
    },
    emailRules() {
      const rules = []
      const emailValid = (v) =>
        /.+@.+\..+/.test(v) || 'The email must be valid!'
      const requiert = (v) => !!v || 'Required email!'
      rules.push(emailValid)
      rules.push(requiert)
      return rules
    },
    passwordConfirmRules() {
      const rules = []
      const passwordConfirm = (v) =>
        (!!v && v) === this.passwordRegister ||
        'Confirmation password does not match!'
      const requiert = (v) => !!v || 'Required Password Confirmation'
      rules.push(passwordConfirm)
      rules.push(requiert)
      return rules
    },
  },
  methods: {
    validateRegister() {
      if (this.$refs.formRegister.validate()) {
        this.$store
          .dispatch('register', {
            username: this.usernameRegister,
            email: this.emailRegister,
            password: this.passwordRegister,
            gender: this.genderRegister,
          })
          .then((response) => {
            this.$router.push('/admin')
          })
          .catch((err) => {
            this.errorRegisterAlert = err.response.data.error
          })
      }
    },
  },
}
</script>
