<template lang="pug">
  div.container
    div.justification(v-for="reason in reasons")
      img.pr-3(:src="reason.url" width=158 height=138 @click="dynamicDialog(reason.stats)")
      span.justification-span {{ reason.title }}
      div.text
        span {{reason.percentage}}% | {{reason.value}} resp.
    v-dialog(v-model="dynamicDialogAct" fullscreen hide-overlay transition="dialog-bottom-transition")
      v-card
        v-toolbar(dark color="primary")
          v-btn(icon dark @click="dynamicDialogAct = false")
            v-icon close
          v-toolbar-title Detalle - Motivos: {{ currentReason.title }}
          v-spacer
          v-toolbar-items
            v-btn(dark flat @click="dynamicDialogAct = false") Regresar
        v-card-text
          v-flex(xs9 offset-xs2)
            Face.pb-5(:data="currentReason[3]")
</template>

<script>
	import Vue from 'vue'
	import Highcharts from 'highcharts'
  import VueHighcharts from 'vue-highcharts'
  import Face from './Face.vue'

	require('highcharts/modules/exporting')(Highcharts)
	Vue.use(VueHighcharts, { Highcharts })

  export default {
    props: ['data'],
    data () {
      return {
        dynamicDialogAct: false,
        currentReason: {},
				reasons: {
					0: { url: "./../../../static/reasons/atencion-cajero.png", title: 'Atención del Cajero', value: 0, percentage: 0 },
					1: { url: "./../../../static/reasons/tiempo-espera.png", title: 'Tiempo de Espera', value: 0, percentage: 0 },
					2: { url: "./../../../static/reasons/estado-local.png", title: 'Estado del Local', value: 0, percentage: 0 },
					3: { url: "./../../../static/reasons/servicio-utilizado.png", title: 'Servicio Utilizado', value: 0, percentage: 0 },
				},
      }
    },
    watch: {
      data() {
        if (this.$props.data) {
          for (let reason in this.reasons) {
            console.log(this.$props.data)
            this.reasons[reason].value = this.$props.data.reasons[reason][0]
            this.reasons[reason].percentage = this.$props.data.reasons[reason][1]
            this.reasons[reason].stats = this.$props.data.reasons[reason][2]
          }
        }
      }
    },
    methods: {
			dynamicDialog(data) {
        this.dynamicDialogAct = !this.dynamicDialogAct
        this.currentReason = data
        console.log(data)
			}
    },
    components: {
      Face
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
      cursor: pointer
    .justification-span
      justify-self: center
      font-size: 20px
      font-weight: bold
</style>