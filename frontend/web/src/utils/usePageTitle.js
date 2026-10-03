import { useEffect } from 'react';
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Mandafia Services` : 'Mandafia Services | Integrated Facility Management';
  }, [title]);
}