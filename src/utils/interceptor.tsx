import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

const http = axios.create({
    
});

http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // alert("ERROR")
        if (error.response) {
            const { data: responseData, status } = error.response;
            if (status === 401) {
                toast.error(`Error: Unauthorized`);

                // authentication is suppose to be here for logout, but no authentication file yet
            }
            if (responseData.error || responseData.errorDescription) {
                toast.error(`Error: ${responseData?.error || responseData?.errorDescription}`);
            } else {
                const { message } = responseData;
                toast.error(message || `Error: ${error.message}`);
            }
        } else if (error.message) {
            toast.error(`Error: ${error.message}`);
            
        } else if (error.code) {
            toast.error(`Error: ${error.code}`);
            
        }

        return Promise.reject(error);
    }
);

export default http;