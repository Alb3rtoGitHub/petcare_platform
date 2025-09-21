import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config/constants';
import OwnerNavbar from '../../components/OwnerNavbar.jsx';

export default function BookServicePage() {
  const navigate = useNavigate();
  const [cityId, setCityId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sitters, setSitters] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    serviceEntityId: '',
    startDateTime: '',
    endDateTime: '',
    specialInstructions: '',
  });
  const [bookingDetails, setBookingDetails] = useState(null);
  const [pets, setPets] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // Track the current step

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.roles.includes('ROLE_OWNER')) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.cityId) {
          setCityId(payload.cityId);
        } else {
          console.warn('El token no contiene cityId.');
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      console.info('No se encontró un token en sessionStorage.');
    }
  }, []);

  useEffect(() => {
    const storedCityId = sessionStorage.getItem('cityId');
    if (storedCityId) {
      setCityId(storedCityId);
    }
  }, []);

  useEffect(() => {
    if (cityId) {
      fetch(`${BASE_URL}/sitters?cityId=${cityId}&page=0&size=10&sortBy=averageRating&sortDir=asc`)
        .then((res) => res.json())
        .then((data) => {
          const activeSitters = data.content.filter((sitter) =>
            sitter.availabilities.some((availability) => availability.active)
          );
          setSitters(activeSitters);
        })
        .catch((error) => console.error('Error al obtener cuidadores:', error));
    }
  }, [cityId]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    fetch(`${BASE_URL}/service-entities`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener servicios');
        }
        return res.json();
      })
      .then((data) => setServices(data))
      .catch((error) => console.error('Error al obtener servicios:', error));
  }, []);

  useEffect(() => {
    // Fetch para obtener los países al montar el componente
    fetch(`${BASE_URL}/addresses`)
      .then((res) => {
        if (!res.ok) {
          console.error(`Error al obtener países: ${res.status} ${res.statusText}`);
          return res.text().then((text) => {
            throw new Error(`Error al obtener países: ${text}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        // Formatear los países para mostrar el nombre y usar el countryCode
        const formattedCountries = data.map((country) => ({
          name: country.name,
          code: country.countryCode,
        }));
        setCountries(formattedCountries);
      })
      .catch((error) => console.error('Error al obtener países:', error));
  }, []);

  useEffect(() => {
    const ownerId = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('token');

    if (!ownerId || !token) {
      console.error('No se encontró ownerId o token en sessionStorage.');
      return;
    }

    fetch(`${BASE_URL}/pet/${ownerId}/owner`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener las mascotas');
        }
        return res.json();
      })
      .then((data) => setPets(data))
      .catch((error) => console.error('Error al obtener las mascotas:', error));
  }, []);

  useEffect(() => {
    if (bookingDetails) {
      const ownerId = sessionStorage.getItem('id');
      const token = sessionStorage.getItem('token');

      if (!ownerId || !token) {
        console.error('No se encontró ownerId o token en sessionStorage.');
        return;
      }

      fetch(`${BASE_URL}/pets/${ownerId}/owner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error al obtener las mascotas');
          }
          return res.json();
        })
        .then((data) => setPets(data))
        .catch((error) => console.error('Error al obtener las mascotas:', error));
    }
  }, [bookingDetails]);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    fetch(`${BASE_URL}/addresses/${countryCode}/regions`)
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((error) => console.error('Error al obtener regiones:', error));
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    fetch(`${BASE_URL}/addresses/${regionId}/cities`)
      .then((res) => {
        if (!res.ok) {
          console.error(`Error al obtener ciudades: ${res.status} ${res.statusText}`);
          return res.text().then((text) => {
            throw new Error(`Error al obtener ciudades: ${text}`);
          });
        }
        return res.json();
      })
      .then((data) => setCities(data))
      .catch((error) => console.error('Error al obtener ciudades:', error));
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setCityId(cityId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name === 'pet' ? 'petId' : name]: value, // Replace pet with petId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    if (!formData.serviceEntityId) {
      alert('Por favor, seleccione un servicio válido antes de confirmar la reserva.');
      return;
    }

    const payload = {
      petId: formData.petId, // Correctly map petId
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime,
      specialInstructions: formData.specialInstructions,
      sitterId: formData.sitterId,
      serviceEntityId: formData.serviceEntityId, // Ensure serviceEntityId is included
    };

    fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al reservar el servicio');
        }
        return res.json();
      })
      .then((data) => {
        setBookingDetails({
          ...data,
          serviceName: formData.serviceName, // Usar el serviceName directamente desde formData
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un problema al crear la reserva');
      });
  };

  const handleAvailabilitySelect = (availability) => {
    let serviceEntityId;
    switch (availability.serviceName) {
      case 'WALKING':
        serviceEntityId = 1;
        break;
      case 'PET_DAYCARE':
        serviceEntityId = 2;
        break;
      case 'PET_SITTING':
        serviceEntityId = 3;
        break;
      default:
        console.warn('Service name not recognized:', availability.serviceName);
        serviceEntityId = null;
    }

    setSelectedAvailability(availability);
    setFormData((prev) => ({
      ...prev,
      startDateTime: availability.startTime,
      endDateTime: availability.endTime,
      sitterId: availability.sitterId,
      serviceEntityId, // Set serviceEntityId based on serviceName
      serviceName: availability.serviceName, // Nombre del servicio
    }));
  };

  const calculateTotalPrice = (serviceId, startDateTime, endDateTime) => {
    const service = services.find((s) => s.id === parseInt(serviceId));
    if (!service || !startDateTime || !endDateTime) return 0;

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const durationInHours = (end - start) / (1000 * 60 * 60);

    return durationInHours * service.price;
  };

  useEffect(() => {
    console.log('Estado de cityId:', cityId);
    console.log('Estado de selectedAvailability:', selectedAvailability);
    console.log('Estado de bookingDetails:', bookingDetails);
  }, [cityId, selectedAvailability, bookingDetails]);

  useEffect(() => {
    console.log('Estado actualizado de formData:', formData);
    console.log('Estado actualizado de bookingDetails:', bookingDetails);
  }, [formData, bookingDetails]);

  useEffect(() => {
    const ownerId = sessionStorage.getItem('id');
    if (ownerId) {
      setFormData((prev) => ({
        ...prev,
        ownerId, // Add ownerId to formData
      }));
    }
  }, []);

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  if (!pets || pets.length === 0) {
    return <div>No se encontraron mascotas. Por favor, agregue una mascota en el Dashboard.</div>;
  }

  return (
    <>
      <OwnerNavbar />
      <div className="min-h-screen bg-gray-50 p-6">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Selecciona tu ciudad</h2>
            <div className="mb-4">
              <label htmlFor="country" className="block text-gray-700 font-medium mb-2">
                País
              </label>
              <select
                id="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Selecciona un país</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="region" className="block text-gray-700 font-medium mb-2">
                Región
              </label>
              <select
                id="region"
                value={selectedRegion}
                onChange={handleRegionChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                disabled={!selectedCountry}
              >
                <option value="">Selecciona una región</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
                Ciudad
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                disabled={!selectedRegion}
              >
                <option value="">Selecciona una ciudad</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={goToNextStep} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Siguiente
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Cuidadores disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sitters.map((sitter) => (
                <div key={sitter.id} className="bg-white rounded-lg shadow-md p-4">
                  <img
                    src={sitter.profilePicture || '/placeholder.jpg'}
                    alt={sitter.firstName}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{sitter.firstName} {sitter.lastName}</h3>
                    <p className="text-sm text-gray-600">{sitter.bio}</p>
                    <p className="text-sm text-yellow-500">⭐ {sitter.averageRating?.toFixed(1) || 'N/A'}</p>
                    <ul className="mt-2 text-sm text-gray-600">
                      {sitter.availabilities
                        .filter((availability) => availability.active)
                        .map((availability) => (
                          <li key={availability.id} className="mb-2">
                            <span>{availability.serviceName}: {new Date(availability.startTime).toLocaleString()} - {new Date(availability.endTime).toLocaleString()}</span>
                            <button
                              onClick={() => handleAvailabilitySelect(availability)}
                              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Seleccionar
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={goToPreviousStep} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Anterior
            </button>
            <button onClick={goToNextStep} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Siguiente
            </button>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-4"
            >
              <h2 className="text-2xl font-bold mb-4">Crear Reserva</h2>

              <div className="mb-4">
                <label htmlFor="pet" className="block text-gray-700 font-medium mb-2">
                  Mascota
                </label>
                <select
                  id="pet"
                  name="pet"
                  value={formData.pet}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Seleccione una mascota</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Servicio Seleccionado
                </label>
                <p className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
                  {formData.serviceName}
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="startDateTime" className="block text-gray-700 font-medium mb-2">
                  Fecha y Hora de Inicio
                </label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="endDateTime" className="block text-gray-700 font-medium mb-2">
                  Fecha y Hora de Fin
                </label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="specialInstructions" className="block text-gray-700 font-medium mb-2">
                  Instrucciones Especiales
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Escribe aquí las instrucciones especiales para el cuidador"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Confirmar Reserva
              </button>
            </form>
            <button onClick={goToPreviousStep} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Anterior
            </button>
            <button onClick={goToNextStep} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Siguiente
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-4">
            <h2 className="text-2xl font-bold mb-4">Reserva Confirmada</h2>
            <p className="text-gray-700 mb-2">Detalles de la Reserva:</p>
            <ul className="text-gray-600">
              <li><strong>Mascota:</strong> {bookingDetails.petName}</li>
              <li style={{ backgroundColor: 'yellow', color: 'black', padding: '5px', borderRadius: '5px' }}><strong>Servicio:</strong> {bookingDetails.serviceName}</li>
              <li><strong>Fecha y Hora:</strong> {new Date(bookingDetails.startDateTime).toLocaleString()} - {new Date(bookingDetails.endDateTime).toLocaleString()}</li>
              <li><strong>Instrucciones:</strong> {bookingDetails.specialInstructions || 'Ninguna'}</li>
              <li><strong>Total:</strong> ${bookingDetails.totalPrice.toFixed(2)}</li>
            </ul>
            <button
              onClick={() => navigate('/owner/dashboard')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Pagar
            </button>
            <button onClick={goToPreviousStep} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Anterior
            </button>
          </div>
        )}
      </div>
    </>
  );
}