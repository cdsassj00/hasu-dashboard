import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function testError() {
  try {
    const res = await axios.get(`${API_BASE_URL}/day/daylist?serviceKey=${SERVICE_KEY}&_type=json&pageNo=wrong`);
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e: any) {
    console.log(e.response?.data);
  }
}
testError();
