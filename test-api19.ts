import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function testYears() {
  const paramCombinations = [
      {loccd: 48000}, {fcltyMngNo: 48000}, {fcltyCd: 48000}, {locnm: '능곡공공하수처리시설'}
  ];
  
  for (let year = 2025; year >= 2010; year--) {
      for (const paramsObj of paramCombinations) {
          try {
              const params: any = {
                  serviceKey: decodeURIComponent(SERVICE_KEY),
                  numOfRows: 10,
                  pageNo: 1,
                  _type: "json",
                  bgnde: `${year}0101`,
                  endde: `${year}1231`,
                  ...paramsObj
              };
              const res = await axios.get(`${API_BASE_URL}/day/daylist`, { params });
              const count = res.data?.response?.body?.totalCount;
              if (count > 0) {
                  console.log(`BINGO! year=${year}, params=${JSON.stringify(paramsObj)}, count=${count}`);
                  console.log(res.data.response.body.items.item[0]);
                  return;
              }
          } catch(e) {}
      }
  }
  console.log("No luck.");
}
testYears();
