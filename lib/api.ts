import axios from 'axios';

export interface Facility {
  fcltyMngNo: string; // Region code (loccd)
  fcltyNm: string; // Facility name (locnm)
}

export interface WaterQualityData {
  colctDe: string;
  fcltyMngNo?: string;
  fcltyNm?: string;
  bodIn?: string;
  bodOut?: string;
  codIn?: string;
  codOut?: string;
  ssIn?: string;
  ssOut?: string;
  tnIn?: string;
  tnOut?: string;
  tpIn?: string;
  tpOut?: string;
}

export const fetchFacilities = async (): Promise<Facility[]> => {
  const { data } = await axios.get('/api/facilities', { params: { numOfRows: 1000 } });
  
  if (data?.response?.body?.items?.item) {
    const items = data.response.body.items.item;
    const itemsArray = Array.isArray(items) ? items : [items];
    
    // The API uses loccd for ID and locnm for Name
    return itemsArray.map((item: any) => ({
      fcltyMngNo: String(item.loccd || item.fcltyMngNo || ''),
      fcltyNm: String(item.locnm || item.fcltyNm || '')
    }));
  }
  return [];
};

export const fetchWaterQuality = async (fcltyMngNo: string, stDt: string, edDt: string, fcltyNm?: string): Promise<WaterQualityData[]> => {
  console.log('[fetchWaterQuality] Request Params:', { fcltyMngNo, stDt, edDt, fcltyNm });
  try {
    const { data } = await axios.get('/api/quality', {
      params: {
        fcltyMngNo,
        stDt,
        edDt,
        numOfRows: 1000
      }
    });
    
    console.log('[fetchWaterQuality] Raw Response Data:', data?.response?.body || data);
    
    if (data?.response?.body?.items?.item) {
      const items = data.response.body.items.item;
      const itemsArray = Array.isArray(items) ? items : [items];
      
      console.log(`[fetchWaterQuality] Found ${itemsArray.length} items`);
      
      let mapped = itemsArray.map((item: any) => ({
        colctDe: String(item.wqdt || item.colctDe || '').replace(/-/g, ''), // Ensure YYYYMMDD format for chartData parsing
        fcltyMngNo: String(item.loccd || fcltyMngNo),
        fcltyNm: String(item.locnm || ''),
        bodIn: String(item.uBod || item.bodIn || ''),
        bodOut: String(item.bBod || item.bodOut || ''),
        codIn: String(item.uCod || item.codIn || ''),
        codOut: String(item.bCod || item.codOut || ''),
        ssIn: String(item.uSs || item.ssIn || ''),
        ssOut: String(item.bSs || item.ssOut || ''),
        tnIn: String(item.uTn || item.tnIn || ''),
        tnOut: String(item.bTn || item.tnOut || ''),
        tpIn: String(item.uTp || item.tpIn || ''),
        tpOut: String(item.bTp || item.tpOut || '')
      }));

      if (fcltyNm) {
        mapped = mapped.filter((d: WaterQualityData) => d.fcltyNm === fcltyNm);
        console.log(`[fetchWaterQuality] Filtered items down to ${mapped.length} by fcltyNm: ${fcltyNm}`);
      }
      
      return mapped;
    } else {
      console.log('[fetchWaterQuality] No items found in response payload');
    }
  } catch (error) {
    console.error('[fetchWaterQuality] API Error:', error);
  }
  return [];
};
