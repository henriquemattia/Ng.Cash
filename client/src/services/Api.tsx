import axios from "axios";

const token = localStorage.getItem("token")
const api = axios.create({
    baseURL: 'http://localhost:3030',
    headers: {'Authorization': `Bearer ${token}`}
})


// axios.defaults.headers.common = {'Authorization': `bearer ${token}`}


export default api