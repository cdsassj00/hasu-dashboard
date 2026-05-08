import axios from 'axios';
import * as cheerio from 'cheerio';

async function searchPortal() {
  try {
    const res = await axios.get('https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15103445');
    console.log(res.data.substring(0, 1000));
  } catch (err: any) {
    console.error(err.message);
  }
}
searchPortal();
