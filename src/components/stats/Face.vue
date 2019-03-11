<template lang="pug">
  div.container
    div.faces(v-for="face in faces")
      img.pr-3(:src="face.url")
      div.text
        span.percentage {{ face.percentage }}%
        span {{ face.value }} resp.
</template>

<script>
	import Vue from 'vue'
	import Highcharts from 'highcharts'
	import VueHighcharts from 'vue-highcharts'

	require('highcharts/modules/exporting')(Highcharts)
	Vue.use(VueHighcharts, { Highcharts })

  export default {
    props: ['data'],
    watch: {
      data() {
        if (this.$props.data) {
          for (let data of this.$props.data) {
            if (this.faces[data.face]) {
              this.faces[data.face].value = data.value
              this.faces[data.face].percentage = data.percentage
            }
            else {
              this.faces[data.face] = { value: 0, percentage: 0 }
            }
          }
        }
      }
    },
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
    created() {
      if (this.$props.data) {
        for (let data of this.$props.data) {
          this.faces[data.face].value = data.value
          this.faces[data.face].percentage = data.percentage
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
          font-size: 20px;
          align-self: center;
        .percentage
          font-size: 30px
</style>