import React, { useState, useEffect } from 'react';
import { ChevronLeft, Eye, EyeOff, Mail, AlertCircle, X, Plus, ChevronRight } from 'lucide-react';

const BASE_URL = 'http://localhost:8080/api/v1';

// Expresión regular para la contraseña segura
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// Lista de tipos de mascotas
const petTypes = ['Perro', 'Gato', 'Pájaro', 'Conejo', 'Hámster', 'Tortuga', 'Pez', 'Otro'];

const UserRegistration = ({
  startStep = 1,
  initialUserType = null,
  tokenInfo = null
}) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    email: tokenInfo?.email || '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    firstName: tokenInfo?.name || '',
    lastName: '',
    address: {
      country: '',
      region: '',
      city: '',
      streetAddress: ''
    },
    role: initialUserType === 'caregiver' ? 'ROLE_SITTER' : 'ROLE_OWNER',
    acceptTerms: false,
    acceptMarketing: false,

    experience: '',
    profileDescription: '',
    services: {
      walks: false,
      homeCare: false
    },
    dniFile: null,
    criminalRecordFile: null,
    profilePhoto: null,

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

  // Cargar países al montar
  useEffect(() => {
    fetch(`${BASE_URL}/addresses`)
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(() => setCountries([]));
  }, []);

  // Cargar regiones cuando cambia el país
  useEffect(() => {
    if (countries.length === 0) return;
    if (formData.address.country) {
      fetch(`${BASE_URL}/addresses/${formData.address.country}/regions`)
        .then(res => res.json())
        .then(data => setRegions(data))
        .catch(() => setRegions([]));
      setCities([]); // Limpiar ciudades al cambiar país
    } else {
      setRegions([]);
      setCities([]);
    }
  }, [formData.address.country, countries]);

  // Cargar ciudades cuando cambia la región
  useEffect(() => {
    if (formData.address.region) {
      fetch(`${BASE_URL}/addresses/${formData.address.region}/cities`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
  }, [formData.address.region]);

  // Handlers para selects dinámicos
  const handleCountryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        country: e.target.value, // countryCode
        region: '',
        city: '',
        streetAddress: ''
      }
    }));
  };

  const handleRegionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        region: e.target.value, // id de la región
        city: '',
        streetAddress: prev.address.streetAddress
      }
    }));
  };

  const handleCityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city: e.target.value, // id de la ciudad
        streetAddress: prev.address.streetAddress
      }
    }));
  };

  const handleStreetAddressChange = (e) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        streetAddress: e.target.value
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (service, value) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: value
      }
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
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
    const newPetId = Math.max(...formData.pets.map(p => p.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      pets: [...prev.pets, {
        id: newPetId,
        name: '',
        type: '',
        size: '',
        age: '',
        specialNeeds: ''
      }]
    }));
  };

  // Validación paso 1
  const validateStep1 = () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      formData.password !== formData.confirmPassword ||
      !formData.phoneNumber.trim() ||
      !formData.address.country ||
      !formData.address.region ||
      !formData.address.city ||
      !formData.address.streetAddress.trim() ||
      !formData.acceptTerms
    ) {
      setErrorMessage('Por favor completa todos los campos obligatorios marcados con * y acepta los términos.');
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.role === 'ROLE_SITTER') {
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
      
      if (!formData.dniFile) {
        alert('El archivo de DNI es obligatorio');
        return false;
      }
      
      if (!formData.criminalRecordFile) {
        alert('El certificado de antecedentes penales es obligatorio');
        return false;
      }
      
      if (!formData.profilePhoto) {
        alert('La foto de perfil es obligatoria');
        return false;
      }
    } else {
      for (let pet of formData.pets) {
        if (!pet.name || pet.name.trim() === '' || !pet.type || pet.type.trim() === '') {
          alert('Por favor completa el nombre y tipo de todas tus mascotas');
          return false;
        }
      }
    }  
    return true;
  };

  // Envío del formulario paso 1
  const handleStep1Submit = async () => {
    setErrorMessage('');
    if (!validateStep1()) return;

    // Buscar los nombres de región y ciudad según los ids seleccionados
    const selectedRegion = regions.find(r => String(r.id) === String(formData.address.region));
    const selectedCity = cities.find(c => String(c.id) === String(formData.address.city));

    const registerPayload = {
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: {
        streetAddress: formData.address.streetAddress,
        unit: "",
        city: selectedCity ? selectedCity.name : "",
        region: selectedRegion ? selectedRegion.name : "",
        countryCode: formData.address.country // Código ISO-3166 alpha-2
      },
      role: formData.role
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerPayload)
      });
      if (response.status === 201) {
        setEmailVerificationSent(true);
        setErrorMessage('');
      } else {
        const error = await response.text();
        setErrorMessage(error || 'Error al registrar usuario.');
      }
    } catch (error) {
      setErrorMessage('Error de red: ' + error.message);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      handleStep1Submit();
    } else {
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
          if (formData.role === 'ROLE_SITTER') {
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
    }
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      if (formData.role === 'ROLE_SITTER') {
        alert('¡Cuenta de cuidador creada exitosamente!');
      } else {
        alert('¡Cuenta creada exitosamente!');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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
            En ningún caso nuestra empresa, ni sus directores, empleados, socios, agents, proveedores o afiliados, 
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
      {showTermsModal && <TermsModal />}
      {showPrivacyModal && <PrivacyModal />}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {formData.role === 'ROLE_SITTER' ? 'Registro como Cuidador' : 'Registro como Dueño'} - Paso {currentStep} de 2
        </h1>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Mostrar error si existe */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {/* Página de verificación de email */}
        {emailVerificationSent && (
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
          </div>
        )}

        {/* Paso 1: Información Personal */}
        {!emailVerificationSent && currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Información Personal</h2>
            {/* Tipo de usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de usuario *
              </label>
              <select
                value={formData.role}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    role: value
                  }));
                }}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                required
              >
                <option value="ROLE_SITTER">👨‍⚕️ Soy Cuidador</option>
                <option value="ROLE_OWNER">🐾 Soy Dueño de Mascota</option>
              </select>
            </div>
            {/* Nombre y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>
            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>
            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setShowPasswordInfo(true)}
                    onBlur={() => setShowPasswordInfo(false)}
                    className={`w-full p-3 border rounded-lg pr-12 ${formData.password && !passwordRegex.test(formData.password) ? 'border-red-500' : ''}`}
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
                {showPasswordInfo && (
                  <div className="text-xs text-gray-600 mt-2">
                    La contraseña debe tener:
                    <ul className="list-disc ml-5">
                      <li>Al menos 8 caracteres</li>
                      <li>Una letra mayúscula</li>
                      <li>Una letra minúscula</li>
                      <li>Un número</li>
                      <li>Un carácter especial</li>
                    </ul>
                  </div>
                )}
                {formData.password && !passwordRegex.test(formData.password) && (
                  <div className="text-xs text-red-600 mt-1">
                    La contraseña no cumple con los requisitos.
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full p-3 border rounded-lg pr-12"
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
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="text-xs text-red-600 mt-1">
                    Las contraseñas no coinciden.
                  </div>
                )}
              </div>
            </div>
            {/* País, Región, Ciudad, Dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País *</label>
                <select
                  value={formData.address.country}
                  onChange={handleCountryChange}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Selecciona tu país</option>
                  {countries.map((country, idx) => (
                    <option key={country.countryCode ? country.countryCode : `country-${idx}`} value={country.countryCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado/Provincia/Región *</label>
                <select
                  value={formData.address.region}
                  onChange={handleRegionChange}
                  className="w-full p-3 border rounded-lg"
                  required
                  disabled={!formData.address.country}
                >
                  <option value="">Selecciona una región</option>
                  {regions.map((region, idx) => (
                    <option key={region.id ? region.id : `region-${idx}`} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                <select
                  value={formData.address.city}
                  onChange={handleCityChange}
                  className="w-full p-3 border rounded-lg"
                  required
                  disabled={!formData.address.region}
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map((city, idx) => (
                    <option key={city.id ? city.id : `city-${idx}`} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                <input
                  type="text"
                  value={formData.address.streetAddress}
                  onChange={handleStreetAddressChange}
                  placeholder="Calle, número, código postal"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>
            {/* Términos y marketing */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-2 rounded"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
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
                  className="mt-1 w-4 h-4 text-blue-600 border-2 rounded"
                />
                <label htmlFor="marketing" className="text-sm text-gray-700">
                  Acepto recibir comunicaciones de marketing y promociones
                </label>
              </div>
            </div>
            {/* Botones */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Información Específica según tipo de usuario */}
        {currentStep === 2 && !emailVerificationSent && (
          <div className="space-y-6">
            {formData.role === 'ROLE_SITTER' ? (
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
                {formData.role === 'ROLE_SITTER' ? 'Registrar como Cuidador' : 'Registrar como Dueño'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRegistration;