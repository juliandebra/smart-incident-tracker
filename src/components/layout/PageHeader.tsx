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
      <IonToolbar>
        {showBackButton && (
          <IonButtons slot="start">
            <IonBackButton defaultHref={defaultHref} />
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
        {children && (
          <IonButtons slot="end">
            {children}
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
}
