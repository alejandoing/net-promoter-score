<template lang="pug">
	v-container(grid-list-md text-md-center)
		item
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Advertencia!
				v-card-text
					p Un contexto es un espacio dentro del local que sirve como referencia para las encuestas.
					p Hemos observado que no tiene contextos registrados para su organización. Le recomendamos crear diferentes contextos para poder registrar encuestas.
				v-card-actions
					v-spacer
					router-link(:to="'/settings'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Registrar Contextos
</template>

<script>
	import Item from  '@/components/dashboard/Item'
	export default {
		name: 'Dashboard',
		components: {
			Item
		},
		data() {
			return {
				contexts: [],
				dialog: false,
				userStorage: JSON.parse(localStorage.getItem('user')),
			}
		},
		created() {
		//	if (JSON.parse(localStorage.getItem('totalAssessments'))) {
				this.$firebase.firestore().doc('business/' + this.userStorage.business)
				.onSnapshot(doc => {
					this.contexts.push(doc.data().contexts)
					if (!this.contexts[0].length) this.dialog = true
				})
			//} else location.reload()

		// 	this.$firebase.firestore().collection("assessments").where('local', '==', 'PSSLifj164EnEEGMGlSp').get().then(querySnapshot => {
		// 		querySnapshot.forEach(doc => {
		// 			console.log(doc.id, " => ", doc.data());
		// 				var currentRef = this.$firebase.firestore().collection("assessments").doc(doc.id)

		// 				return currentRef.update({
		// 					zone: '9O2CXPk2PFzaNV2JBpRL'
		// 				})
		// 				.then(function() {
		// 						console.log("Document successfully updated!" + doc.id);
		// 				})
		// 				.catch(function(error) {
		// 					console.error("Error updating document: ", error);
		// 				});
		// 		});
		// 	});
		}
	}
</script>

<style lang="sass" scoped>
	a
		text-decoration: none
</style>