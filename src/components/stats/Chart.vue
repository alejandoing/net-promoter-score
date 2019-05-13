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
    props: ['type', 'title', 'data', 'textSize'],
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
              categories: null,
              labels: {
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold'
                }
              }
            },
            yAxis: {
              min: 0,
              max: 100,
              title: {
                text: 'Índice',
                style: {
                  fontSize:'15px'
                }
              },
                labels: {
                  style: {
                    fontSize:'14px',
                  }
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
                categories: null,
                labels: {
                  style: {
                    fontSize:'15px'
                  }
                },
                // crosshair: true
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Promedio de Valoraciones',
                    style: {
                      fontSize:'15px'
                    }
                },
                labels: {
                  style: {
                    fontSize:'15px'
                  }
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
            },{
              name: 'Bueno',
              data: null
            },{
              name: 'Malo',
              data: null
            },{
              name: 'Muy Malo',
              data: null
            },{
              name: 'Satisfaccion',
              type: 'spline',
              data: null,
              dataLabels: {
                color: 'white',
                enabled: false,
                useHTML: true
              },
              tooltip: {
                valueSuffix: '% satis.'
              },
            }
            ],
					colors: ['#26A500', '#25F16C', '#F2E41D', '#DE4D3A', '#1769aa']
          },
        }
      }
    },
    watch: {
      data() {
      try {
        this.types[this.$props.type].title.text = this.$props.title
        if (this.$props.type == "barStacked") {
          if (this.$props.data.length > 4) this.types[this.$props.type].chart.height = '900px'
          this.types[this.$props.type].xAxis.categories = this.$props.data.map(x => `${x.title} - ${x.total} resp - ${x.satisfaction}% satis.`)
          if (this.$props.textSize) this.types[this.$props.type].xAxis.labels.style.fontSize = this.$props.textSize
        }
        else this.types[this.$props.type].xAxis.categories = this.$props.data.map(x => `${x.title} - ${x.total} resp. - ${x.satisfaction}% satis.`)
        this.types[this.$props.type].series[0].data = this.$props.data.map(x => x.veryGood)
        this.types[this.$props.type].series[1].data = this.$props.data.map(x => x.good)
        this.types[this.$props.type].series[2].data = this.$props.data.map(x => x.bad)
        this.types[this.$props.type].series[3].data = this.$props.data.map(x => x.veryBad)
        this.types[this.$props.type].series[4].data = this.$props.data.map(x => parseFloat(x.satisfaction))
      }
      catch(e) {
        e = null
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .testing
    font-size: 72px
</style>