<template lang="pug">
  div.container
    div.faces(v-for="face in faces")
      img.pr-3(:src="face.url")
      div.text
        span {{face.percentage}}%
        span {{face.value}} resp.
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
				faces: {
					veryGood: { url: "./../../../static/faces/very-good.png", title: 'veryGood', value: 0, percentage: 0 },
					good: { url: "./../../../static/faces/good.png", title: 'good', value: 0, percentage: 0 },
					bad: { url: "./../../../static/faces/bad.png", title: 'bad', value: 0, percentage: 0 },
					veryBad: { url: "./../../../static/faces/very-bad.png", title: 'veryBad', value: 0, percentage: 0 },
				},
      }
    },
    watch: {
      data() {
        if (this.$props.data) {
          for (let face in this.faces) {
            this.faces[face].value = this.$props.data[face][0]
            this.faces[face].percentage = this.$props.data[face][1]
          }
        }
      }
    }
	}
</script>

<style lang="sass" scoped>
  .container
    display: grid;
    position: relative;
    right: 30px;
    grid-template: 1fr / repeat(4, .5fr);
    .faces
      display: grid;
      justify-content: start;
      grid-template: 1fr / .1fr auto;
      .text
        display: grid
        grid-template: .5fr .5fr / 1fr;
        span
          font-size: 24px;
          align-self: center;
</style>