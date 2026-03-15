import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MemoriesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/timeline', { replace: true });
  }, [navigate]);

  return null;
}
