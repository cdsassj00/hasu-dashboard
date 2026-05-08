import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function test() {
  try {
    const response = await axios.get(`${API_BASE_URL}/day/daylist?serviceKey=${SERVICE_KEY}&fcltyMngNo=48000&bgnde=20240101&endde=20240331&numOfRows=10&pageNo=1&_type=json`);
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error("Error:", error.response?.status, error.response?.data || error.message);
  }
}

test();
