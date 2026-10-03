import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext.jsx';
export default function useAuth() {
  return useContext(AuthContext);
}