import axios from "axios";
const API_URL = "http://localhost:5000/"

export async function queryAPI(){
    return axios   
        .get(API_URL)
        .then((result) => {
            return result.data;
        })
}