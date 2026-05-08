import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function testParamNames() {
  try {
    const response = await axios.get(`${API_BASE_URL}/day/daylist?serviceKey=${SERVICE_KEY}`);
    console.log("No params XML response:");
    console.log(response.data);
  } catch (error: any) {
    if (error.response) {
       console.log(error.response.data);
    }
  }
}

testParamNames();
