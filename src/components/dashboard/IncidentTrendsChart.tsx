import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';
import { useTheme } from '../../hooks/useTheme';
import type { Incident } from '../../models/incident.model';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface IncidentTrendsChartProps {
  incidents: Incident[];
}

export function IncidentTrendsChart({ incidents }: IncidentTrendsChartProps) {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  const textColor = isDark ? '#aaaaaa' : '#666666';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  // Generate last 7 days labels
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date,
      label: format(date, 'MMM dd'),
      count: 0
    };
  });

  // Count incidents per day
  incidents.forEach(incident => {
    const incidentDate = new Date(incident.created_at);
    const day = last7Days.find(d => 
      startOfDay(d.date).getTime() === startOfDay(incidentDate).getTime()
    );
    if (day) day.count++;
  });

  const data = {
    labels: last7Days.map(d => d.label),
    datasets: [
      {
        fill: true,
        label: 'New Incidents',
        data: last7Days.map(d => d.count),
        borderColor: 'rgba(56, 128, 255, 1)',
        backgroundColor: 'rgba(56, 128, 255, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(56, 128, 255, 1)',
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: textColor,
        },
        grid: {
          color: gridColor,
        }
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          display: false,
        }
      }
    },
  };

  return (
    <IonCard className="m-0">
      <IonCardHeader>
        <IonCardTitle className="text-base font-semibold">Incident Trends</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="h-64">
        <Line data={data} options={options} />
      </IonCardContent>
    </IonCard>
  );
}
