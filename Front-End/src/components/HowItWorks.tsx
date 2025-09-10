import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Shield, 
  Star, 
  CreditCard, 
  MessageCircle, 
  CheckCircle, 
  Users, 
  Clock, 
  Phone,
  MapPin,
  Heart,
  DollarSign,
  Camera,
  FileText
} from "lucide-react"

interface HowItWorksProps {
  onBack: () => void
}

export default function HowItWorks({ onBack }: HowItWorksProps) {
  const ownerSteps = [
    {
      icon: Search,
      title: "Busca y Compara",
      description: "Explora perfiles de cuidadores verificados en tu área. Compara precios, servicios y reseñas."
    },
    {
      icon: MessageCircle,
      title: "Conecta y Conoce",
      description: "Chatea con cuidadores, haz preguntas y programa una reunión inicial gratuita."
    },
    {
      icon: Calendar,
      title: "Reserva Fácilmente",
      description: "Selecciona fechas, confirma detalles del servicio y realiza el pago seguro."
    },
    {
      icon: Camera,
      title: "Recibe Actualizaciones",
      description: "Obtén fotos, videos y reportes en tiempo real del cuidado de tu mascota."
    }
  ]

  const sitterSteps = [
    {
      icon: FileText,
      title: "Crea tu Perfil",
      description: "Completa tu perfil con experiencia, servicios ofrecidos y disponibilidad."
    },
    {
      icon: Shield,
      title: "Verificación",
      description: "Pasa por nuestro proceso de verificación de antecedentes y referencias."
    },
    {
      icon: Users,
      title: "Conecta con Dueños",
      description: "Recibe solicitudes de dueños de mascotas y programa reuniones iniciales."
    },
    {
      icon: DollarSign,
      title: "Gana Dinero",
      description: "Proporciona servicios de calidad y recibe pagos seguros directamente."
    }
  ]

  const safetyFeatures = [
    {
      icon: Shield,
      title: "Verificación de Antecedentes",
      description: "Todos los cuidadores pasan por verificación exhaustiva"
    },
    {
      icon: Star,
      title: "Sistema de Reseñas",
      description: "Calificaciones y comentarios reales de otros dueños"
    },
    {
      icon: Phone,
      title: "Soporte 24/7",
      description: "Asistencia disponible en todo momento para emergencias"
    },
    {
      icon: CreditCard,
      title: "Pagos Seguros",
      description: "Transacciones protegidas y garantía de reembolso"
    }
  ]

  const faqItems = [
    {
      question: "¿Cómo sé que un cuidador es confiable?",
      answer: "Todos nuestros cuidadores pasan por un riguroso proceso de verificación que incluye verificación de antecedentes, referencias y entrevistas. Además, puedes ver reseñas reales de otros dueños de mascotas."
    },
    {
      question: "¿Qué pasa si hay una emergencia?",
      answer: "Tenemos soporte 24/7 disponible para emergencias. Los cuidadores están capacitados para manejar situaciones de emergencia y tienen acceso directo a veterinarios de confianza."
    },
    {
      question: "¿Cómo funcionan los pagos?",
      answer: "Los pagos se procesan de forma segura a través de nuestra plataforma. Puedes pagar con tarjeta de crédito/débito. El pago se libera al cuidador después de completar el servicio satisfactoriamente."
    },
    {
      question: "¿Puedo cancelar una reserva?",
      answer: "Sí, puedes cancelar reservas con al menos 24 horas de anticipación para un reembolso completo. Para cancelaciones de último minuto, se aplicarán términos específicos."
    },
    {
      question: "¿Qué servicios están disponibles?",
      answer: "Ofrecemos paseos, cuidado en casa, hospedaje nocturno, guardería diurna, administración de medicamentos, y cuidados especiales para mascotas con necesidades específicas."
    },
    {
      question: "¿Cómo me convierto en cuidador?",
      answer: "Simplemente regístrate como cuidador, completa tu perfil, pasa por nuestro proceso de verificación, y comienza a recibir solicitudes de dueños de mascotas en tu área."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl mb-6">¿Cómo Funciona PetCare?</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Conectamos de forma segura y sencilla a dueños de mascotas con cuidadores profesionales. 
              Descubre cómo puedes dar el mejor cuidado a tu mascota o ganar dinero cuidando a otras.
            </p>
          </div>
        </div>
      </section>

      {/* Para Dueños de Mascotas */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Para Dueños de Mascotas</Badge>
            <h2 className="text-3xl mb-4">Encuentra el Cuidado Perfecto</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              En cuatro simples pasos, encuentra y reserva el mejor cuidador para tu mascota
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1553322396-0c9cd410975e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBldCUyMG93bmVyJTIwd2l0aCUyMGRvZ3xlbnwxfHx8fDE3NTYzNTE4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dueño feliz con su mascota"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              {ownerSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Para Cuidadores */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Para Cuidadores</Badge>
            <h2 className="text-3xl mb-4">Gana Dinero Cuidando Mascotas</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convierte tu amor por los animales en una fuente de ingresos flexible
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1 space-y-6">
              {sitterSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1461730117549-4b30953f78a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwZXQlMjBzaXR0ZXIlMjBjYXJpbmclMjBkb2d8ZW58MXx8fHwxNzU2MzUxODA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Cuidador profesional con mascota"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Características de Seguridad */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Seguridad Garantizada</Badge>
            <h2 className="text-3xl mb-4">Tu Tranquilidad es Nuestra Prioridad</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Implementamos múltiples medidas de seguridad para garantizar la mejor experiencia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Reserva Detallado */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Proceso de Reserva Detallado</h2>
            <p className="text-lg text-gray-600">
              Paso a paso, desde la búsqueda hasta la finalización del servicio
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="mb-2">Búsqueda y Filtrado</h3>
                <p className="text-gray-600 mb-3">
                  Utiliza nuestros filtros avanzados para encontrar cuidadores por ubicación, tipo de servicio, precio y disponibilidad.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Por ubicación</Badge>
                  <Badge variant="outline">Por precio</Badge>
                  <Badge variant="outline">Por servicios</Badge>
                  <Badge variant="outline">Por calificación</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="mb-2">Revisión de Perfiles</h3>
                <p className="text-gray-600 mb-3">
                  Revisa perfiles detallados con fotos, experiencia, servicios, reseñas de otros clientes y precios.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Experiencia verificada</Badge>
                  <Badge variant="outline">Reseñas reales</Badge>
                  <Badge variant="outline">Fotos del cuidador</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="mb-2">Reunión Inicial</h3>
                <p className="text-gray-600 mb-3">
                  Programa una reunión gratuita para que tu mascota y el cuidador se conozcan antes del servicio.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Sin costo</Badge>
                  <Badge variant="outline">En tu hogar</Badge>
                  <Badge variant="outline">Sin compromiso</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                4
              </div>
              <div>
                <h3 className="mb-2">Reserva y Pago</h3>
                <p className="text-gray-600 mb-3">
                  Confirma fechas, detalles del servicio y realiza el pago seguro. El dinero se libera después del servicio.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Pago seguro</Badge>
                  <Badge variant="outline">Garantía</Badge>
                  <Badge variant="outline">Fácil cancelación</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="mb-2">Servicio y Seguimiento</h3>
                <p className="text-gray-600 mb-3">
                  Recibe actualizaciones durante el servicio y califica la experiencia al finalizar.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Fotos en vivo</Badge>
                  <Badge variant="outline">Reportes</Badge>
                  <Badge variant="outline">Sistema de calificación</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-gray-600">
              Respuestas a las dudas más comunes sobre PetCare
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-4">¿Listo para Comenzar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a la comunidad PetCare y experimenta el mejor cuidado para mascotas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Heart className="h-5 w-5 mr-2" />
              Buscar Cuidador
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              <DollarSign className="h-5 w-5 mr-2" />
              Convertirse en Cuidador
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}