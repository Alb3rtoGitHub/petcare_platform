import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  MapPin, 
  Star, 
  Clock, 
  Shield, 
  Heart, 
  PawPrint, 
  Settings, 
  Phone, 
  Mail, 
  Navigation, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  FileText 
} from "lucide-react"

interface LandingPageProps {
  onUserTypeChange: (type: 'owner' | 'sitter' | 'admin') => void
  onSearchSitters: () => void
  onViewServices?: () => void
  onViewHowItWorks?: () => void
  onShowLogin?: () => void
  onShowRegister?: () => void
}

export default function LandingPage(props: LandingPageProps) {
  const featuredSitters = [
    {
      id: 1,
      name: "María González",
      location: "Madrid Centro",
      rating: 4.9,
      reviews: 127,
      services: ["Paseos", "Cuidado en casa", "Visitas"],
      price: "15€/hora",
      image: "https://images.unsplash.com/photo-1559198837-e3d443d28c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0ZXIlMjBwbGF5aW5nJTIwY2F0fGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl text-gray-900 mb-6">
              El mejor cuidado para tu mascota
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conectamos dueños de mascotas con cuidadores profesionales y confiables. 
              Selecciona tu perfil para comenzar y acceder a tu cuenta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
              <Card className="w-full sm:w-80 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => props.onUserTypeChange('owner')}>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PawPrint className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl mb-2">Soy Dueño</h3>
                  <p className="text-gray-600 text-sm">Busco cuidadores para mi mascota</p>
                </CardContent>
              </Card>

              <Card className="w-full sm:w-80 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => props.onUserTypeChange('sitter')}>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl mb-2">Soy Cuidador</h3>
                  <p className="text-gray-600 text-sm">Ofrezco servicios de cuidado</p>
                </CardContent>
              </Card>

              <Card className="w-full sm:w-80 hover:shadow-lg transition-shadow cursor-pointer" onClick={props.onShowRegister}>
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl mb-2">Quiero Registrarme</h3>
                  <p className="text-gray-600 text-sm">Únete a nuestra plataforma como cuidador o dueño</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">¿Por qué elegir PetCare?</h2>
            <p className="text-lg text-gray-600 mb-4">Cuidado profesional y confiable para tu mascota</p>
            {props.onViewHowItWorks && (
              <Button variant="outline" onClick={props.onViewHowItWorks}>
                Descubre Cómo Funciona
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center cursor-pointer hover:transform hover:scale-105 transition-all duration-200" onClick={props.onShowRegister}>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl mb-2">Quiero Registrarme</h3>
              <p className="text-gray-600">Únete a nuestra comunidad y comienza a brindar o solicitar servicios de cuidado de mascotas.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl mb-2">Disponibilidad 24/7</h3>
              <p className="text-gray-600">Encuentra cuidadores disponibles cuando los necesites, incluso en emergencias.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl mb-2">Amor Genuino</h3>
              <p className="text-gray-600">Cuidadores apasionados que aman a los animales tanto como tú.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">Cuidadores Destacados</h2>
            <p className="text-lg text-gray-600">Conoce algunos de nuestros mejores cuidadores</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredSitters.map((sitter) => (
              <Card key={sitter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <ImageWithFallback
                    src={sitter.image}
                    alt={sitter.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{sitter.name}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {sitter.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm">{sitter.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">({sitter.reviews} reseñas)</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {sitter.services.map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-primary">{sitter.price}</span>
                    <Button size="sm">Ver Perfil</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" onClick={props.onSearchSitters}>
              Ver Todos los Cuidadores
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl">PetCare</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Conectamos dueños de mascotas con cuidadores profesionales y confiables. 
                Tu mascota merece el mejor cuidado cuando no puedes estar con ella.
              </p>
              {props.onShowRegister && (
                <Button variant="secondary" size="sm" onClick={props.onShowRegister} className="mt-4">
                  Quiero Registrarme
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">+34 900 123 456</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">info@petcare.es</span>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="h-4 w-4 text-blue-400 mt-1" />
                  <div className="text-gray-300 text-sm">
                    <p>Calle Gran Vía, 123</p>
                    <p>28013 Madrid, España</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg">Cómo Funciona</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mt-0.5">1</div>
                  <p className="text-gray-300 text-sm">Regístrate y crea tu perfil</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mt-0.5">2</div>
                  <p className="text-gray-300 text-sm">Busca y conecta con cuidadores</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mt-0.5">3</div>
                  <p className="text-gray-300 text-sm">Reserva y disfruta del servicio</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg">Nuestra Ubicación</h4>
              
              <div className="bg-gray-800 rounded-lg p-4 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs">Madrid, España</p>
                  <p className="text-gray-500 text-xs">Ver en Google Maps</p>
                </div>
              </div>

              <div>
                <h5 className="text-sm mb-3">Síguenos</h5>
                <div className="flex gap-3">
                  <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Facebook className="h-4 w-4 text-blue-400" />
                  </a>
                  <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Instagram className="h-4 w-4 text-pink-400" />
                  </a>
                  <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Twitter className="h-4 w-4 text-blue-400" />
                  </a>
                  <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Linkedin className="h-4 w-4 text-blue-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 PetCare. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}