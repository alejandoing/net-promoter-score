<template lang="pug">
  div.container
    div.justification(v-for="reason in reasons")
      img.pr-3(:src="reason.url" width=158 height=138 @click="dynamicDialog(reason)")
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
            Face.pb-5(:data="currentReason.stats")
          v-flex.pt-3.pb-5(xs12)
            v-card.my-1.mr-1(flat tile)
              v-card-media.white--text.primary(height="75px")
                span.headline.ml-4.pt-3 Satisfacción de Cliente: {{ currentReason.stats.indicatorsGlobal.satisfaction }}%
              v-card-title
                v-progress-linear(:value="currentReason.stats.indicatorsGlobal.satisfaction" height="20" color="info")
          v-layout
            v-flex(xs6)
              v-card.my-1.mr-1(flat tile)
                v-card-media.white--text.primary(height="75px")
                  span.indicatorsTwoTitle.ml-4.pt-3 Quejas: {{ currentReason.stats.indicatorsGlobal.complain[1] }}% - {{ currentReason.stats.indicatorsGlobal.complain[0] }} total
                v-card-title
                  v-progress-linear(:value="currentReason.stats.indicatorsGlobal.complain[1]" height="20" color="info")
            v-flex(xs6)
              v-card.my-1.mr-1(flat tile)
                v-card-media.white--text.primary(height="75px")
                  span.indicatorsTwoTitle.ml-4.pt-3 Com. Positivos: {{ currentReason.stats.indicatorsGlobal.comment[1] }}% - {{ currentReason.stats.indicatorsGlobal.comment[0] }} total
                v-card-title
                  v-progress-linear(:value="currentReason.stats.indicatorsGlobal.comment[1]" height="20" color="info")
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
        currentReason: { stats: { indicatorsGlobal: { comment: [], complain: [] }}},
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
            this.reasons[reason].value = this.$props.data.reasons[reason][0]
            this.reasons[reason].percentage = this.$props.data.reasons[reason][1]
            this.reasons[reason].stats = this.$props.data.reasons[reason][2]
          }
        }
      }
    },
    methods: {
			getPercentage(part, universe) {
				let result = parseFloat(((part * 100) / universe).toFixed(2))
				return isNaN(result) ? 0 : result
			},
			dynamicDialog(data) {
        data.stats.indicatorsGlobal = { satisfaction: null, complain: [null, null], comment: [null, null] }
        this.currentReason = data
        this.dynamicDialogAct = !this.dynamicDialogAct
        this.getIndicatorsGlobal(data)
      },
			getIndicatorsGlobal(data) {
        console.log(data)
				const PRC_GOOD_R = 0.25, PRC_BAD_R = 0.50, PRC_VERY_BAD_R = 1
				
        const total = data.value
				
        let complains = 0, comments = 0, services = 0, reasons = 0

				for (let assessment of data.stats.assessments) {
					assessment.complain ? complains++ : complains
					assessment.comment ? comments++ : comments
					assessment.flow.justification ? services++ : services
					assessment.flow.justificationTwo ? reasons++ : reasons
				}

				const partialGood = data.stats.good[0] * PRC_GOOD_R
				const partialBad = data.stats.bad[0] * PRC_BAD_R
				const partialVeryBad = data.stats.veryBad[0] * PRC_VERY_BAD_R
				
				const partials = partialGood + partialBad + partialVeryBad

				this.currentReason.stats.indicatorsGlobal.satisfaction = 100 - this.getPercentage(partials, total)
				
				this.currentReason.stats.indicatorsGlobal.complain = [complains, this.getPercentage(complains, total)]
				this.currentReason.stats.indicatorsGlobal.comment = [comments, this.getPercentage(comments, total)]
			},
    },
    components: {
      Face
    }
	}
</script>

<style lang="sass" scoped>
  .progress-linear
    margin-top: 0
    margin-bottom: 0
  .indicatorsTwoTitle
    font-size: 20px
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