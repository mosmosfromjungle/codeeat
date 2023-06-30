import axios from 'axios';
import { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

// 친구 목록 가져옴
// export const fetchFriends = async (username: string) => {
//     try {
//         const cookieUserName = cookies.get('username');
//         const response = await axios.post(`/friends/list`, { username: username || cookieUserName });
//         return response.data.payload;
//       } catch (error) {
//         console.error(error);
//       }
// }

export const getFriendList = async (): Promise<any> => {
    const response = await axios.get('/friends/list')
    const { data } = response
    if (response.status == 200) {
      // console.log('getFriendList 성공')
      return data.payload
    }
}

export const getFriendRequestList = async (): Promise<any> => {
    const response = await axios.get('/friends/request/list')
    const { data } = response
    if (response.status == 200) {
      // console.log('getFriendRequestList 성공')
      // console.log(data)
      return data
    }
}

export const sendFriendReq = async (body: sendRequest): Promise<any> => {
    try {
        const response = await axios.post('/friends/request', body, {
            withCredentials: true,
            headers: {
                'Content-type': 'application/json',
            },
        })
        if (response) {
          
        }
        if (response.status === 201) {
          // console.log(response)

          return response.data
        }
    } catch (error) {
        throw error
    }
}

export const handleAccept = async (body: AcceptRequest): Promise<any> => {
    try {
      const response = await axios.put('/friends/request/accept', body, {
        withCredentials: true,
        headers: {
          'Content-type': 'application/json',
        },
      })
      console.log(response)
      if (response.status === 200) {
        // console.log(response)
        return response.data

      }
    } catch (error) {
      throw error
    } 
} 

export const handleReject = async (body: RejectRequest): Promise<any> => {
    try {
      const response = await axios.put('/friends/request/reject', body, {
        withCredentials: true,
        headers: {
          'Content-type': 'application/json',
        },
      })
      console.log(response)
      if (response.status === 200) {
        // console.log(response)
        return response.data

      }
    } catch (error) {
      throw error
    } 
}

export const handleRemove = async (body: RejectRequest): Promise<any> => {
    try {
    const response = await axios.delete('/friends/remove', {
      data: body, // add data property
      withCredentials: true,
      headers: {
        'Content-type': 'application/json',
      },
    })
    // console.log(response)
    if (response.status === 200) {
      // console.log('잘들어온경???')
      // console.log(response)
      return response.data
    }
  } catch (error) {
    throw error
  } 
}


export interface AcceptRequest {
  requester: string
  recipient: string
}

export interface RejectRequest {
  requester: string
  recipient: string
}

export interface RemoveRequest {
  requester: string
  recipient: string
}

export interface sendRequest {
  requester: string
  recipient: string
}