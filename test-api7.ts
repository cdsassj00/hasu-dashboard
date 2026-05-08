import axios from 'axios';

async function searchPortal() {
  try {
    const res = await axios.get('https://www.data.go.kr/data/15103445/openapi.do');
    const matches = res.data.match(/요청변수|항목명|영문명|fclty/g);
    console.log("Matches:", matches?.length);
    // Find lines with fclty
    const lines = res.data.split('\n');
    lines.forEach((l: string) => {
        if(l.includes('fclty') || l.includes('loc') || l.includes('항목명') || l.includes('bgnde')) {
            console.log(l.trim().substring(0, 100));
        }
    });
  } catch (err: any) {
    console.error(err.message);
  }
}
searchPortal();
