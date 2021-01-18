import axios from 'axios'

const dev = true
const baseURL = dev ? 'http://192.168.2.107:8080' : 'https://api-open-cloud-erp.herokuapp.com'

const instance = axios.create({
    baseURL
})

export default instance