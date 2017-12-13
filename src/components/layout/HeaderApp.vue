<template>
	<v-toolbar fixed app dark color="primary">
		<v-toolbar-title v-text='title'></v-toolbar-title>
		<v-spacer></v-spacer>
		<v-toolbar-items>
			<v-btn flat> Dashboard
				<v-icon class="pl-2">dashboard</v-icon>
			</v-btn>
			<v-btn flat> Resultados
				<v-icon class="pl-2">pie_chart</v-icon>
			</v-btn>
			<v-menu offset-y>
				<v-btn flat slot="activator"> Alejandro Uray
					<v-icon class="pl-2">account_circle</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile v-for="item in items" :key="item.title" @click="">
						<v-list-tile-title>{{ item.title }}</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-toolbar-items>
	</v-toolbar>
</template>

<script>
  export default {
    name: 'HeaderApp',
    data () {
      return {
				title: 'Net Promoter Score - Carrefour Express',
				items: [
					{ title: 'Mi perfil' },
					{ title: 'Cerrar sesión' },
				],
      }
    }
  }
</script>