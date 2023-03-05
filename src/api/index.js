import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const insertarEjemplo = payload => api.post(`/ejemplo`, payload)
export const modificarEjemplo = (id, payload) => api.put(`/ejemplo/${id}`, payload)
export const eliminarEjemplo = id => api.delete(`/ejemplo/${id}`)
export const obtenerEjemploConId = id => api.get(`/ejemplo/${id}`)
export const obtenerEjemplos = () => api.get(`/ejemplo`)

const apis = {
    insertarEjemplo,
    modificarEjemplo,
    eliminarEjemplo,
    obtenerEjemploConId,
    obtenerEjemplos
}

export default apis;