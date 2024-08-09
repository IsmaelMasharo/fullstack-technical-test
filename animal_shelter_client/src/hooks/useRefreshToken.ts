import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post('/api/auth/token/refresh/', {}, {
            withCredentials: true,
        });
        const accessToken = response.data.access
        setAuth(prev => {
            return { ...prev, accessToken }
        });
        return accessToken;
    }
    return refresh;
};

export default useRefreshToken;