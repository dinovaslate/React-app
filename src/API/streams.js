import axios from 'axios';

export default axios.create({
  baseURL: 'https://json-fake-server-twitch.herokuapp.com',
});
