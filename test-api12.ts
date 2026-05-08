import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function testAll() {
  const dates = [
    {b: '20220101', e: '20220131'},
    {b: '20230101', e: '20230131'},
    {b: '20240101', e: '20240131'}
  ];
  
  for (const date of dates) {
      try {
        const params: any = {
          serviceKey: decodeURIComponent(SERVICE_KEY),
          numOfRows: 10,
          pageNo: 1,
          _type: "json",
          bgnde: date.b,
          endde: date.e
        };
        const response = await axios.get(`${API_BASE_URL}/day/daylist`, { params });
        const count = response.data.response?.body?.totalCount;
        if (count > 0) {
            console.log(`FOUND ANY! dates: ${date.b}, Count:`, count);
            console.log("Sample:", response.data.response.body.items.item[0]);
            return;
        }
      } catch (error: any) {}
  }
  console.log("Done checking any.");
}

testAll();
