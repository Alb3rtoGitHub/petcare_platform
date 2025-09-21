import React from 'react';
import { Star } from 'lucide-react';

function ReviewCard({ review }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center">
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-800">{review.ownerName || 'Cliente'}</h4>
        <p className="text-sm text-gray-700">Comentario: {review.comment || 'Sin comentario'}</p>
        <div className="flex items-center gap-2 mt-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold text-gray-700">{review.rating}</span>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;