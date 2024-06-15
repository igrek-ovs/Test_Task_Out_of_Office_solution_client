import axios from 'axios';

export const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {

    }
});

instance.interceptors.request.use(async (config : any) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && !config.url.includes('/auth/refresh')) {


        config.headers.Authorization = `Bearer ${localStorage.getItem(
            'accessToken',
        )}`;
    }

    return config;
});