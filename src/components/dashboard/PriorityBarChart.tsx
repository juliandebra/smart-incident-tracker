import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useTheme } from '../../hooks/useTheme';
import type { Incident } from '../../models/incident.model';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriorityBarChartProps {
  incidents: Incident[];
}

export function PriorityBarChart({ incidents }: PriorityBarChartProps) {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  const textColor = isDark ? '#aaaaaa' : '#666666';
  // We only care about active risk (open/in_progress)
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  
  const stats = {
    high: activeIncidents.filter(i => i.priority === 'high').length,
    medium: activeIncidents.filter(i => i.priority === 'medium').length,
    low: activeIncidents.filter(i => i.priority === 'low').length,
  };

  const data = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Active Incidents',
        data: [stats.high, stats.medium, stats.low],
        backgroundColor: [
          'rgba(235, 68, 90, 0.7)',
          'rgba(255, 196, 9, 0.7)',
          'rgba(56, 128, 255, 0.7)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: textColor,
        },
        grid: {
          display: false,
        }
      },
      y: {
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
        <IonCardTitle className="text-base font-semibold">Risk by Priority</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="h-48">
        <Bar data={data} options={options} />
      </IonCardContent>
    </IonCard>
  );
}
