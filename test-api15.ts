import axios from 'axios';

async function performSearch() {
  const url = "https://www.data.go.kr/data/15103445/openapi.do";
  try {
     const res = await axios.get(url, {
         headers: {
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
         }
     });
     const html = res.data;
     const lines = html.split('\n');
     for (let i = 0; i < lines.length; i++) {
         if (lines[i].includes('요청변수')) {
             console.log("Found 요청변수 at line", i);
             for(let j=i; j<i+30; j++) {
                 console.log(lines[j].replace(/<[^>]+>/g, '').trim());
             }
         }
         if (lines[i].includes('bgnde') || lines[i].match(/fclty/i)) {
             console.log(lines[i].replace(/<[^>]+>/g, '').trim());
         }
     }
  } catch(e: any) {
    console.error(e.message);
  }
}
performSearch();
