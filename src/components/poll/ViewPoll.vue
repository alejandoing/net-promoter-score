<template lang="pug">
	v-container(v-show="poll" grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Encuesta: {{ poll.question }}
					hr
</template>

<script>
export default {
	data() {
		return {
			poll: false
		}
	},
		created() {
			this.$firebase.firestore().doc('polls/' + this.$route.params.id).get()
			.then((doc) => {
				this.poll = doc.data()
				console.log(doc.data())
			})
		}
}
</script>

<style lang="sass" scoped>

</style>

