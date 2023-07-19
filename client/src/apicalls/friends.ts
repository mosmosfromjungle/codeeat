import axios from 'axios';
import { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const getFriendList = async (): Promise<any> => {
    const response = await axios.get('/friends/list')
    const { data } = response
    if (response.status == 200) {
      return data
    }
}

export const getFriendRequestList = async (): Promise<any> => {

    const response = await axios.get('/friends/request/list')
    const { data } = response
    if (response.status == 200) {
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
    if (response.status === 200) {
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