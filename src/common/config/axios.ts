import axios from 'axios';

import { env } from '@/common/utils/envConfig';

const axiosInstance = axios.create({
  baseURL: env.BUDA_API_URL,
  timeout: 10000,
});

export default axiosInstance;
