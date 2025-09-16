import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye, EyeOff, User, Mail, AlertCircle, X } from 'lucide-react';

const PetOwnerRegistration = ({ 
  startStep = 1,
  initialUserType = null,
  tokenInfo = null 
  }) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pets, setPets] = useState([{ id: 1 }]);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [userType, setUserType] = useState(() => {
    console.log('🔄 INICIALIZANDO userType...')
    if (initialUserType) {
      console.log('   ✅ Usando initialUserType:', initialUserType)
      return initialUserType;
    }
    
    console.log('   🔍 No hay initialUserType, usando fallback');
    return 'caregiver';
  });

  const [formData, setFormData] = useState({
    // Paso 1 - Información Personal
    userType: userType,
    firstName: tokenInfo?.name || '',
    lastName: '',
    email: tokenInfo?.email || '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
    city: '',
    address: '',
    acceptTerms: false,
    acceptMarketing: false,
    
    // Paso 2 - Información específica según tipo de usuario
    // Para cuidadores
    experience: '',
    profileDescription: '',
    services: {
      walks: false,
      homeCare: false
    },
    
    // Para dueños de mascotas
    pets: [
      {
        id: 1,
        name: '',
        type: '',
        size: '',
        age: '',
        specialNeeds: ''
      }
    ],
  });

  // Función para simular el envío del email
  const sendVerificationEmail = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email de verificación enviado a: ${email}`);
        resolve(true);
      }, 1000);
    });
  };

  // Función para manejar el envío del paso 1
  const handleStep1Submit = async () => {
    const errors = [];
    
    if (!formData.firstName.trim()) errors.push('El nombre es obligatorio');
    if (!formData.lastName.trim()) errors.push('El apellido es obligatorio');
    if (!formData.email.trim()) errors.push('El email es obligatorio');
    if (!formData.phone.trim()) errors.push('El teléfono es obligatorio');
    if (!formData.password.trim()) errors.push('La contraseña es obligatoria');
    if (!formData.confirmPassword.trim()) errors.push('Confirma tu contraseña');
    if (formData.password !== formData.confirmPassword) errors.push('Las contraseñas no coinciden');
    if (!formData.country.trim()) errors.push('El país es obligatorio');
    if (!formData.state.trim()) errors.push('El estado/provincia es obligatorio');
    if (!formData.city.trim()) errors.push('La ciudad es obligatoria');
    if (!formData.address.trim()) errors.push('La dirección es obligatoria');
    if (!formData.acceptTerms) errors.push('Debes aceptar los Términos y Condiciones');
    if (!formData.acceptMarketing) errors.push('Debes aceptar recibir comunicaciones de marketing y promociones');
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    
    try {
      await sendVerificationEmail(formData.email);
      setEmailVerificationSent(true);
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
      alert('Hubo un error al enviar el email de verificación. Por favor, inténtalo de nuevo.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (service, checked) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: checked
      }
    }));
  };

  const handlePetChange = (petId, field, value) => {
    setFormData(prev => ({
      ...prev,
      pets: prev.pets.map(pet => 
        pet.id === petId ? { ...pet, [field]: value } : pet
      )
    }));
  };

  const addPet = () => {
    const newPetId = Math.max(...pets.map(p => p.id)) + 1;
    setPets(prev => [...prev, { id: newPetId }]);
    setFormData(prev => ({
      ...prev,
      pets: [...prev.pets, {
        id: newPetId,
        name: '',
        type: '',
        breed: '',
        age: '',
        weight: '',
        specialNeeds: ''
      }]
    }));
  };

  const validateStep1 = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'password', 'confirmPassword', 'country', 'state', 'city', 'address'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        return false;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return false;
    }

    if (!formData.acceptTerms) {
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (formData.userType === 'caregiver') {
      if (!formData.experience.trim()) {
        alert('La experiencia con mascotas es obligatoria');
        return false;
      }
      if (!formData.profileDescription.trim()) {
        alert('La descripción del perfil es obligatoria');
        return false;
      }
      
      const hasService = Object.values(formData.services).some(service => service);
      if (!hasService) {
        alert('Debes seleccionar al menos un servicio que ofrezcas');
        return false;
      }
    } else {
      for (let pet of formData.pets) {
        if (!pet.name || pet.name.trim() === '' || !pet.type || pet.type.trim() === '') {
          return false;
        }
      }
    }  
    return true;
  };

  const nextStep = () => {
    let canProceed = false;
    
    if (currentStep === 1) {
      canProceed = validateStep1();
      if (canProceed) {
        handleStep1Submit();
        return;
      } else {
        alert('Por favor completa todos los campos obligatorios marcados con *');
      }
    } else if (currentStep === 2) {
      canProceed = validateStep2();
      if (!canProceed) {
        if (formData.userType === 'caregiver') {
          alert('Por favor completa todos los campos obligatorios');
        } else {
          alert('Por favor completa el nombre y tipo de todas tus mascotas');
        }
        return;
      }
    }
    
    if (canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      if (formData.userType === 'caregiver') {
        alert('¡Cuenta de cuidador creada exitosamente!');
      } else {
        alert('¡Cuenta creada exitosamente!');
      }
    }
  };

  const countries = ['México', 'Argentina', 'Colombia', 'España', 'Chile', 'Perú'];
  const petTypes = ['Perro', 'Gato', 'Ave', 'Conejo', 'Hamster', 'Otro'];
  
  const countryData = {
    'México': {
      states: ['Ciudad de México', 'Jalisco', 'Nuevo León', 'Estado de México', 'Yucatán', 'Veracruz'],
      cities: {
        'Ciudad de México': ['Ciudad de México', 'Tlalpan', 'Coyoacán', 'Benito Juárez'],
        'Jalisco': ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá'],
        'Nuevo León': ['Monterrey', 'San Nicolás', 'Guadalupe', 'Apodaca'],
        'Estado de México': ['Toluca', 'Naucalpan', 'Tlalnepantla', 'Ecatepec'],
        'Yucatán': ['Mérida', 'Valladolid', 'Progreso', 'Tizimín'],
        'Veracruz': ['Veracruz', 'Xalapa', 'Coatzacoalcos', 'Córdoba']
      }
    },
    'Argentina': {
      states: ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos'],
      cities: {
        'Buenos Aires': ['Buenos Aires', 'La Plata', 'Mar del Plata', 'Bahía Blanca'],
        'Córdoba': ['Córdoba', 'Río Cuarto', 'Villa María', 'San Francisco'],
        'Santa Fe': ['Santa Fe', 'Rosario', 'Rafaela', 'Reconquista'],
        'Mendoza': ['Mendoza', 'San Rafael', 'Godoy Cruz', 'Maipú'],
        'Tucumán': ['San Miguel de Tucumán', 'Yerba Buena', 'Tafí Viejo', 'Banda del Río Salí'],
        'Entre Ríos': ['Paraná', 'Concordia', 'Gualeguaychú', 'Uruguay']
      }
    },
    'Colombia': {
      states: ['Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Santander', 'Cundinamarca'],
      cities: {
        'Bogotá D.C.': ['Bogotá', 'Suba', 'Kennedy', 'Engativá'],
        'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado'],
        'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tulua'],
        'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'],
        'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
        'Cundinamarca': ['Soacha', 'Chía', 'Zipaquirá', 'Facatativá']
      }
    },
    'España': {
      states: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga'],
      cities: {
        'Madrid': ['Madrid', 'Móstoles', 'Alcalá de Henares', 'Fuenlabrada'],
        'Barcelona': ['Barcelona', 'Hospitalet de Llobregat', 'Badalona', 'Terrassa'],
        'Valencia': ['Valencia', 'Alicante', 'Elche', 'Castellón de la Plana'],
        'Sevilla': ['Sevilla', 'Jerez de la Frontera', 'Dos Hermanas', 'Alcalá de Guadaíra'],
        'Zaragoza': ['Zaragoza', 'Huesca', 'Teruel', 'Calatayud'],
        'Málaga': ['Málaga', 'Marbella', 'Jerez', 'Algeciras']
      }
    },
    'Chile': {
      states: ['Región Metropolitana', 'Valparaíso', 'Biobío', 'Araucanía', 'Los Lagos', 'Antofagasta'],
      cities: {
        'Región Metropolitana': ['Santiago', 'Puente Alto', 'Maipú', 'Las Condes'],
        'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Villa Alemana', 'Quilpué'],
        'Biobío': ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles'],
        'Araucanía': ['Temuco', 'Villarrica', 'Pucón', 'Angol'],
        'Los Lagos': ['Puerto Montt', 'Osorno', 'Valdivia', 'Castro'],
        'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones']
      }
    },
    'Perú': {
      states: ['Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque'],
      cities: {
        'Lima': ['Lima', 'Callao', 'San Juan de Lurigancho', 'Ate'],
        'Arequipa': ['Arequipa', 'Cayma', 'Cerro Colorado', 'Yanahuara'],
        'Cusco': ['Cusco', 'San Sebastián', 'San Jerónimo', 'Wanchaq'],
        'La Libertad': ['Trujillo', 'El Porvenir', 'Florencia de Mora', 'Huanchaco'],
        'Piura': ['Piura', 'Sullana', 'Paita', 'Talara'],
        'Lambayeque': ['Chiclayo', 'Lambayeque', 'Ferreñafe', 'Monsefú']
      }
    }
  };

  const handleCountryChange = (country) => {
    setFormData(prev => ({
      ...prev,
      country: country,
      state: '',
      city: ''
    }));
  };

  const handleStateChange = (state) => {
    setFormData(prev => ({
      ...prev,
      state: state,
      city: ''
    }));
  };

  const getAvailableStates = () => {
    if (!formData.country || !countryData[formData.country]) {
      return [];
    }
    return countryData[formData.country].states;
  };

  const getAvailableCities = () => {
    if (!formData.country || !formData.state || !countryData[formData.country]?.cities[formData.state]) {
      return [];
    }
    return countryData[formData.country].cities[formData.state];
  };

  // Componente Modal para Términos y Condiciones
  const TermsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-black border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Términos y Condiciones</h3>
          <button 
            onClick={() => setShowTermsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <h4 className="font-medium text-black mb-4">1. Aceptación de los Términos</h4>
          <p className="mb-4 text-gray-700">
            Al acceder y utilizar nuestros servicios, usted acepta estar sujeto a estos Términos y Condiciones. 
            Si no está de acuerdo con alguna parte de los términos, no podrá acceder a nuestros servicios.
          </p>
          
          <h4 className="font-medium text-black mb-4">2. Uso del Servicio</h4>
          <p className="mb-4 text-gray-700">
            Usted se compromete a utilizar nuestros servicios únicamente con fines legales y de acuerdo con estos Términos. 
            No debe utilizar nuestros servicios de manera que pueda dañar, deshabilitar, sobrecargar o deteriorar el servicio.
          </p>
          
          <h4 className="font-medium text-black mb-4">3. Cuenta de Usuario</h4>
          <p className="mb-4 text-gray-700">
            Al crear una cuenta con nosotros, debe proporcionar información precisa, completa y atualizada. 
            Es responsable de salvaguardar la contraseña que utiliza para acceder al servicio y de cualquier actividad 
            realizada bajo su contraseña.
          </p>
          
          <h4 className="font-medium text-black mb-4">4. Propiedad Intelectual</h4>
          <p className="mb-4 text-gray-700">
            El servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad 
            exclusiva de nuestra empresa y sus licenciantes. El servicio está protegido por derechos de autor, marcas 
            registradas y otras leyes.
          </p>
          
          <h4 className="font-medium text-black mb-4">5. Limitación de Responsabilidad</h4>
          <p className="mb-4 text-gray-700">
            En ningún caso nuestra empresa, ni sus directores, empleados, socios, agentes, proveedores o afiliados, 
            serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluidos, 
            entre otros, la pérdida de beneficios, datos, uso, goodwill u otras pérdidas intangibles.
          </p>
          
          <h4 className="font-medium text-black mb-4">6. Cambios en los Términos</h4>
          <p className="mb-4 text-gray-700">
            Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier 
            momento. Si una revisión es importante, proporcionaremos un aviso con al menos 30 días de antelación antes 
            de que los nuevos términos entren en vigor.
          </p>
        </div>
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button 
            onClick={() => setShowTermsModal(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  // Componente Modal para Política de Privacidad
  const PrivacyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-black border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Política de Privacidad</h3>
          <button 
            onClick={() => setShowPrivacyModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <h4 className="font-medium text-black mb-4">1. Información que Recopilamos</h4>
          <p className="mb-4 text-gray-700">
            Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta, completa 
            formularios o se comunica con nosotros. Esto puede incluir nombre, dirección de correo electrónico, 
            información de contacto e información sobre sus mascotas.
          </p>
          
          <h4 className="font-medium text-black mb-4">2. Uso de la Información</h4>
          <p className="mb-4 text-gray-700">
            Utilizamos la información que recopilamos para:
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>Proporcionar, mantener y mejorar nuestros servicios</li>
            <li>Responder a sus comentarios, pregones y solicitudes</li>
            <li>Enviarle información técnica, actualizaciones y mensajes administrativos</li>
            <li>Personalizar y mejorar su experiencia</li>
          </ul>
          
          <h4 className="font-medium text-black mb-4">3. Compartición de Información</h4>
          <p className="mb-4 text-gray-700">
            No vendemos ni alquilamos su información personal a terceros. Podemos compartir información con:
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>Proveedores de servicios que necesitan acceso a dicha información para realizar trabajos en nuestro nombre</li>
            <li>Cumplir con cualquier ley, regulación o solicitud gubernamental válida</li>
            <li>Proteger los derechos, propiedad o seguridad nuestra, de nuestros usuarios o del público</li>
          </ul>
          
          <h4 className="font-medium text-black mb-4">4. Seguridad de la Información</h4>
          <p className="mb-4 text-gray-700">
            Tomamos medidas razonables para ayudar a proteger su información personal contra acceso no autorizado, 
            alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por Internet o método 
            de almacenamiento electrónico es 100% seguro.
          </p>
          
          <h4 className="font-medium text-black mb-4">5. Sus Derechos</h4>
          <p className="mb-4 text-gray-700">
            Usted puede acceder, corregir, actualizar o solicitar la eliminación de su información personal en 
            cualquier momento poniéndose en contacto con nosotros. También puede optar por no recibir comunicaciones 
            de marketing en cualquier momento.
          </p>
          
          <h4 className="font-medium text-black mb-4">6. Cambios en esta Política</h4>
          <p className="mb-4 text-gray-700">
            Podemos actualizar nuestra Política de Privacidad periódicamente. Le notificaremos sobre cualquier cambio 
            publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización".
          </p>
        </div>
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button 
            onClick={() => setShowPrivacyModal(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Modales */}
      {showTermsModal && <TermsModal />}
      {showPrivacyModal && <PrivacyModal />}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {formData.userType === 'caregiver' ? 'Registro como Cuidador' : 'Registro como Dueño'} - Paso {currentStep} de 2
        </h1>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Página de verificación de email */}
        {emailVerificationSent && currentStep === 1 && (
          <div className="space-y-6 text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Verifica tu correo electrónico
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Te hemos enviado un email de verificación a{' '}
                <span className="font-medium text-gray-800">{formData.email}</span>
              </p>
              <p className="text-sm text-gray-500">
                Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación para continuar.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => handleStep1Submit()}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Reenviar email
                </button>
                
                <span className="text-gray-400 hidden sm:block">|</span>
                
                <button
                  type="button"
                  onClick={() => setEmailVerificationSent(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Cambiar email
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">¿No ves el email?</p>
                  <p className="text-yellow-700 mt-1">
                    Revisa tu carpeta de spam o correo no deseado. El email puede tardar unos minutos en llegar.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continuar al siguiente paso
              </button>
            </div>
          </div>
        )}

        {/* Paso 1: Información Personal */}
        {currentStep === 1 && !emailVerificationSent && (
          <div className="space-y-6" style={{ colorScheme: 'light' }}>
            <h2 className="text-xl font-medium text-gray-800 mb-6" style={{ color: '#1f2937' }}>Información Personal</h2>
            
            {/* Tipo de Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                Tipo de usuario *
              </label>
              <div className="relative">
                <select
                  value={formData.userType}
                  onChange={(e) => handleInputChange('userType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  style={{ backgroundColor: '#ffffff', color: '#1f2937', borderColor: '#d1d5db' }}
                  required
                >
                  <option value="caregiver">👨‍⚕️ Soy Cuidador</option>
                  <option value="pet-owner">🐾 Soy Dueño de Mascota</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" style={{ color: '#9ca3af' }} />
              </div>
            </div>

            {/* Nombre y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.firstName.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: !formData.firstName.trim() ? '#fef2f2' : '#ffffff', 
                    color: '#1f2937', 
                    borderColor: !formData.firstName.trim() ? '#fca5a5' : '#d1d5db'
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.lastName.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: !formData.lastName.trim() ? '#fef2f2' : '#ffffff', 
                    color: '#1f2937', 
                    borderColor: !formData.lastName.trim() ? '#fca5a5' : '#d1d5db'
                  }}
                  required
                />
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.email.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: !formData.email.trim() ? '#fef2f2' : '#ffffff', 
                    color: '#1f2937', 
                    borderColor: !formData.email.trim() ? '#fca5a5' : '#d1d5db'
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.phone.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: !formData.phone.trim() ? '#fef2f2' : '#ffffff', 
                    color: '#1f2937', 
                    borderColor: !formData.phone.trim() ? '#fca5a5' : '#d1d5db'
                  }}
                  required
                />
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                      !formData.password.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: !formData.password.trim() ? '#fef2f2' : '#ffffff', 
                      color: '#1f2937', 
                      borderColor: !formData.password.trim() ? '#fca5a5' : '#d1d5db'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    style={{ color: '#9ca3af' }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                      !formData.confirmPassword.trim() || formData.password !== formData.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: (!formData.confirmPassword.trim() || formData.password !== formData.confirmPassword) ? '#fef2f2' : '#ffffff', 
                      color: '#1f2937', 
                      borderColor: (!formData.confirmPassword.trim() || formData.password !== formData.confirmPassword) ? '#fca5a5' : '#d1d5db'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    style={{ color: '#9ca3af' }}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* País y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  País *
                </label>
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      !formData.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: !formData.country ? '#fef2f2' : '#ffffff', 
                      color: '#1f2937', 
                      borderColor: !formData.country ? '#fca5a5' : '#d1d5db'
                    }}
                    required
                  >
                    <option value="">Selecciona tu país</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" style={{ color: '#9ca3af' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Estado/Provincia *
                </label>
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      !formData.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: !formData.state ? '#fef2f2' : '#ffffff', 
                      color: '#1f2937', 
                      borderColor: !formData.state ? '#fca5a5' : '#d1d5db'
                    }}
                    disabled={!formData.country}
                    required
                  >
                    <option value="">
                      {!formData.country ? 'Primero selecciona un país' : 'Selecciona tu estado/provincia'}
                    </option>
                    {getAvailableStates().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" style={{ color: '#9ca3af' }} />
                </div>
              </div>
            </div>

            {/* Ciudad y Dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Ciudad *
                </label>
                <div className="relative">
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      !formData.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    style={{ 
                    backgroundColor: !formData.city ? '#fef2f2' : '#ffffff', 
                    color: '#1f2937', 
                    borderColor: !formData.city ? '#fca5a5' : '#d1d5db'
                    }}
                    disabled={!formData.state}
                    required
                  >
                    <option value="">
                      {!formData.state ? 'Primero selecciona un estado/provincia' : 'Selecciona tu ciudad'}
                    </option>
                    {getAvailableCities().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" style={{ color: '#9ca3af' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                  Dirección *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Calle, número, código postal"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: !formData.address ? '#fef2f2' : '#ffffff', 
                    color: '#1f2937', 
                    borderColor: !formData.address ? '#fca5a5' : '#d1d5db'
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className={`mt-1 w-4 h-4 text-blue-600 border-2 rounded focus:ring-blue-500 ${
                    !formData.acceptTerms ? 'border-red-400' : 'border-gray-300'
                  }`}
                  style={{ 
                    borderColor: !formData.acceptTerms ? '#f87171' : '#d1d5db',
                    backgroundColor: '#ffffff'
                  }}
                />
                <label htmlFor="terms" className="text-sm text-gray-700" style={{ color: '#374151' }}>
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Términos y Condiciones
                  </button>{' '}
                  y la{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Política de Privacidad
                  </button>{' '}
                  *
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={formData.acceptMarketing}
                  onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                  className={`mt-1 w-4 h-4 text-blue-600 border-2 rounded focus:ring-blue-500 ${
                    !formData.acceptMarketing ? 'border-red-400' : 'border-gray-300'
                  }`}
                  style={{ 
                    borderColor: !formData.acceptMarketing ? '#f87171' : '#d1d5db',
                    backgroundColor: '#ffffff'
                  }}
                  required
                />
                <label htmlFor="marketing" className="text-sm text-gray-700" style={{ color: '#374151' }}>
                  Acepto recibir comunicaciones de marketing y promociones *
                </label>
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                style={{ colorScheme: 'light', color: '#374151', backgroundColor: '#f3f4f6' }}
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                type="button"
                onClick={handleStep1Submit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                style={{ colorScheme: 'light', color: '#ffffff', backgroundColor: '#2563eb' }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Información Específica según tipo de usuario */}
        {currentStep === 2 && !emailVerificationSent && (
          <div className="space-y-6">
            {formData.userType === 'caregiver' ? (
              /* Información Profesional para Cuidadores */
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-800 mb-6">Información Profesional</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiencia con mascotas *
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    rows={4}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !formData.experience.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Describe tu experiencia cuidando mascotas, tipos de animales con los que has trabajado, etc."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de tu perfil *
                  </label>
                  <textarea
                    value={formData.profileDescription}
                    onChange={(e) => handleInputChange('profileDescription', e.target.value)}
                    rows={4}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !formData.profileDescription.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Describe tus habilidades, enfoque de cuidado, por qué serías un buen cuidador, etc."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Servicios que ofreces *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services.walks}
                        onChange={(e) => handleServiceChange('walks', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Paseos</span>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services.homeCare}
                        onChange={(e) => handleServiceChange('homeCare', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Cuidado en casa</span>
                    </label>
                  </div>
                </div>
                
                {/* Nuevos campos de archivos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula de identidad - DNI *
                  </label>
                  <input
                    type="file"
                    accept=".png,.pdf,.jpg"
                    onChange={(e) => handleFileChange('dniFile', e.target.files[0])}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !formData.dniFile ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Solo se aceptan archivos JPG, PNG o PDF</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificado de Antecedentes Penales *
                  </label>
                  <input
                    type="file"
                    accept=".png,.pdf,.jpg"
                    onChange={(e) => handleFileChange('criminalRecordFile', e.target.files[0])}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !formData.criminalRecordFile ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Solo se aceptan archivos JPG, PNG o PDF</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto de su perfil *
                  </label>
                  <input
                    type="file"
                    accept=".png,.jpg"
                    onChange={(e) => handleFileChange('profilePhoto', e.target.files[0])}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !formData.profilePhoto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Solo se aceptan archivos JPG, PNG</p>
                </div>
              </div>
            ) : (
              /* Información de Mascotas para Dueños */
              <div className="space-y-6 bg-white text-gray-900 rounded-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-800">Información de tus Mascotas</h2>
                  <button
                    type="button"
                    onClick={addPet}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Mascota
                  </button>
                </div>

                {formData.pets.map((pet, index) => (
                  <div key={pet.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Mascota {index + 1}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={pet.name}
                          onChange={(e) => handlePetChange(pet.id, 'name', e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${
                            !pet.name || pet.name.trim() === '' 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo *
                        </label>
                        <div className="relative">
                          <select
                            value={pet.type}
                            onChange={(e) => handlePetChange(pet.id, 'type', e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900 ${
                              !pet.type || pet.type.trim() === '' 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300'
                            }`}
                            required
                          >
                            <option value="">Seleccionar</option>
                            {petTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tamaño
                        </label>
                        <div className="relative">
                          <select
                            value={pet.size}
                            onChange={(e) => handlePetChange(pet.id, 'size', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900"
                          >
                            <option value="">Seleccionar</option>
                            <option value="Pequeño">Pequeño</option>
                            <option value="Mediano">Mediano</option>
                            <option value="Grande">Grande</option>
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Edad
                        </label>
                        <input
                          type="text"
                          value={pet.age}
                          onChange={(e) => handlePetChange(pet.id, 'age', e.target.value)}
                          placeholder="ej: 3 años"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Necesidades Especiales
                        </label>
                        <input
                          type="text"
                          value={pet.specialNeeds}
                          onChange={(e) => handlePetChange(pet.id, 'specialNeeds', e.target.value)}
                          placeholder="Medicamentos, alergias, etc."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {formData.userType === 'caregiver' ? 'Registrar como Cuidador' : 'Registrar como Dueño'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetOwnerRegistration;