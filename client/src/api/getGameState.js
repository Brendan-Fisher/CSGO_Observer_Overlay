import axios from "axios";
const API_URL = "http://localhost:5000/"

export async function queryAPI(){
    //console.log(query);
    return axios   
        .post(API_URL)
        .then((result) => {
            console.log("HELLO");
            console.log(result.data);
            return result.data;
        })
}