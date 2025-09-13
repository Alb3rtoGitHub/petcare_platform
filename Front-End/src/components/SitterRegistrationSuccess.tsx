import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  CheckCircle, 
  Clock, 
  Shield, 
  FileText, 
  Mail,
  Home,
  ArrowLeft
} from "lucide-react"

interface SitterRegistrationSuccessProps {
  onGoToDashboard: () => void
  onGoToLanding: () => void
}

export default function SitterRegistrationSuccess({ onGoToDashboard, onGoToLanding }: SitterRegistrationSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        
        <Card className="text-center">
          <CardHeader className="space-y-6 pb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl text-green-700">
                ¡Registro completado exitosamente!
              </CardTitle>
              <p className="text-gray-600">
                Bienvenido a la comunidad de cuidadores de PetCare
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Estado actual */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-amber-600" />
                <h3 className="text-lg font-medium text-amber-800">
                  Verificación en proceso
                </h3>
              </div>
              <p className="text-amber-700 mb-4">
                Tu perfil está siendo revisado por nuestro equipo de seguridad. 
                Este proceso puede tomar entre 24-48 horas.
              </p>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Pendiente de verificación
              </Badge>
            </div>

            {/* Documentos recibidos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Documentos recibidos
              </h3>
              
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-green-800">Documento de identidad</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-green-800">Certificado de antecedentes</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-green-800">Foto de perfil</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>

            {/* Próximos pasos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                Próximos pasos
              </h3>
              
              <div className="text-left space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Verificación de documentos</p>
                    <p className="text-sm text-gray-600">
                      Nuestro equipo revisará todos tus documentos para garantizar la seguridad
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Notificación por email</p>
                    <p className="text-sm text-gray-600">
                      Te enviaremos un correo cuando tu perfil sea aprobado
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">¡Comienza a recibir solicitudes!</p>
                    <p className="text-sm text-gray-600">
                      Una vez aprobado, aparecerás en las búsquedas de los dueños de mascotas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">¿Necesitas ayuda?</span>
              </div>
              <p className="text-sm text-blue-700">
                Si tienes preguntas sobre el proceso de verificación, puedes contactarnos en{" "}
                <span className="font-medium">soporte@petcare.com</span> o a través del chat de ayuda.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onGoToLanding}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
              
              <Button 
                onClick={onGoToDashboard}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir a mi dashboard
              </Button>
            </div>

            {/* Mensaje adicional */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Mientras esperamos la verificación, puedes explorar la plataforma y 
                configurar tu perfil desde el dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}