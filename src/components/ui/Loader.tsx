import { IonSpinner } from '@ionic/react';

interface LoaderProps {
  message?: string;
}

export function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <IonSpinner name="crescent" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
