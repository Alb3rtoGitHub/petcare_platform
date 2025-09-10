import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  CheckCircle,
  X,
  User
} from "lucide-react"

interface Rating {
  id: string
  bookingId: string
  fromUserId: string
  toUserId: string
  fromUserName: string
  fromUserImage?: string
  toUserName: string
  toUserImage?: string
  rating: number
  comment: string
  categories: {
    communication: number
    punctuality: number
    careQuality: number
    cleanliness: number
    overall: number
  }
  createdAt: string
  helpful: number
  notHelpful: number
  userReaction?: 'helpful' | 'notHelpful' | null
}

interface BookingForRating {
  id: string
  service: string
  date: string
  sitterName: string
  sitterImage?: string
  ownerName: string
  ownerImage?: string
  petNames: string[]
  completed: boolean
  canRate: boolean
  userType: 'owner' | 'sitter'
}

interface RatingFormProps {
  booking: BookingForRating
  onSubmit: (rating: Omit<Rating, 'id' | 'createdAt' | 'helpful' | 'notHelpful'>) => void
  onCancel: () => void
}

interface RatingDisplayProps {
  ratings: Rating[]
  onReaction?: (ratingId: string, reaction: 'helpful' | 'notHelpful') => void
}

interface RatingStarsProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
}

// Componente para mostrar estrellas interactivas
export function RatingStars({ rating, onRatingChange, size = 'md', readOnly = false }: RatingStarsProps) {
  const [hoveredRating, setHoveredRating] = useState(0)
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }
  
  const handleStarClick = (starRating: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(starRating)
    }
  }
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            (hoveredRating || rating) >= star
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          } ${!readOnly ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => !readOnly && setHoveredRating(star)}
          onMouseLeave={() => !readOnly && setHoveredRating(0)}
        />
      ))}
    </div>
  )
}

// Formulario para crear una calificación
export function RatingForm({ booking, onSubmit, onCancel }: RatingFormProps) {
  const [overallRating, setOverallRating] = useState(0)
  const [categories, setCategories] = useState({
    communication: 0,
    punctuality: 0,
    careQuality: 0,
    cleanliness: 0,
    overall: 0
  })
  const [comment, setComment] = useState("")
  
  const categoryLabels = {
    communication: 'Comunicación',
    punctuality: 'Puntualidad',
    careQuality: 'Calidad del cuidado',
    cleanliness: 'Limpieza',
    overall: 'Experiencia general'
  }
  
  const isFormValid = overallRating > 0 && Object.values(categories).every(rating => rating > 0)
  
  const handleCategoryRating = (category: keyof typeof categories, rating: number) => {
    setCategories(prev => ({ ...prev, [category]: rating }))
  }
  
  const handleSubmit = () => {
    if (!isFormValid) return
    
    const targetUser = booking.userType === 'owner' 
      ? { id: 'sitter-id', name: booking.sitterName, image: booking.sitterImage }
      : { id: 'owner-id', name: booking.ownerName, image: booking.ownerImage }
    
    const fromUser = booking.userType === 'owner'
      ? { id: 'owner-id', name: booking.ownerName, image: booking.ownerImage }
      : { id: 'sitter-id', name: booking.sitterName, image: booking.sitterImage }
    
    onSubmit({
      bookingId: booking.id,
      fromUserId: fromUser.id,
      toUserId: targetUser.id,
      fromUserName: fromUser.name,
      fromUserImage: fromUser.image,
      toUserName: targetUser.name,
      toUserImage: targetUser.image,
      rating: overallRating,
      comment,
      categories: { ...categories, overall: overallRating }
    })
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Star className="h-6 w-6 text-yellow-400" />
          Calificar servicio
        </CardTitle>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>{booking.service}</span>
          <span>•</span>
          <span>{booking.date}</span>
          <span>•</span>
          <span>{booking.petNames.join(', ')}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Usuario a calificar */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <ImageWithFallback
            src={booking.userType === 'owner' ? booking.sitterImage : booking.ownerImage}
            alt={booking.userType === 'owner' ? booking.sitterName : booking.ownerName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-medium">
              Calificando a {booking.userType === 'owner' ? booking.sitterName : booking.ownerName}
            </h4>
            <p className="text-sm text-gray-600">
              {booking.userType === 'owner' ? 'Cuidador' : 'Dueño de mascota'}
            </p>
          </div>
        </div>
        
        {/* Calificación general */}
        <div>
          <Label className="text-base font-medium mb-3 block">Calificación general</Label>
          <div className="flex items-center gap-3">
            <RatingStars
              rating={overallRating}
              onRatingChange={setOverallRating}
              size="lg"
            />
            <span className="text-lg font-medium">
              {overallRating > 0 ? `${overallRating}/5` : 'Sin calificar'}
            </span>
          </div>
        </div>
        
        {/* Calificaciones por categoría */}
        <div>
          <Label className="text-base font-medium mb-3 block">Calificación detallada</Label>
          <div className="grid gap-4">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium">{label}</span>
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={categories[key as keyof typeof categories]}
                    onRatingChange={(rating) => handleCategoryRating(key as keyof typeof categories, rating)}
                  />
                  <span className="text-sm text-gray-600 w-8">
                    {categories[key as keyof typeof categories] || '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Comentario */}
        <div>
          <Label htmlFor="comment" className="text-base font-medium mb-3 block">
            Comentario (opcional)
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con otros usuarios..."
            rows={4}
          />
        </div>
        
        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={!isFormValid} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Enviar calificación
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para mostrar calificaciones
export function RatingDisplay({ ratings, onReaction }: RatingDisplayProps) {
  const handleReaction = (ratingId: string, reaction: 'helpful' | 'notHelpful') => {
    if (onReaction) {
      onReaction(ratingId, reaction)
    }
  }
  
  if (ratings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <p>No hay calificaciones aún</p>
        <p className="text-sm">Sé el primero en compartir tu experiencia</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <Card key={rating.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <ImageWithFallback
                src={rating.fromUserImage}
                alt={rating.fromUserName}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{rating.fromUserName}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(rating.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rating.rating} readOnly />
                    <span className="font-medium">{rating.rating}/5</span>
                  </div>
                </div>
                
                {/* Calificaciones detalladas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Comunicación</p>
                    <div className="flex justify-center">
                      <RatingStars rating={rating.categories.communication} size="sm" readOnly />
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Puntualidad</p>
                    <div className="flex justify-center">
                      <RatingStars rating={rating.categories.punctuality} size="sm" readOnly />
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Cuidado</p>
                    <div className="flex justify-center">
                      <RatingStars rating={rating.categories.careQuality} size="sm" readOnly />
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-gray-600">Limpieza</p>
                    <div className="flex justify-center">
                      <RatingStars rating={rating.categories.cleanliness} size="sm" readOnly />
                    </div>
                  </div>
                </div>
                
                {rating.comment && (
                  <p className="text-gray-700 mb-3">{rating.comment}</p>
                )}
                
                {/* Botones de reacción */}
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => handleReaction(rating.id, 'helpful')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      rating.userReaction === 'helpful'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    Útil ({rating.helpful})
                  </button>
                  <button
                    onClick={() => handleReaction(rating.id, 'notHelpful')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      rating.userReaction === 'notHelpful'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsDown className="h-3 w-3" />
                    No útil ({rating.notHelpful})
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Componente principal del sistema de calificaciones
interface RatingSystemProps {
  bookingsToRate: BookingForRating[]
  ratings: Rating[]
  onSubmitRating: (rating: Omit<Rating, 'id' | 'createdAt' | 'helpful' | 'notHelpful'>) => void
  onReaction?: (ratingId: string, reaction: 'helpful' | 'notHelpful') => void
}

export default function RatingSystem({ 
  bookingsToRate, 
  ratings, 
  onSubmitRating, 
  onReaction 
}: RatingSystemProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingForRating | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  const handleRatingSubmit = (rating: Omit<Rating, 'id' | 'createdAt' | 'helpful' | 'notHelpful'>) => {
    onSubmitRating(rating)
    setShowForm(false)
    setSelectedBooking(null)
  }
  
  return (
    <div className="space-y-6">
      {/* Servicios pendientes de calificar */}
      {bookingsToRate.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Servicios pendientes de calificar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookingsToRate.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={booking.userType === 'owner' ? booking.sitterImage : booking.ownerImage}
                      alt={booking.userType === 'owner' ? booking.sitterName : booking.ownerName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{booking.service}</p>
                      <p className="text-sm text-gray-600">
                        {booking.userType === 'owner' ? booking.sitterName : booking.ownerName} • {booking.date}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking)
                      setShowForm(true)
                    }}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Calificar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Formulario de calificación */}
      {showForm && selectedBooking && (
        <RatingForm
          booking={selectedBooking}
          onSubmit={handleRatingSubmit}
          onCancel={() => {
            setShowForm(false)
            setSelectedBooking(null)
          }}
        />
      )}
      
      {/* Calificaciones existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Calificaciones y reseñas</CardTitle>
        </CardHeader>
        <CardContent>
          <RatingDisplay ratings={ratings} onReaction={onReaction} />
        </CardContent>
      </Card>
    </div>
  )
}