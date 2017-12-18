<template lang="pug">
	v-container(grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Nuevo Local
					hr
			v-flex(xs12 md6)
				v-text-field(
					label="Título"
					v-model.trim="title"
					required
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegir una Provincia"
					v-model="province"
					:items="items"
					required
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegir un Contexto"
					v-model="context"
					:items="items"
					required
				)
			v-flex(xs12 md6)
				v-text-field#background.hidden(type="file" @change.native="writeFile($event)")
				v-btn#uploadFile(block color="primary" @click="uploadClick") Elegir background
		v-layout(row child-flex justify-center align-center wrap)
			v-flex.py-5(fill-height xs12 offset-xs5)
				v-btn#submit(large outline :loading="loading" @click.native="createPoll" color="primary") CREAR ENCUESTA
					span.custom-loader(slot="loader")
						v-icon(light) cached
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text La encuesta se ha registrado correctamente
				v-card-actions
					v-spacer
					router-link(:to="'/polls/' + poll")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ver Encuesta
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ir al Dashboard
</template>

<script>
export default {
  
}
</script>


<style lang="sass" scoped>

</style>

