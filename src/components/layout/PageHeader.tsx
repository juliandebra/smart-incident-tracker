import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  defaultHref?: string;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  showBackButton = false, 
  defaultHref = '/app/incidents',
  children 
}: PageHeaderProps) {
  return (
    <IonHeader>
      <IonToolbar color="primary" style={{ '--color': '#ffffff' }}>
        {showBackButton && (
          <IonButtons slot="start">
            <IonBackButton defaultHref={defaultHref} className="text-white" style={{ '--color': '#ffffff' }} />
          </IonButtons>
        )}
        <IonTitle style={{ color: '#ffffff' }}>{title}</IonTitle>
        {children && (
          <IonButtons slot="end" className="text-white" style={{ '--color': '#ffffff' }}>
            {children}
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
}
