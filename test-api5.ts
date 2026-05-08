import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function testParams() {
  const dates = ['20150101', '20160101', '20190101', '20200101'];
  
  for (const date of dates) {
    try {
      const response = await axios.get(`${API_BASE_URL}/day/daylist`, {
        params: {
          serviceKey: decodeURIComponent(SERVICE_KEY),
          numOfRows: 10,
          pageNo: 1,
          _type: "json",
          loccd: 48000,
          bgnde: date,
          endde: '20251231'
        }
      });
      console.log(`loccd 48000 Date:`, date, "Count:", response.data.response?.body?.totalCount);
    } catch (error: any) {
    }
  }

  for (const date of dates) {
    try {
      const response = await axios.get(`${API_BASE_URL}/day/daylist`, {
        params: {
          serviceKey: decodeURIComponent(SERVICE_KEY),
          numOfRows: 10,
          pageNo: 1,
          _type: "json",
          fcltyMngNo: 48000,
          bgnde: date,
          endde: '20251231'
        }
      });
      console.log(`fcltyMngNo 48000 Date:`, date, "Count:", response.data.response?.body?.totalCount);
    } catch (error: any) {
    }
  }
}

testParams();
