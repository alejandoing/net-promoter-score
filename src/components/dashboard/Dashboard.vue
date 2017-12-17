<template lang="pug">
	v-content.py-4
		v-container(grid-list-md text-md-center)
			item
</template>

<script>
	import Item from  '@/components/dashboard/Item'
	export default {
		name: 'Dashboard',
		components: {
			Item
		}
	}
</script>