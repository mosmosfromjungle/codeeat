import axios from 'axios'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
// TODO: userAppSelector를 통해 UserStore에 저장된 accessToken을 가져와서 API 호출에 사용하는 방법도 있다.
export const logout = () => {
    cookies.remove('refreshToken', { path: '/' });
    // cookies.remove('accessToken', { path: '/' });
    // cookies.remove('userId', { path: '/' });
    // cookies.remove('username', { path: '/' });
    // cookies.remove('character', { path: '/' });
    // TODO: Add API calls for deleting refreshToken (in case of token extortion)
    window.location.href = '/';
}
const refreshAccessToken = async (body: object) => {
    try {
        const response = await axios.post('auth/refresh', body, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const { payload } = response.data
        const token = payload.accessToken
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
export const login = async (body: LoginRequest): Promise<any> => {
    try {
        const response = await axios.post('/auth/login', body, {
            withCredentials: true,
            headers: {
                'Content-type': 'application/json',
            },
        })
        if (response.status === 200) {
            const token = response.data.payload.accessToken
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
        }
        return response.data
    } catch (error) {
        throw error
    }
}
export const authenticateUser = async (): Promise<any | null> => {
  try {
    const response = await axios.get('/auth/authenticate', {
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (response.status === 200) {
      const { data } = response;
      if (data.status == 200) {
        return data;
      }
    }
  } catch(error) {
    console.log('First authentication request failed:', error);
    
    // FIXME: Cookie not working 
    const refreshToken = cookies.get('refreshToken');
    if (refreshToken) {
      const refreshed = await refreshAccessToken({
        refreshToken: refreshToken,
      });
      
      if (!refreshed) {
        console.log('Token refresh failed');
        logout();
        return null;
      }
      try {
        const response2 = await axios.get('/auth/authenticate', {
          headers: {
            'Content-type': 'application/json',
          },
        });
        if (response2.status === 200) {
          const { data } = response2;
          if (data.status == 200) {
            return data;
          }
        }
      } catch(error) {
        console.log('Second authentication request after token refresh failed:', error);
      }
    }
  }
  return null;
};
export const getMyProfile = async (): Promise<any> => {
    const response = await axios.get('/auth/myprofile');
    const { data } = response;
    if (response.status == 200) {
      return data.payload;
    }
  
    if (response.status === 401) {
      const refreshToken = cookies.get('refreshToken');
  
      if (refreshToken) {
        const issuedResponse = await refreshAccessToken({
          refreshToken: refreshToken,
        });
  
        if (!issuedResponse) {
          logout();
          return;
        }
  
        const response2 = await axios.get('/auth/myprofile');
        const { data } = response2;
        if (response2.status == 200) {
          return data.payload;
        }
      }
    }
  
    return null;
};

export const getUserProfile = async (username): Promise<any> => {
  const response = await axios.get(`/auth/profile/${username}`)
  const { data } = response
  console.log(data)
  if (response.status == 200) {
    return data.payload
  }

  if (response.status === 401) {
    const refreshToken = cookies.get('refreshToken')

    if (refreshToken) {
      const issuedResponse = await refreshAccessToken({
        refreshToken: refreshToken,
      })

      if (!issuedResponse) {
        logout()
        return
      }

      const response2 = await axios.get('/auth/myprofile')
      const { data } = response2
      if (response2.status == 200) {
        return data.payload
      }
    }
  }

  return null
}

export const updateMyProfile = async (body: UpdateRequest): Promise<any> => {
    try {
        const response = await axios.patch('/auth/update', body, {
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

// export const updateMyProfile = async () => {
//     const body = {
//       school: school,
//       grade: grade,
//       description: description,
//     }
//     try {
//       const response = await axios.post(`/update`, body)
//       if (response) {
//         const { status } = response.data
//         if (response.status === 200) {
//           if (status === 200) {
//             return 1
//           } else if (status === 404) {
//             return 2
//           } else if (status === 409) {
//             return 3
//           }
//         } else {
//           console.log('서버에러')
//         }
//       }
//     } catch (error) {}
//   }

export const join = async (body: JoinRequest): Promise<any> => {
  try {
    const response = await axios.post('/auth/signup', body, {
      withCredentials: true,
      headers: {
        'Content-type': 'application/json',
      },
    })
    if (response.status === 200) { 
      // UGLY: 이 부분이 필요없다는게 검증되면 삭제하기 
    }
    return response.data
  } catch (error) {
    throw error 
  }
}
export interface JoinRequest {
  userId: string
  password: string
  username: string
  character: string
}
export interface LoginRequest {
    userId: string
    password: string
}

export interface UpdateRequest {
  // username: string
  // character: string
  grade: string
  school: string
  profileMessage: string
}