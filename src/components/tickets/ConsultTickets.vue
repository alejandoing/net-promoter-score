<template lang="pug">
	v-container
		v-layout(row)
		v-flex(xs12)
			div.pb-5
				span.display-1 Tickets Registrados
				v-divider
			v-flex(xs12 sm12 v-if='tickets')
				v-card
					v-list
						template(v-for="ticket in tickets")
							v-list-tile(avatar)
								v-list-tile-avatar.pr-5
									span Leído
									v-checkbox(
										v-model="ticket.leido"
										@click="updateTicket(ticket)"
										color="blue"
										hide-details
									)
								v-spacer(style="flex-grow: .1 !important")
								v-list-tile-content.ticket-content(ripple @click="viewTicket(ticket.id)")
									v-list-tile-title.black-text Ticket Nro: {{ ticket.id }} ({{ ticket.dateFormat }})
									v-list-tile-sub-title
										span.grey--text.text--darken-2 {{ ticket.email }}, {{ ticket.telephone }}
							v-divider
			v-flex(xs12 sm12 v-else) 
				span.message Los tickets que se registren en el sistema aparecerán aquí
</template>

<script>
	import router from '@/router/'
  export default {
    data () {
      return {
				tickets: false,
				userStorage: JSON.parse(localStorage.getItem('user'))
      }
		},
		created() {
			let tickets = this.$firebase.firestore().collection("tickets").where('business', '==', this.userStorage.business)
			tickets.onSnapshot(querySnapshot => {
				this.tickets = []
				querySnapshot.forEach(doc => {
					let ticket = doc.data()
					ticket.dateFormat = this.convertDate(doc.data().date)
					ticket.id = doc.id
					this.tickets.unshift(ticket)
				})
				if (!this.tickets.length) this.tickets = false
			})
		},
		methods: {
			viewTicket(id) {
				{ router.push('/ticket/' + id) }
			},
			convertDate(inputFormat) {
				function pad(s) { return (s < 10) ? '0' + s : s; }
				let d = new Date(inputFormat)
				let date = [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
				let time = [pad(d.getHours()), pad(d.getMinutes())].join(':')
				return date + " a las " + time
			},
			updateTicket(ticket) {
				let ticketDoc = this.$firebase.firestore().doc("tickets/" + ticket.id)
				ticketDoc.update({
					business: ticket.business,
					date: ticket.date,
					description: ticket.description,
					email: ticket.email,
					leido: !ticket.leido,
					local: ticket.local,
					poll: ticket.poll,
					telephone: ticket.telephone
				})
				.then(() => {
					console.log('Actualizado correctamente')
				})
			}
		}
  }
</script>

<style lang="sass" scoped>
	.ticket-content
		cursor: pointer
		&:hover
			background: rgb(224, 224, 224) !important
		.black-text
			color: black
	.message
		font-size: 20px
</style>
