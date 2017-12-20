<template lang="pug">
	v-layout(row wrap)
		v-flex(md4 xs4 v-for="option in options[user]" :key="option.src")
			router-link(:to="option.route")
				img(:src="option.src")
</template>

<script>
	export default {
		name: 'Dashboard',
		data() {
			return {
				user: 'administrador',
				options: {
					administrador: [
						{ src: 'static/dashboard/new-poll.png', route: '/polls/new/' },
						{ src: 'static/dashboard/new-local.png', route: '/locals/new/' },
						{ src: 'static/dashboard/my-locals.png', route: '/locals/new/' },
						{ src: 'static/dashboard/my-polls.png', route: '/polls/' },
						{ src: 'static/dashboard/settings.png', route: '/settings/' },
						{ src: 'static/dashboard/back-to-home.png', route: '/locals/new/' }
					],
					employee: [
						{ src: 'static/dashboard/new-poll.png', route: '/polls/new/' },
						{ src: 'static/dashboard/new-local.png', route: '/locals/new/' },
						{ src: 'static/dashboard/my-locals.png' }					
					]
				}
			}
		}
	}
</script>

<style lang="sass" scoped>
	$radius-image: 0px 1px 6px 1px rgba(0,0,0,0.75)
	$size-image: 350px
	$size-image-big: 500px
	
	img
		-webkit-box-shadow: $radius-image
		-moz-box-shadow: $radius-image
		box-shadow: $radius-image
		margin-bottom: 30px
		height: $size-image
		width: $size-image
		cursor: pointer
		&:hover
			filter: gray
			-webkit-filter: grayscale(1)
	
	.flex.md4,.flex.sm4
		max-width: 100%
	
	@media (min-width: 1900px)
		img
			width: $size-image-big
			height: $size-image-big
</style>