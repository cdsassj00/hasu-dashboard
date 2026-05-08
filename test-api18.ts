import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function bruteForceLocs() {
  const locs = [48000, 4710, 47750, 47850, 47111, 44770, '48000', '4710', '47750'];
  
  for (const loc of locs) {
      try {
          const params: any = {
              serviceKey: decodeURIComponent(SERVICE_KEY),
              numOfRows: 10,
              pageNo: 1,
              _type: "json",
              loccd: loc
          };
          const res = await axios.get(`${API_BASE_URL}/day/daylist`, { params });
          const count = res.data?.response?.body?.totalCount;
          if (count > 0) {
              console.log(`BINGO! loccd=${loc}, count=${count}`);
              console.log(res.data.response.body.items.item[0]);
              return;
          }
      } catch(e) {}
  }
  console.log("No luck.");
}
bruteForceLocs();
