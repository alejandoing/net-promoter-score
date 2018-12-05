<template lang="pug">
  div.container
    div.justification(v-for="zone in zones")
      img.pr-4(:src="zone.url" width=158 height=138)
      span.justification-span {{ zone.title }}
      div.text
        span {{zone.percentage}}% | {{zone.value}} resp.
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
				zones: {
					0: { url: "./../../../static/zones/walter-mancho.png", title: 'Walter Mancho', value: 0, percentage: 0 },
					1: { url: "./../../../static/zones/luciana-bernadotti.png", title: 'Luciana Bernadotti', value: 0, percentage: 0 },
					2: { url: "./../../../static/zones/cristina-marigomez.png", title: 'Cristina Marigomez', value: 0, percentage: 0 },
          3: { url: "./../../../static/zones/dado-ricci.png", title: 'Dado Ricci', value: 0, percentage: 0 },
          4: { url: "./../../../static/zones/diego-longo.png", title: 'Diego Longo', value: 0, percentage: 0 },
          5: { url: "./../../../static/zones/florencia-casa.png", title: 'Florencia Casa', value: 0, percentage: 0 },
				},
      }
    },
    watch: {
      data() {
        if (this.$props.data) {
          for (let zone in this.zones) {
            this.zones[zone].value = this.$props.data.zones[zone][0]
            this.zones[zone].percentage = this.$props.data.zones[zone][1]
          }
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
      font-size: 18px
      font-weight: bold
</style>