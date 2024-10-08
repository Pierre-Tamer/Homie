import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { JwtResponse, UserResponseDto } from 'dto';
import { useAuthStore } from '../store/auth.store';

export type ApiResponse<T> =
  | {
      isSuccessful: false;
      status: number;
      data: null;
    }
  | {
      isSuccessful: true;
      status: number;
      data: T;
    };

export const baseUrl = 'http://192.168.229.6:3000';

export const refreshAccessToken = async () => {
  const token = await SecureStore.getItemAsync('refreshToken');
  if (!token) return;

  try {
    const res = await axios.get<JwtResponse>(baseUrl + '/auth/refresh', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { iscompleteProfile, refreshToken, expAccessToken, accessToken } =
      res.data;

    await SecureStore.setItemAsync('refreshToken', refreshToken);
    useAuthStore.setState({
      accessToken,
      expAccessToken,
      refreshToken,
      isSignedIn: true,
      isCompleteProfile: iscompleteProfile,
      isVerified: true,
    });
  } catch (err: any) {
    return;
  }

  try {
    const { data: user } = await axios.get<UserResponseDto>(
      baseUrl + '/profile/my',
      {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      },
    );

    useAuthStore.setState({ user });
  } catch (err: any) {
    console.log(err);
    return;
  }
};

export const Axios = axios.create({
  baseURL: baseUrl,
  timeout: 2000,
});

Axios.interceptors.request.use(async function (config) {
  const authState = useAuthStore.getState();

  console.log('check ', Date.now(), authState.expAccessToken! * 1000);
  if (
    authState.expAccessToken &&
    authState.accessToken &&
    Date.now() >= authState.expAccessToken! * 1000
  ) {
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${authState.accessToken}`;
    } else {
      config.headers = { Authorization: `Bearer ${authState.accessToken}` };
    }
    return config;
  }

  await refreshAccessToken();
  const newAccessToken = useAuthStore.getState().accessToken;
  if (config.headers) {
    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
  } else {
    config.headers = { Authorization: `Bearer ${newAccessToken}` };
  }
  return config;
});
