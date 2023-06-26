import axios from 'axios';
import { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

// 친구 목록 가져옴
export const fetchFriends = async (username: string) => {
    try {
        const cookieUserName = cookies.get('username');
        const response = await axios.post(`/friends/list`, { username: username || cookieUserName });
        return response.data.payload;
      } catch (error) {
        console.error(error);
      }
}

export const getFriendList = async (): Promise<any> => {
    const response = await axios.get('/friends/list')
    const { data } = response
    console.log(data)
    if (response.status == 200) {
      console.log('성공')
      return data.payload
    }
}