import { useEffect } from 'react';
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Pulizia FM Services` : 'Pulizia FM Services | Integrated Facility Management';
  }, [title]);
}