import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface SentimentGaugeProps {
  score: number;
  positivas: number;
  neutras: number;
  negativas: number;
}

export function SentimentGauge({ score, positivas, neutras, negativas }: SentimentGaugeProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 3,
          radius: '90%',
          center: ['50%', '75%'],
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.33, '#E54DFF'],
                [0.66, '#FFD700'],
                [1, '#2BD576'],
              ],
            },
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '70%',
            width: 8,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: '#7C4DFF',
              shadowColor: 'rgba(124, 77, 255, 0.5)',
              shadowBlur: 10,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            show: false,
          },
          data: [
            {
              value: score,
            },
          ],
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [score]);

  return (
    <div className="glass-card-hover p-6 h-full">
      <h3 className="text-sm uppercase text-muted-foreground tracking-wider font-medium opacity-60 mb-4">
        Índice de Sentimento Geral
      </h3>
      
      <div ref={chartRef} className="w-full h-48" />
      
      <div className="mt-4 text-center">
        <div className="text-4xl font-bold tabular-nums mb-2">
          {score.toFixed(1)}%
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2BD576]" />
            <span className="text-muted-foreground">
              {positivas} positivas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
            <span className="text-muted-foreground">
              {neutras} neutras
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E54DFF]" />
            <span className="text-muted-foreground">
              {negativas} negativas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
