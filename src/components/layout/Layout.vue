<template lang="pug">
	div
		header-app
		v-content.py-4
			router-view
</template>

<script>
	import HeaderApp from  '@/components/layout/HeaderApp'
  export default {
		name: 'Layout',
		components: {
			HeaderApp
		}
  }
</script>