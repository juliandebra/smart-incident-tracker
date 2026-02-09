import { IonIcon } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon = alertCircleOutline 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <IonIcon 
        icon={icon} 
        className="text-6xl text-gray-300 mb-4" 
      />
      <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      )}
    </div>
  );
}
