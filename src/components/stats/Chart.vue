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
              text: this.$props.title,
              style: { fontSize: '24px' }
            },
            xAxis: {
              categories: this.$props.data.map(x => x.title)
            },
            yAxis: {
              min: 0,
              max: 100,
              title: {
                text: 'Promedio de Valoraciones'
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
              data: this.$props.data.map(x => x.veryGood)
            }, {
              name: 'Bueno',
              data: this.$props.data.map(x => x.good)
            }, {
              name: 'Malo',
              data: this.$props.data.map(x => x.bad)
            }, {
              name: 'Muy Malo',
              data: this.$props.data.map(x => x.veryBad)
            }],
            colors: ['#26A500', '#25F16C', '#F2E41D', '#DE4D3A']
          },
          columnStacked: {
            chart: {
              type: 'column',
              height: '600'
            },
            title: {
                text: 'Todas las Unidades Combinandas - Distribución Diaria'
            },
            xAxis: {
                categories: ['01/07', '02/07', '03/07',
                '04/07', '05/07', '06/07', '07/07', '08/07', '09/07', '10/07', '11/07', '12/07',
                '13/07', '14/07', '15/07', '16/07', '17/07', '18/07', '19/07', '20/07', '21/07',
                '22/07', '23/07', '24/07', '25/07', '26/07', '27/07', '28/07', '29/07', '30/07',
                '31/07']
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
                        rotation: 270,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px',
                            fill: 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Muy Bueno',
                data: [30, 20, 30, 10, 20, 30, 20, 40, 40, 20, 40, 20, 40, 40, 20,
                30, 40, 30, 10, 40, 30, 20, 40, 10, 20, 40, 20, 30, 40, 20, 40]
            }, {
                name: 'Bueno',
                data: [30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30,
                30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 20]
            }, {
                name: 'Malo',
                data: [30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30,
                30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 20]
            }, {
                name: 'Muy Malo',
                data: [10, 40, 10, 30, 40, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30,
                30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 20]
            }],
            colors: ['#26A500', '#25F16C', '#F2E41D', '#DE4D3A']
          },
        }
      }
    },
    watch: {
      data() {
        if (this.$props.data) {
          this.types[this.$props.type].series[0].data = this.$props.data.map(x => x.veryGood)
          this.types[this.$props.type].series[1].data = this.$props.data.map(x => x.good)
          this.types[this.$props.type].series[2].data = this.$props.data.map(x => x.bad)
          this.types[this.$props.type].series[3].data = this.$props.data.map(x => x.veryBad)
        }
      }
    }
	}
</script>

<style lang="sass" scoped>
</style>