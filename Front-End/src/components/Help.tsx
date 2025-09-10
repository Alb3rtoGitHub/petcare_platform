import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Alert, AlertDescription } from "./ui/alert"
import { 
  ArrowLeft, 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  CreditCard, 
  User, 
  PawPrint, 
  Star, 
  AlertTriangle, 
  HelpCircle, 
  Book, 
  FileText, 
  Send,
  CheckCircle,
  MessageSquare,
  Users,
  Settings,
  Heart
} from "lucide-react"
import { useState } from "react"

interface HelpProps {
  onBack: () => void
}

export default function Help({ onBack }: HelpProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    category: "general",
    subject: "",
    message: ""
  })

  const helpCategories = [
    {
      id: "general",
      title: "General",
      icon: HelpCircle,
      count: 12
    },
    {
      id: "booking",
      title: "Reservas",
      icon: PawPrint,
      count: 8
    },
    {
      id: "payment",
      title: "Pagos",
      icon: CreditCard,
      count: 6
    },
    {
      id: "safety",
      title: "Seguridad",
      icon: Shield,
      count: 5
    },
    {
      id: "account",
      title: "Cuenta",
      icon: User,
      count: 7
    },
    {
      id: "sitter",
      title: "Para Cuidadores",
      icon: Users,
      count: 9
    }
  ]

  const faqsByCategory = {
    general: [
      {
        question: "¿Qué es PetCare y cómo funciona?",
        answer: "PetCare es una plataforma que conecta dueños de mascotas con cuidadores profesionales verificados. Puedes buscar cuidadores en tu área, ver sus perfiles, leer reseñas y reservar servicios como paseos, cuidado en casa, guardería y más. Todo se gestiona de forma segura a través de nuestra plataforma."
      },
      {
        question: "¿En qué ciudades está disponible PetCare?",
        answer: "Actualmente operamos en Madrid, Barcelona, Valencia, Sevilla, Bilbao y Zaragoza. Estamos expandiéndonos constantemente a nuevas ciudades. Si tu ciudad no está disponible aún, puedes suscribirte para ser notificado cuando lancemos en tu área."
      },
      {
        question: "¿Cómo puedo contactar con el servicio al cliente?",
        answer: "Puedes contactarnos a través del chat en vivo disponible 24/7, enviando un email a soporte@petcare.es, llamando al +34 900 123 456, o usando el formulario de contacto en esta página."
      },
      {
        question: "¿PetCare tiene una aplicación móvil?",
        answer: "Sí, tenemos aplicaciones móviles gratuitas disponibles para iOS y Android. Puedes descargarlas desde App Store o Google Play Store buscando 'PetCare España'."
      }
    ],
    booking: [
      {
        question: "¿Cómo hago una reserva?",
        answer: "Para hacer una reserva: 1) Busca cuidadores en tu área, 2) Revisa perfiles y reseñas, 3) Contacta al cuidador para una reunión inicial gratuita, 4) Confirma fechas y servicios, 5) Realiza el pago seguro. ¡Así de fácil!"
      },
      {
        question: "¿Puedo cancelar una reserva?",
        answer: "Sí, puedes cancelar reservas con al menos 24 horas de anticipación para un reembolso completo. Para cancelaciones con menos de 24 horas, se aplica una tarifa del 50%. Cancelaciones de emergencia se evalúan caso por caso."
      },
      {
        question: "¿Qué pasa si el cuidador cancela?",
        answer: "Si un cuidador cancela, te reembolsamos inmediatamente y te ayudamos a encontrar un cuidador alternativo. Si no encuentras reemplazo, el reembolso es completo sin penalizaciones."
      },
      {
        question: "¿Puedo modificar una reserva existente?",
        answer: "Sí, puedes modificar fechas, horarios o servicios contactando directamente al cuidador. Si hay cambios en el precio, se procesará la diferencia automáticamente."
      }
    ],
    payment: [
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express), PayPal, Bizum y transferencias bancarias. Todos los pagos son procesados de forma segura."
      },
      {
        question: "¿Cuándo se cobra el pago?",
        answer: "El pago se procesa cuando confirmas la reserva, pero el dinero se retiene de forma segura y solo se libera al cuidador después de completar el servicio satisfactoriamente."
      },
      {
        question: "¿Puedo obtener un reembolso?",
        answer: "Sí, ofrecemos reembolsos completos para cancelaciones con más de 24 horas de anticipación. También garantizamos reembolso si el servicio no cumple con nuestros estándares de calidad."
      },
      {
        question: "¿Hay tarifas adicionales?",
        answer: "PetCare cobra una comisión de servicio del 10% sobre el precio base. Esta tarifa cubre el procesamiento de pagos, seguro y soporte al cliente. No hay tarifas ocultas."
      }
    ],
    safety: [
      {
        question: "¿Cómo verifican a los cuidadores?",
        answer: "Todos los cuidadores pasan por un proceso riguroso que incluye: verificación de antecedentes penales, verificación de identidad, referencias de trabajos anteriores, entrevista personal y prueba práctica con mascotas."
      },
      {
        question: "¿Qué cobertura de seguro tienen?",
        answer: "Todos los servicios están cubiertos por nuestro seguro de responsabilidad civil de hasta 100,000€. Además, ofrecemos cobertura veterinaria de emergencia de hasta 1,500€ por incidente."
      },
      {
        question: "¿Qué hacer en caso de emergencia?",
        answer: "En emergencias, contacta inmediatamente al cuidador y a nuestro número de emergencia 24/7: +34 900 EMERGENCY. Todos los cuidadores tienen acceso a veterinarios de confianza y protocolos de emergencia."
      },
      {
        question: "¿Puedo conocer al cuidador antes del servicio?",
        answer: "¡Absolutamente! Recomendamos una reunión inicial gratuita donde tu mascota y el cuidador se conocen. Esto asegura compatibilidad y tranquilidad para todos."
      }
    ],
    account: [
      {
        question: "¿Cómo creo una cuenta?",
        answer: "Crear una cuenta es gratuito y fácil. Solo necesitas proporcionar tu email, crear una contraseña y completar tu perfil básico. Puedes registrarte como dueño de mascota, cuidador, o ambos."
      },
      {
        question: "¿Cómo cambio mi contraseña?",
        answer: "Ve a Configuración de Cuenta > Seguridad > Cambiar Contraseña. Introduce tu contraseña actual y la nueva. También puedes usar 'Olvidé mi contraseña' en la página de login."
      },
      {
        question: "¿Puedo eliminar mi cuenta?",
        answer: "Sí, puedes eliminar tu cuenta desde Configuración > Privacidad > Eliminar Cuenta. Ten en cuenta que esta acción es irreversible y elimina todos tus datos permanentemente."
      },
      {
        question: "¿Cómo actualizo mi información personal?",
        answer: "Ve a tu perfil y haz clic en 'Editar'. Puedes actualizar tu información personal, fotos, descripción y configuraciones de privacidad en cualquier momento."
      }
    ],
    sitter: [
      {
        question: "¿Cómo me convierto en cuidador?",
        answer: "Regístrate como cuidador, completa tu perfil detallado, pasa nuestro proceso de verificación (2-3 días), configura tus servicios y precios, y comienza a recibir solicitudes de reserva."
      },
      {
        question: "¿Cuánto puedo ganar como cuidador?",
        answer: "Los cuidadores ganan entre 10-25€ por hora dependiendo del servicio y ubicación. El promedio es 15€/hora. Los cuidadores activos ganan entre 300-800€ al mes trabajando tiempo parcial."
      },
      {
        question: "¿Cuándo recibo mis pagos?",
        answer: "Los pagos se procesan automáticamente 24 horas después de completar cada servicio. Puedes retirar tus ganancias en cualquier momento a tu cuenta bancaria (1-2 días hábiles)."
      },
      {
        question: "¿Puedo rechazar una reserva?",
        answer: "Sí, tienes control total sobre qué reservas aceptar. Sin embargo, mantener una alta tasa de aceptación (>80%) mejora tu visibilidad en las búsquedas."
      }
    ]
  }

  const quickLinks = [
    {
      title: "Guía de Inicio Rápido",
      description: "Aprende lo básico en 5 minutos",
      icon: Book,
      link: "#"
    },
    {
      title: "Política de Seguridad",
      description: "Nuestros estándares de seguridad",
      icon: Shield,
      link: "#"
    },
    {
      title: "Términos de Servicio",
      description: "Términos y condiciones",
      icon: FileText,
      link: "#"
    },
    {
      title: "Centro de Confianza",
      description: "Información sobre verificaciones",
      icon: CheckCircle,
      link: "#"
    }
  ]

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se enviaría el formulario
    alert("Tu mensaje ha sido enviado. Te responderemos en menos de 24 horas.")
    setSupportForm({
      name: "",
      email: "",
      category: "general",
      subject: "",
      message: ""
    })
  }

  const filteredFaqs = faqsByCategory[selectedCategory as keyof typeof faqsByCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl mb-6">Centro de Ayuda</h1>
              <p className="text-xl mb-8 opacity-90">
                ¿Necesitas ayuda? Estamos aquí para ti. Encuentra respuestas rápidas 
                o contacta con nuestro equipo de soporte.
              </p>
              
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5" />
                <Input
                  placeholder="Buscar en ayuda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-gray-900"
                />
              </div>
            </div>
            <div className="hidden md:block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1653212883731-4d5bc66e0181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHN1cHBvcnQlMjB0ZWFtJTIwaGVscGluZ3xlbnwxfHx8fDE3NTY0NDAxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Equipo de soporte"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contacto
            </TabsTrigger>
            <TabsTrigger value="guides">
              <Book className="h-4 w-4 mr-2" />
              Guías
            </TabsTrigger>
            <TabsTrigger value="status">
              <Settings className="h-4 w-4 mr-2" />
              Estado
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {helpCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <category.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="text-sm mb-1">{category.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} artículos
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl mb-6">
                  {helpCategories.find(cat => cat.id === selectedCategory)?.title} - Preguntas Frecuentes
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs?.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFaqs?.length === 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No se encontraron resultados para tu búsqueda. Intenta con otras palabras clave.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg mb-4">Enlaces Útiles</h3>
                <div className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <link.icon className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h4 className="text-sm mb-1">{link.title}</h4>
                            <p className="text-xs text-gray-600">{link.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Methods */}
              <div>
                <h2 className="text-2xl mb-6">Formas de Contacto</h2>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="mb-1">Chat en Vivo</h3>
                          <p className="text-gray-600 text-sm mb-2">Respuesta inmediata</p>
                          <Button size="sm">Iniciar Chat</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="mb-1">Teléfono</h3>
                          <p className="text-gray-600 text-sm mb-2">+34 900 123 456</p>
                          <p className="text-xs text-gray-500">Lunes a Domingo: 8:00 - 22:00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Mail className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="mb-1">Email</h3>
                          <p className="text-gray-600 text-sm mb-2">soporte@petcare.es</p>
                          <p className="text-xs text-gray-500">Respuesta en 2-4 horas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl mb-6">Envíanos un Mensaje</h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm mb-2 block">Nombre</label>
                          <Input
                            value={supportForm.name}
                            onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Email</label>
                          <Input
                            type="email"
                            value={supportForm.email}
                            onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm mb-2 block">Categoría</label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={supportForm.category}
                          onChange={(e) => setSupportForm({...supportForm, category: e.target.value})}
                        >
                          <option value="general">General</option>
                          <option value="booking">Reservas</option>
                          <option value="payment">Pagos</option>
                          <option value="safety">Seguridad</option>
                          <option value="account">Cuenta</option>
                          <option value="sitter">Para Cuidadores</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm mb-2 block">Asunto</label>
                        <Input
                          value={supportForm.subject}
                          onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm mb-2 block">Mensaje</label>
                        <Textarea
                          rows={4}
                          value={supportForm.message}
                          onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                          placeholder="Describe tu consulta o problema..."
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensaje
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-8">
            <h2 className="text-2xl mb-6">Guías y Tutoriales</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <PawPrint className="h-8 w-8 text-primary mb-4" />
                  <h3 className="mb-2">Guía para Dueños</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Aprende cómo encontrar el cuidador perfecto para tu mascota
                  </p>
                  <Button variant="outline" size="sm">Leer Guía</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="mb-2">Guía para Cuidadores</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Todo lo que necesitas saber para ser un cuidador exitoso
                  </p>
                  <Button variant="outline" size="sm">Leer Guía</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="mb-2">Seguridad</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Consejos de seguridad y mejores prácticas
                  </p>
                  <Button variant="outline" size="sm">Leer Guía</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <CreditCard className="h-8 w-8 text-primary mb-4" />
                  <h3 className="mb-2">Pagos y Facturación</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Información sobre pagos, reembolsos y facturación
                  </p>
                  <Button variant="outline" size="sm">Leer Guía</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <MessageCircle className="h-8 w-8 text-primary mb-4" />
                  <h3 className="mb-2">Comunicación</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Cómo comunicarte efectivamente con cuidadores/dueños
                  </p>
                  <Button variant="outline" size="sm">Leer Guía</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Star className="h-8 w-8 text-primary mb-4" />
                  <h3 className="mb-2">Reseñas</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Cómo escribir y recibir reseñas de calidad
                  </p>
                  <Button variant="outline" size="sm">Leer Guía</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-8">
            <h2 className="text-2xl mb-6">Estado del Sistema</h2>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Todos los sistemas operando normalmente. Última actualización: hace 5 minutos.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Servicios Principales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Plataforma Web</span>
                      <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>App Móvil</span>
                      <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Procesamiento de Pagos</span>
                      <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Notificaciones</span>
                      <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mantenimiento Programado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    No hay mantenimiento programado en las próximas 48 horas.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Suscribirse a Actualizaciones
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Emergency Contact */}
      <section className="bg-red-50 border-t border-red-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>¿Emergencia con tu mascota?</strong> Llama inmediatamente al +34 900 EMERGENCY (900 363 743) - Disponible 24/7
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </div>
  )
}