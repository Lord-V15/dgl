import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import PolaroidCard from './PolaroidCard';

interface Photo {
  id: string;
  filename: string;
  original_name: string;
  caption?: string;
  taken_date?: string;
  created_at: string;
}

export default function PolaroidGallery() {
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photos'],
    queryFn: async () => {
      const { data } = await api.get<Photo[]>('/photos');
      return data;
    },
  });

  const deletePhoto = useMutation({
    mutationFn: (id: string) => api.delete(`/photos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['photos'] }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="font-playfair text-2xl text-ink/40 mb-2">No memories yet</p>
        <p className="font-cormorant text-lg text-ink/30">
          Upload your first photo to begin building your collection.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <PolaroidCard
            src={`/api/photos/file/${photo.filename}`}
            caption={photo.caption}
            date={photo.taken_date}
            index={index}
            onDelete={() => { if (confirm('Delete this memory?')) deletePhoto.mutate(photo.id); }}
            isDeleting={deletePhoto.isPending}
          />
        </motion.div>
      ))}
    </div>
  );
}
