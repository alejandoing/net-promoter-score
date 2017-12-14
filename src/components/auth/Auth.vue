<template lang="pug">
	v-app.app
		v-content.container
			p.display-4.text-xs-center NPS ADMIN
			form.text-xs-center
				v-text-field(
					label="E-mail"
					v-model="email"
					:error-messages="emailErrors"
					@input="$v.email.$touch()"
					@blur="$v.email.$touch()"
					required
				)
				v-text-field(
					label="Contraseña"
					v-model="password"
					:error-messages="passwordErrors"
					@input="$v.password.$touch()"
					@blur="$v.password.$touch()"
					required
				)
				v-btn(block color="primary" @click="submit") Iniciar Sesión
</template>

<script>
	import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
	export default {
		name: 'Auth',
    mixins: [validationMixin],
    validations: {
      email: { required, email },
      password: { required },
    },
    data () {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
      }
    },
    computed: {
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('El email es inválido')
        !this.$v.email.required && errors.push('El email es obligatorio')
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push('La contraseña es obligatoria')
        return errors
      }
    }
  }
</script>

<style lang="sass" scoped>
	*
		overflow-y: hidden !important

	.app
		background: url('../../../static/background-auth.png') center fixed no-repeat
		.container
			padding: 100px 150px 50px 150px
			p
				font-family: 'Arial'
</style>