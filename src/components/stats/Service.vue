<template lang="pug">
  div.container
    div.justification(v-for="service in services")
      img.pr-3(:src="service.url" width=158 height=138)
      span.justification-span {{ service.title }}
      div.text
        span {{service.percentage}}% | {{service.value}} resp.
</template>

<script>
	import Vue from 'vue'
	import Highcharts from 'highcharts'
	import VueHighcharts from 'vue-highcharts'

	require('highcharts/modules/exporting')(Highcharts)
	Vue.use(VueHighcharts, { Highcharts })

  export default {
    props: ['data'],
    data () {
      return {
				services: {
					0: { url: "./../../../static/services/pago-servicios.png", title: 'Pago Servicios', value: 0, percentage: 0 },
					1: { url: "./../../../static/services/envio-internacional.png", title: 'Envío Internacional', value: 0, percentage: 0 },
					2: { url: "./../../../static/services/pago-servicios.png", title: 'Envío Nacional', value: 0, percentage: 0 },
					3: { url: "./../../../static/services/casa-cambio.png", title: 'Casa de Cambio', value: 0, percentage: 0 },
				},
      }
    },
    watch: {
      data() {
        for (let service in this.services) {
          this.services[service].value = this.$props.data.services[service][0]
          this.services[service].percentage = this.$props.data.services[service][1]
        }
      }
    }
	}
</script>

<style lang="sass" scoped>
  .container
    display: grid
    position: relative
    right: 30px
    grid-template: 1fr / repeat(4, .5fr)
    .justification
      .text
        display: grid
        justify-content: center
        font-size: 20px
        grid-template: .5fr .5fr / 1fr
        span
          font-size: 24px
          text-align: center
  .justification
    display: grid
    justify-content: center
    padding-right: 30px
    img
      padding: 0 !important
    .justification-span
      justify-self: center
      font-size: 20px
      font-weight: bold
</style>