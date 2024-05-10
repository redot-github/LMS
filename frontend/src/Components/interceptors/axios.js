import axios from 'axios'

axios.defaults.baseURL= 'http://localhost:5000/ADMIN'


axios.interceptors.response.use(res=>res,async error=>{
    if(error.response.status=== 401){
        const response = await axios.post('refresh',{withCredentials:true})
if(response.status=== 200){
    axios.defaults.headers.common['Authorization'] = `Bearer ${adminResponse.data['token']}`

return axios(error,config)
}

    }
return error;
});