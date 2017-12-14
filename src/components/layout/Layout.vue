<template lang="pug">
	div
		header-app
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