import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye, EyeOff, User, Mail, AlertCircle } from 'lucide-react';

const PetOwnerRegistration = () => { 
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pets, setPets] = useState([{ id: 1 }]);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const [formData, setFormData] = useState({
    // Paso 1 - Información Personal
    userType: 'pet-owner',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
    city: '',
    address: '',
    
    // Paso 2 - Información de Mascotas
    pets: [
      {
        id: 1,
        name: '',
        type: '',
        breed: '',
        age: '',
        weight: '',
        specialNeeds: ''
      }
    ],
    
    // Paso 3 - Contacto de Emergencia
    emergencyContact: '',
    emergencyPhone: '',
    additionalInfo: '',
    acceptTerms: false,
    acceptMarketing: false
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

    if (!formData.acceptTerms || !formData.acceptMarketing) {
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    for (let pet of formData.pets) {
      if (!pet.name || pet.name.trim() === '' || !pet.type || pet.type.trim() === '') {
        return false;
      }
    }
    return true;
  };

  const validateStep3 = () => {
    return formData.acceptTerms;
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
        alert('Por favor completa el nombre y tipo de todas tus mascotas');
      }
    } else if (currentStep === 3) {
      canProceed = validateStep3();
      if (!canProceed) {
        alert('Debes aceptar los Términos y Condiciones para continuar');
      }
    }
    
    if (canProceed && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep3()) {
      alert('Debes aceptar los Términos y Condiciones para crear tu cuenta');
      return;
    }
    
    console.log('Datos del formulario:', formData);
    alert('¡Cuenta creada exitosamente!');
  };

  const countries = ['México', 'Argentina', 'Colombia', 'España', 'Chile', 'Perú'];
  
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
  
  const petTypes = ['Perro', 'Gato', 'Ave', 'Conejo', 'Hamster', 'Otro'];

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Registro como Dueño - Paso {currentStep} de 3
        </h1>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
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
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(2);
                  setEmailVerificationSent(false);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Ya verifiqué mi email, continuar
              </button>
              
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
          </div>
        )}

        {/* Paso 1: Información Personal */}
        {currentStep === 1 && !emailVerificationSent && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Información Personal</h2>
            
            {/* Tipo de Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de usuario *
              </label>
              <div className="relative">
                <select
                  value={formData.userType}
                  onChange={(e) => handleInputChange('userType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  required
                >
                  <option value="pet-owner">🐾 Soy Dueño de Mascota</option>
                  <option value="caregiver">👨‍⚕️ Soy Cuidador</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Nombre y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.firstName.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.lastName.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.email.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !formData.phone.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* País y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      !formData.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Selecciona tu país</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado/Provincia *
                </label>
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      !formData.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
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
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Ciudad y Dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <div className="relative">
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                      !formData.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
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
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  required
                />
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
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                        Acepto los Términos y Condiciones y la Política de Privacidad *
                        </label>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <input
                        type="checkbox"
                        id="marketing"
                        checked={formData.acceptMarketing}
                        onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                        className={`mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                            !formData.acceptMarketing ? 'border-gray-300' : 'border-blue-500'
                        }`}
                        />
                        <label htmlFor="marketing" className="text-sm text-gray-700">
                        Acepto recibir comunicaciones de marketing y promociones *
                        </label>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* Paso 2: Información de Mascotas */}
        {currentStep === 2 && (
          <div className="space-y-6">
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
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !pet.name || pet.name.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                          !pet.type || pet.type.trim() === '' ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                      Raza
                    </label>
                    <input
                      type="text"
                      value={pet.breed}
                      onChange={(e) => handlePetChange(pet.id, 'breed', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Edad
                    </label>
                    <input
                      type="text"
                      value={pet.age}
                      onChange={(e) => handlePetChange(pet.id, 'age', e.target.value)}
                      placeholder="ej: 3 años"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso
                    </label>
                    <input
                      type="text"
                      value={pet.weight}
                      onChange={(e) => handlePetChange(pet.id, 'weight', e.target.value)}
                      placeholder="ej: 15 kg"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Necesidades Especiales
                    </label>
                    <input
                      type="text"
                      value={pet.specialNeeds}
                      onChange={(e) => handlePetChange(pet.id, 'specialNeeds', e.target.value)}
                      placeholder="Medicamentos, alergias, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paso 3: Contacto de Emergencia */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Contacto de Emergencia y Finalización</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacto de Emergencia
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Información Adicional
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Cualquier información adicional que consideres importante..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Botones de Navegación */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => {
              if (emailVerificationSent) {
                setEmailVerificationSent(false);
              } else if (currentStep === 1) {
                // Redirigir a la página de inicio
                window.location.href = '/';
              } else {
                prevStep();
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep === 1 && !emailVerificationSent ? 'Volver al inicio' : 'Anterior'}
          </button>

          {!emailVerificationSent && (
            <>
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Registrarme
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : currentStep === 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Crear Cuenta
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetOwnerRegistration;