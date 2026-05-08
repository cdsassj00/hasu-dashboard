import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function testDates() {
  const formats = [
    {b: '2023-01-01', e: '2023-12-31'},
    {b: '2023.01.01', e: '2023.12.31'},
    {b: '2023/01/01', e: '2023/12/31'},
    {b: '20230101', e: '20231231'},
    {b: '2023-01-01 00:00:00', e: '2023-12-31 23:59:59'}
  ];
  
  for (const f of formats) {
      try {
        const params: any = {
          serviceKey: decodeURIComponent(SERVICE_KEY),
          numOfRows: 10,
          pageNo: 1,
          _type: "json",
          loccd: 48000,
          bgnde: f.b,
          endde: f.e
        };
        const response = await axios.get(`${API_BASE_URL}/day/daylist`, { params });
        const count = response.data.response?.body?.totalCount;
        if (count > 0) {
            console.log(`FOUND! dates: ${f.b}, Count:`, count);
            break;
        }
      } catch (error: any) {}
  }
  console.log("Done checking formats.");
}

testDates();
