import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Mail, AlertCircle, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080/api/v1';
// Solo especies CAT y DOG para el backend
const petTypeEnum = {
  Perro: 'DOG',
  Gato: 'CAT'
};
const petTypes = Object.keys(petTypeEnum);
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const documentTypes = [
  { value: 'DNI_ARG', label: 'DNI Argentino' },
  { value: 'DNI_ESP', label: 'DNI Español' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'ID_URUG', label: 'Cédula Uruguaya' },
  { value: 'ID_CHILE', label: 'Cédula Chilena' },
  // Agrega más tipos según necesidad
];

const sizeOptions = [
  { value: 'SMALL', label: 'Pequeño' },
  { value: 'MEDIUM', label: 'Mediano' },
  { value: 'LARGE', label: 'Grande' }
];

// Función para decodificar el token y obtener datos
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

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

  const navigate = useNavigate();

  // Campos para paso 2
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
    // Paso 2 - Sitter
    experience: '',
    profileDescription: '',
    documentType: '',
    documentNumber: '',
    dniFile: null,
    criminalRecordFile: null,
    // Paso 2 - Owner
    pets: []
  });

  // Guardar userId y token en sessionStorage si llegan por URL
  useEffect(() => {
    // Corregido: el parámetro es jwtToken, no jwtoken
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const jwtToken = params.get('jwtToken');
    if (userId && jwtToken) {
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('token', jwtToken);
      const claims = parseJwt(jwtToken);
      setFormData(prev => ({
        ...prev,
        sitterId: userId,
        role: claims?.role || prev.role
      }));
    } else {
      // Si ya está en sessionStorage, cargarlo en formData
      const storedId = sessionStorage.getItem('userId');
      if (storedId) {
        setFormData(prev => ({
          ...prev,
          sitterId: storedId
        }));
      }
    }
  }, []);

  // Cargar países al montar
  useEffect(() => {
    fetch(`${BASE_URL}/addresses`)
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (countries.length === 0) return;
    if (formData.address.country) {
      fetch(`${BASE_URL}/addresses/${formData.address.country}/regions`)
        .then(res => res.json())
        .then(data => setRegions(data))
        .catch(() => setRegions([]));
      setCities([]);
    } else {
      setRegions([]);
      setCities([]);
    }
  }, [formData.address.country, countries]);

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
        country: e.target.value,
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
        region: e.target.value,
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
        city: e.target.value,
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

  // Servicios para cuidadores
  const handleServiceChange = (service, checked) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: checked
      }
    }));
  };

  // Manejo de archivos
  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  // Mascotas para dueños
  const addPet = () => {
    setFormData(prev => ({
      ...prev,
      pets: [
        ...prev.pets,
        {
          id: Date.now(),
          name: '',
          type: '',
          size: '',
          age: '',
          specialNeeds: ''
        }
      ]
    }));
  };

  const handlePetChange = (petId, field, value) => {
    setFormData(prev => ({
      ...prev,
      pets: prev.pets.map(pet =>
        pet.id === petId
          ? field === 'type'
            ? { ...pet, type: petTypeEnum[value] || value }
            : { ...pet, [field]: value }
          : pet
      )
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

  // Validación paso 2
  const validateStep2 = () => {
    if (formData.role === 'ROLE_SITTER') {
      if (
        !formData.experience.trim() ||
        !formData.profileDescription.trim() ||
        !formData.documentType ||
        !formData.documentNumber ||
        !formData.dniFile ||
        !formData.criminalRecordFile
      ) {
        setErrorMessage('Completa todos los campos obligatorios y sube los archivos requeridos.');
        return false;
      }
    } else {
      if (formData.pets.length === 0 || formData.pets.some(pet => !pet.name || !pet.type)) {
        setErrorMessage('Agrega al menos una mascota y completa los datos obligatorios.');
        return false;
      }
    }
    return true;
  };

  // Envío del formulario paso 1
  const handleStep1Submit = async () => {
    setErrorMessage('');
    if (!validateStep1()) return;

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
        countryCode: formData.address.country
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
        setCurrentStep(2);
      } else {
        const error = await response.text();
        setErrorMessage(error || 'Error al registrar usuario.');
      }
    } catch (error) {
      setErrorMessage('Error de red: ' + error.message);
    }
  };

  // Envío del formulario paso 2
  const handleSubmit = async () => {
    setErrorMessage('');
    if (!validateStep2()) return;

    if (formData.role === 'ROLE_SITTER') {
      const sitterId = sessionStorage.getItem('userId');
      // Corregido: obtener el token como jwtToken
      const jwtToken = sessionStorage.getItem('token');
      if (!sitterId) {
        setErrorMessage('No se encontró el ID del cuidador.');
        return;
      }
      const formDataToSend = new FormData();

      const sitterPatchRequest = {
        sitterId: sitterId,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        experience: formData.experience,
        bio: formData.profileDescription,
        idCard: '',
        backgroundCheckDocument: ''
      };

      formDataToSend.append('data', new Blob([JSON.stringify(sitterPatchRequest)], { type: 'application/json' }));
      if (formData.dniFile) formDataToSend.append('idCard', formData.dniFile);
      if (formData.criminalRecordFile) formDataToSend.append('backgroundCheckDocument', formData.criminalRecordFile);

      try {
        const response = await fetch(`${BASE_URL}/sitters/${sitterId}/documents`, {
          method: 'PATCH',
          headers: {
            // Enviar el token correctamente en la petición
            'Authorization': `Bearer ${jwtToken}`
          },
          body: formDataToSend
        });
        console.log(jwtToken)
        if (response.ok) {
          navigate('/sitter-dashboard');
        } else {
          const error = await response.text();
          setErrorMessage(error || 'Error al cargar documentos.');
        }
      } catch (error) {
        setErrorMessage('Error de red: ' + error.message);
      }
    } else {
      // Ejemplo para dueño de mascota:
      const ownerId = sessionStorage.getItem('userId');
      const jwtToken = sessionStorage.getItem('token');
      if (!ownerId) {
        setErrorMessage('No se encontró el ID del dueño.');
        return;
      }

      // Mapear los datos del formulario al DTO esperado por el backend
      const petsPayload = formData.pets.map(pet => ({
        name: pet.name,
        age: pet.age ? parseInt(pet.age) : null,
        species: pet.type || null, // CAT o DOG
        sizeCategory: pet.size || null,
        careNote: pet.specialNeeds || ''
      }));

      try {
        const response = await fetch(`${BASE_URL}/pet/${ownerId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify(petsPayload)
        });
        if (response.status === 201 || response.status === 200 || response.status === 204 || response.statusText.toLowerCase().includes('created')) {
          navigate('/owner-dashboard');
        } else {
          const error = await response.text();
          setErrorMessage(error || 'Error al registrar mascotas.');
        }
      } catch (error) {
        setErrorMessage('Error de red: ' + error.message);
      }
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      handleStep1Submit();
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
          <p>Al acceder y utilizar nuestros servicios, usted acepta estar sujeto a estos Términos y Condiciones...</p>
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
          <p>Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta...</p>
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
            style={{ width: `${currentStep === 1 ? '50%' : '100%'}` }}
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
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Escribe tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Escribe tu apellido"
                  required
                />
              </div>
            </div>
            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Escribe tu Correo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Escribe tu telefono"
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
                    className={`w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${formData.password && !passwordRegex.test(formData.password) ? 'border-red-500' : ''}`}
                    placeholder="Escribe tu Contraseña"
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
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Confirma tu Contraseña"
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
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
              // Información Profesional para Cuidadores
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-800 mb-6">Información Profesional</h2>
                {/* Tipo de documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de documento *
                  </label>
                  <select
                    value={formData.documentType || ''}
                    onChange={e => handleInputChange('documentType', e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  >
                    <option value="">Selecciona el tipo de documento</option>
                    {documentTypes.map(dt => (
                      <option key={dt.value} value={dt.value}>{dt.label}</option>
                    ))}
                  </select>
                </div>
                {/* Número de documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Identidad *
                  </label>
                  <input
                    type="text"
                    value={formData.documentNumber || ''}
                    onChange={e => handleInputChange('documentNumber', e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Cedula o DNI"
                    required
                  />
                </div>
                {/* Experiencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experiencia como cuidador *
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Escribe tu experiencia"
                    required
                  />
                </div>
                {/* Descripción del perfil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del perfil *
                  </label>
                  <textarea
                    value={formData.profileDescription}
                    onChange={(e) => handleInputChange('profileDescription', e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Describete"
                    rows="4"
                    required
                  />
                </div>
                {/* Archivos requeridos */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Archivo de DNI o documento de identidad *
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('dniFile', e.target.files[0])}
                      className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificado de antecedentes penales *
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('criminalRecordFile', e.target.files[0])}
                      className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Información de Mascotas para Dueños
              <div className="space-y-6 bg-white text-gray-900 rounded-lg">
                <h2 className="text-xl font-medium text-gray-800 mb-6">Información de Mascotas</h2>
                <div className="space-y-4">
                  <button
                    onClick={addPet}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                    Agregar mascota
                  </button>
                </div>
                {formData.pets.map((pet, idx) => (
                  <div key={pet.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                        <input
                          type="text"
                          value={pet.name}
                          onChange={(e) => handlePetChange(pet.id, 'name', e.target.value)}
                          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Nombre de Mascota"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                        <select
                          value={Object.keys(petTypeEnum).find(label => petTypeEnum[label] === pet.type) || ''}
                          onChange={(e) => handlePetChange(pet.id, 'type', e.target.value)}
                          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                          required
                        >
                          <option value="">Selecciona el tipo de mascota</option>
                          {petTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño *</label>
                        <select
                          value={pet.size}
                          onChange={(e) => handlePetChange(pet.id, 'size', e.target.value)}
                          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                          required
                        >
                          <option value="">Selecciona el tamaño</option>
                          {sizeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                        <input
                          type="text"
                          value={pet.age}
                          onChange={(e) => handlePetChange(pet.id, 'age', e.target.value)}
                          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Edad de la mascota"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Necesidades especiales</label>
                      <input
                        type="text"
                        value={pet.specialNeeds}
                        onChange={(e) => handlePetChange(pet.id, 'specialNeeds', e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        placeholder="Medicamentos, costumbres..."
                      />
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
                {formData.role === 'ROLE_SITTER' ? 'Cargar documentos' : 'Registrar mascota/s'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRegistration;