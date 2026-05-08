import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function testParams() {
  const paramsList = [
    { loccd: 48000 },
    { loccd: 48000, bgnde: '20230101', endde: '20231231' },
    { fcltyMngNo: 48000, bgnde: '20220101', endde: '20221231' },
    { locCd: 48000, bgnde: '20230101', endde: '20231231' },
    { searchBgnDe: '20230101', searchEndDe: '20231231' }
  ];

  for (const params of paramsList) {
    try {
      const response = await axios.get(`${API_BASE_URL}/day/daylist`, {
        params: {
          serviceKey: decodeURIComponent(SERVICE_KEY),
          numOfRows: 10,
          pageNo: 1,
          _type: "json",
          ...params
        }
      });
      console.log(`Params:`, params);
      console.log("Total Count:", response.data.response?.body?.totalCount);
    } catch (error: any) {
      console.error(error.message);
    }
  }
}

testParams();
