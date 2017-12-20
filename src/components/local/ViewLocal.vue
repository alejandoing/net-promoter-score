<template lang="pug">
	v-container(v-show="local" grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Local: {{ local.title }}
					hr
</template>

<script>
export default {
	data() {
		return {
			local: false
		}
	},
		created() {
			this.$firebase.firestore().doc('locals/' + this.$route.params.id).get()
			.then((doc) => {
				this.local = doc.data()
				console.log(doc.data())
			})
		}
}
</script>

<style lang="sass" scoped>

</style>