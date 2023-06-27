import axios from 'axios';
import { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

// 친구 목록 가져옴
export const fetchFriends = async (userName: string) => {
    try {
        const cookieUserName = cookies.get('userName');
        const response = await axios.post(`/friends/list`, { userName: userName || cookieUserName });
        return response.data.payload;
      } catch (error) {
        console.error(error);
      }
}