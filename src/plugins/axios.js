import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://174.36.119.3:8080'
})

Vue.prototype.$axios = axiosInstance
Vue.use(axiosInstance)