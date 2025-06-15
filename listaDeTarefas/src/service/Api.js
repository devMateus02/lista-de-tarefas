import Axios from 'axios'

const api =  Axios.create({
    baseURL: 'https://lista-de-tarefas-xape.onrender.com'
})


export default api