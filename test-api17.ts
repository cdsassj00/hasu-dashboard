import axios from 'axios';

const API_BASE_URL = "https://apis.data.go.kr/B500001/sewerage/waterQuality";
const SERVICE_KEY = "q6GEh7ev8GmxrHvFYOpqYn3NPDLmF2Hj6WuWC8gWNMPdOp6vtZ3OcDs4bL5hwBtl7F2Ru%2B%2Fi0i7GHbfRcmOetg%3D%3D";

async function bruteForce() {
  const paramNames = [
    'locnm', 'locNm', 'loc_nm', 'fcltynm', 'fcltyNm', 'fclty_nm', '시설명', 'facilNm', 'facil_nm',
    'loccd', 'fcltycd', 'fcltyCd', 'facilCd', 'loc_cd', 'fcltyMngNo'
  ];
  
  const dateParamNames = [
    ['bgnde', 'endde'],
    ['searchBgnDe', 'searchEndDe'],
    ['stdt', 'eddt'],
    ['startDt', 'endDt'],
    ['searchStDt', 'searchEdDt']
  ];

  for (const p of paramNames) {
    for (const [b, e] of dateParamNames) {
        try {
            const params: any = {
                serviceKey: decodeURIComponent(SERVICE_KEY),
                numOfRows: 10,
                pageNo: 1,
                _type: "json"
            };
            params[p] = p.toLowerCase().includes('nm') || p === '시설명' ? '능곡공공하수처리시설' : '48000';
            params[b] = '20200101';
            params[e] = '20251231';
            
            const res = await axios.get(`${API_BASE_URL}/day/daylist`, { params });
            const count = res.data?.response?.body?.totalCount;
            if (count > 0) {
                console.log(`BINGO! p=${p}, dates=${b},${e}, count=${count}`);
                console.log(res.data.response.body.items.item[0]);
                return;
            }
        } catch(e) {}
    }
  }
  console.log("No luck.");
}
bruteForce();
