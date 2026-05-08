import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function run() {
  const params: any = {
      serviceKey: decodeURIComponent(SERVICE_KEY),
      numOfRows: 10,
      pageNo: 1,
      _type: "json",
      bgnde: '20230101',
      endde: '20231231',
      loccd: '48000',
      locnm: encodeURIComponent('능곡공공하수처리시설')
  };
  try {
     let res = await axios.get(`${API_BASE_URL}/day/daylist`, { params });
     console.log("Both:", res.data.response?.body?.totalCount);
  } catch(e) {}
  
  params.locnm = '능곡공공하수처리시설';
  try {
     let res = await axios.get(`${API_BASE_URL}/day/daylist`, { params });
     console.log("Both unencoded:", res.data.response?.body?.totalCount);
  } catch(e) {}
}
run();
