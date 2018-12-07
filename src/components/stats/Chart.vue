<template lang="pug">
  highcharts(:options="types[type]" ref="highcharts")
</template>

<script>
	import Vue from 'vue'
	import Highcharts from 'highcharts'
	import VueHighcharts from 'vue-highcharts'

	require('highcharts/modules/exporting')(Highcharts)
	Vue.use(VueHighcharts, { Highcharts })

  export default {
    props: ['type', 'title', 'data'],
    data () {
      return {
        series: null,
        types: {
          barStacked: {
            chart: {
              type: 'bar',
              height: '600px'
            },
            title: {
              text: null,
              style: { fontSize: '24px' }
            },
            xAxis: {
              categories: null
            },
            yAxis: {
              min: 0,
              max: 100,
              title: {
                text: 'Índice'
              }
            },
            legend: {
              reversed: false
            },
            plotOptions: {
              series: {
                stacking: 'normal',
                dataLabels: {
                  useHTML: true,
                  enabled: true,
                  color: '#000000',
                  format: '{y}%',
                  style: {
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#000000',
                  }
                }
              }
            },
            series: [{
              name: 'Muy Bueno',
              data: null
            }, {
              name: 'Bueno',
              data: null
            }, {
              name: 'Malo',
              data: null
            }, {
              name: 'Muy Malo',
              data: null
            }],
            colors: ['#26A500', '#25F16C', '#F2E41D', '#DE4D3A']
          },
          columnStacked: {
            title: {
                text: null
            },
            chart: {
              type: 'column',
              height: '600'
            },
            xAxis: {
                categories: null
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Promedio de Valoraciones'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
              series: {
                stacking: 'normal',
                dataLabels: {
                  useHTML: true,
                  enabled: true,
                  color: '#000000',
                  format: '{y}%',
                  style: {
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#000000',
                  }
                }
              }
            },
            series: [{
                name: 'Muy Bueno',
                data: null
            }, {
                name: 'Bueno',
                data: null
            }, {
                name: 'Malo',
                data: null
            }, {
                name: 'Muy Malo',
                data: null
            }],
					colors: ['#26A500', '#25F16C', '#F2E41D', '#DE4D3A']
          },
        }
      }
    },
    watch: {
      data() {
        this.types[this.$props.type].title.text = this.$props.title
        if (this.$props.type == "barStacked") this.types[this.$props.type].xAxis.categories = this.$props.data.map(x => `${x.title} - ${x.total} resp. - ${x.satisfaction}% satisf.`)
        else this.types[this.$props.type].xAxis.categories = this.$props.data.map(x => `${x.title} - ${x.total} resp.`)
        this.types[this.$props.type].series[0].data = this.$props.data.map(x => x.veryGood)
        this.types[this.$props.type].series[1].data = this.$props.data.map(x => x.good)
        this.types[this.$props.type].series[2].data = this.$props.data.map(x => x.bad)
        this.types[this.$props.type].series[3].data = this.$props.data.map(x => x.veryBad)
      }
    }
	}
</script>

<style lang="sass" scoped>
</style>