import axios from 'axios';

const instance = axios.create({baseURL: 'https://react-my-burger-6d0c7.firebaseio.com/'});

export default instance;