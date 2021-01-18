import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'development' ? 'http://192.168.2.107:8080' : 'https://api-open-cloud-erp.herokuapp.com'
console.log(baseURL)
const instance = axios.create({
    baseURL
})

export default instance