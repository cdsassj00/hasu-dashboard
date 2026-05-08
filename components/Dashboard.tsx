import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays, parse, isValid } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchFacilities, fetchWaterQuality, Facility, WaterQualityData } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Droplet, Calendar as CalendarIcon, Filter, AlertCircle, Database } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Mock data generator for testing visualization
const generateMockData = (startDate: Date, endDate: Date): WaterQualityData[] => {
  const data: WaterQualityData[] = [];
  let currentDate = new Date(startDate.getTime()); // Clone the date to prevent mutating component state
  const targetEndDate = new Date(endDate.getTime());
  
  while (currentDate <= targetEndDate) {
    data.push({
      colctDe: format(currentDate, 'yyyyMMdd'),
      bodIn: (Math.random() * 50 + 100).toFixed(1),
      bodOut: (Math.random() * 5 + 2).toFixed(1),
      codIn: (Math.random() * 60 + 120).toFixed(1),
      codOut: (Math.random() * 8 + 5).toFixed(1),
      ssIn: (Math.random() * 40 + 80).toFixed(1),
      ssOut: (Math.random() * 4 + 2).toFixed(1),
      tnIn: (Math.random() * 20 + 30).toFixed(1),
      tnOut: (Math.random() * 5 + 5).toFixed(1),
      tpIn: (Math.random() * 5 + 5).toFixed(1),
      tpOut: (Math.random() * 1 + 0.5).toFixed(1),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

export default function Dashboard() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [waterData, setWaterData] = useState<WaterQualityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useMockData, setUseMockData] = useState(false);

  // Date range state
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const stDt = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(subDays(new Date(), 30), 'yyyy-MM-dd');
  const edDt = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await fetchFacilities();
        
        // Remove duplicates and invalid entries to prevent React key warnings and Radix Select errors
        const uniqueData = Array.from(new Map(data.filter(d => d?.fcltyNm).map(item => [item.fcltyNm, item])).values());
        
        setFacilities(uniqueData as Facility[]);
        if (uniqueData.length > 0) {
          setSelectedFacility((uniqueData[0] as Facility).fcltyNm);
        }
      } catch (err) {
        console.error("Failed to load facilities", err);
        setError("처리시설 목록을 불러올 수 없습니다.");
      }
    };
    loadFacilities();
  }, []);

  useEffect(() => {
    if (!selectedFacility) return;

    const loadData = async () => {
      setLoading(true);
      setError('');
      
      if (useMockData) {
        // Use mock data
        setTimeout(() => {
           setWaterData(generateMockData(dateRange.from, dateRange.to || dateRange.from).reverse());
           setLoading(false);
        }, 800);
        return;
      }
      
      try {
        const selectedObj = facilities.find(f => f.fcltyNm === selectedFacility);
        if (!selectedObj) return;

        const data = await fetchWaterQuality(selectedObj.fcltyMngNo, stDt, edDt, selectedObj.fcltyNm);
        setWaterData(data.reverse()); // Reverse to chronological order if the API returns newest first
      } catch (err) {
        console.error("Failed to load water quality data", err);
        setError("수질 데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedFacility, stDt, edDt, useMockData]);

  const chartData = useMemo(() => {
    return waterData.map(d => ({
      ...d,
      dateFormatted: d.colctDe ? format(parse(d.colctDe, 'yyyyMMdd', new Date()), 'MM-dd') : '',
      bodInNum: Number(d.bodIn || 0),
      bodOutNum: Number(d.bodOut || 0),
      codInNum: Number(d.codIn || 0),
      codOutNum: Number(d.codOut || 0),
      ssInNum: Number(d.ssIn || 0),
      ssOutNum: Number(d.ssOut || 0),
      tnInNum: Number(d.tnIn || 0),
      tnOutNum: Number(d.tnOut || 0),
      tpInNum: Number(d.tpIn || 0),
      tpOutNum: Number(d.tpOut || 0)
    }));
  }, [waterData]);

  const latestStats = chartData.length > 0 ? chartData[chartData.length - 1] : null;

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
                하수처리장 수질 모니터링
              </h1>
              {useMockData && (
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                  <Database className="w-3 h-3 mr-1" />
                  샘플 데이터 모드
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              한국수자원공사 위탁운영 하수처리장 일일 수질 데이터
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseMockData(!useMockData)}
              className={cn("whitespace-nowrap transition-colors", useMockData ? "border-amber-400 text-amber-600 hover:bg-amber-50 hover:text-amber-700" : "")}
            >
              {useMockData ? "실제 데이터 보기" : "샘플 데이터로 체험하기"}
            </Button>
            
            <Popover>
              <PopoverTrigger 
                id="date"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full sm:w-[260px] justify-start text-left font-normal bg-muted border-none",
                  !dateRange && "text-muted-foreground"
                )}
              >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "yyyy-MM-dd")} ~ {format(dateRange.to, "yyyy-MM-dd")}
                      </>
                    ) : (
                      format(dateRange.from, "yyyy-MM-dd")
                    )
                  ) : (
                    <span>날짜 선택</span>
                  )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={{from: dateRange.from, to: dateRange.to}}
                  onSelect={(range: any) => setDateRange(range || { from: new Date(), to: new Date() })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center w-full sm:w-auto bg-muted p-1 px-3 rounded-md min-h-[40px]">
              <Filter className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
              {facilities.length > 0 ? (
                <Select value={selectedFacility || undefined} onValueChange={setSelectedFacility}>
                  <SelectTrigger className="w-full sm:w-[180px] border-none shadow-none bg-transparent focus:ring-0 p-0 h-auto">
                    <SelectValue placeholder="처리시설 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map(f => (
                      <SelectItem key={f.fcltyNm} value={f.fcltyNm}>
                        {f.fcltyNm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">
                  시설 로드중...
                </div>
              )}
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20 flex items-center">
             <AlertCircle className="w-5 h-5 mr-2" />
             {error}
          </div>
        )}
        
        {!useMockData && waterData.length === 0 && !loading && !error && (
          <div className="bg-muted p-6 rounded-md border text-center space-y-3">
             <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
             <p className="font-medium text-foreground">API로 조회된 데이터가 없습니다.</p>
             <p className="text-sm text-muted-foreground">공공데이터포털 API에서 해당 시설 및 조회 기간의 수질 기록을 반환하지 않았습니다.<br/>기간을 변경하거나 우측 상단의 <strong>샘플 데이터로 체험하기</strong> 버튼을 눌러 디자인을 확인하세요.</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="font-serif italic text-xs uppercase tracking-wider">최근 측정일</CardDescription>
              <CardTitle className="text-2xl font-mono">
                {loading ? <Skeleton className="h-8 w-24" /> : (latestStats?.dateFormatted || '-')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                YYYY-MM-DD
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="font-serif italic text-xs uppercase tracking-wider">BOD 방류수 (mg/L)</CardDescription>
              <CardTitle className="text-2xl font-mono">
                {loading ? <Skeleton className="h-8 w-16" /> : (latestStats?.bodOutNum || '-')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <Droplet className="w-3 h-3 mr-1" />
                유입: {latestStats?.bodInNum || '-'}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="font-serif italic text-xs uppercase tracking-wider">COD 방류수 (mg/L)</CardDescription>
              <CardTitle className="text-2xl font-mono">
                {loading ? <Skeleton className="h-8 w-16" /> : (latestStats?.codOutNum || '-')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                유입: {latestStats?.codInNum || '-'}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="font-serif italic text-xs uppercase tracking-wider">SS 방류수 (mg/L)</CardDescription>
              <CardTitle className="text-2xl font-mono">
                {loading ? <Skeleton className="h-8 w-16" /> : (latestStats?.ssOutNum || '-')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <Droplet className="w-3 h-3 mr-1" />
                유입: {latestStats?.ssInNum || '-'}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="font-serif italic text-xs uppercase tracking-wider">T-N 방류수 (mg/L)</CardDescription>
              <CardTitle className="text-2xl font-mono">
                {loading ? <Skeleton className="h-8 w-16" /> : (latestStats?.tnOutNum || '-')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <Droplet className="w-3 h-3 mr-1" />
                유입: {latestStats?.tnInNum || '-'}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription className="font-serif italic text-xs uppercase tracking-wider">T-P 방류수 (mg/L)</CardDescription>
              <CardTitle className="text-2xl font-mono">
                {loading ? <Skeleton className="h-8 w-16" /> : (latestStats?.tpOutNum || '-')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <Droplet className="w-3 h-3 mr-1" />
                유입: {latestStats?.tpInNum || '-'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>수질 변화 추이 (최근 30일)</CardTitle>
              <CardDescription>BOD 및 COD 방류수 농도 변화</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="dateFormatted" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                        itemStyle={{ fontFamily: 'var(--font-mono)' }}
                      />
                      <Legend iconType="circle" />
                      <Line type="monotone" name="BOD 방류" dataKey="bodOutNum" stroke="#ff4e00" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" name="COD 방류" dataKey="codOutNum" stroke="#000000" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>상세 수치 기록</CardTitle>
              <CardDescription>일일 유입/방류 데이터</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative">
              <div className="absolute inset-0 overflow-auto">
                <div className="sticky top-0 bg-background/95 backdrop-blur z-10 grid grid-cols-3 p-3 border-b border-border">
                  <div className="col-header">날짜</div>
                  <div className="col-header text-right">BOD (Out)</div>
                  <div className="col-header text-right">COD (Out)</div>
                </div>
                {loading ? (
                  <div className="p-4 space-y-2">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : chartData.length > 0 ? (
                  <div className="flex flex-col">
                    {[...chartData].reverse().map((row, idx) => (
                      <div key={idx} className="grid grid-cols-3 p-3 border-b border-border hover:bg-muted transition-colors items-center">
                        <div className="data-value text-sm text-muted-foreground">{row.dateFormatted}</div>
                        <div className="data-value font-medium text-right">{row.bodOutNum}</div>
                        <div className="data-value font-medium text-right">{row.codOutNum}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    데이터가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
