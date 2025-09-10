import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle, 
  RefreshCw 
} from "lucide-react"

interface EmailVerificationProps {
  onBack: () => void
  onResendEmail?: () => void
  userEmail?: string
}

export default function EmailVerification({ onBack, onResendEmail, userEmail }: EmailVerificationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Verifica tu correo electrónico</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Hemos enviado un enlace de verificación a tu correo electrónico.
              </p>
              
              {userEmail && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Correo enviado a:</strong><br />
                    {userEmail}
                  </p>
                </div>
              )}

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación para activar tu cuenta.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  También revisa tu carpeta de spam o correos no deseados.
                </p>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    ¿No recibiste el correo?
                  </p>
                  
                  {onResendEmail && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={onResendEmail}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reenviar correo de verificación
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500 mb-3">
                Una vez verificada tu cuenta, podrás acceder a todas las funciones de PetCare
              </p>
              
              <Button onClick={onBack} className="w-full">
                Entendido
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}