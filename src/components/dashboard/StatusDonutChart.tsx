import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useTheme } from '../../hooks/useTheme';
import { settingsService } from '../../services/settings.service';
import type { Incident } from '../../models/incident.model';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusDonutChartProps {
  incidents: Incident[];
}

export function StatusDonutChart({ incidents }: StatusDonutChartProps) {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  const textColor = isDark ? '#ffffff' : '#666666';
  const stats = {
    open: incidents.filter(i => i.status === 'open').length,
    inProgress: incidents.filter(i => i.status === 'in_progress').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
  };

  const data = {
    labels: ['Open', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [stats.open, stats.inProgress, stats.resolved],
        backgroundColor: [
          'rgba(235, 68, 90, 0.8)',   // semantic red
          'rgba(255, 196, 9, 0.8)',   // semantic yellow
          'rgba(45, 211, 111, 0.8)',  // semantic green
        ],
        borderColor: [
          'rgba(235, 68, 90, 1)',
          'rgba(255, 196, 9, 1)',
          'rgba(45, 211, 111, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: textColor,
          font: {
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <IonCard className="m-0">
      <IonCardHeader>
        <IonCardTitle className="text-base font-semibold">System Health</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="h-64">
        <Doughnut data={data} options={options} />
      </IonCardContent>
    </IonCard>
  );
}
