import axios from 'axios';

import { STUDENT } from '@constants/student';

const apiClient = axios.create({
    baseURL: 'https://fakestoreapi.com',

    timeout: 15000,

    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    config => {
        config.headers['X-Student-Id'] =
            STUDENT.mssv;

        return config;
    },

    error => {
        return Promise.reject(error);
    },
);

export default apiClient;