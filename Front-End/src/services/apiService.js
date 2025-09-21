// Archivo de servicio para centralizar las llamadas a la API
import { BASE_URL } from '../config/constants.js';

// Función para obtener datos de cuidadores destacados
export const fetchFeaturedSitters = async () => {
  const response = await fetch(`${BASE_URL}/sitters?page=0&size=3&sortBy=averageRating&sortDir=desc`);
  if (!response.ok) {
    throw new Error('Error al obtener cuidadores destacados');
  }
  return response.json();
};

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }
  return response.json();
};

// Función para obtener datos del cuidador
export const fetchSitterData = async (sitterId, token) => {
  const response = await fetch(`${BASE_URL}/sitters/${sitterId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener datos del cuidador');
  }
  return response.json();
};

// Función para obtener servicios disponibles
export const fetchServiceEntities = async (token) => {
  const response = await fetch(`${BASE_URL}/service-entities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener servicios');
  }
  return response.json();
};

// Función para obtener reservas de un usuario
export const fetchUserBookings = async (userId, token) => {
  const response = await fetch(`${BASE_URL}/bookings/user/${userId}?page=0&size=3&sortBy=startDateTime`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener las reservas');
  }
  return response.json();
};

// Función para obtener las mascotas de un dueño
export const fetchUserPets = async (ownerId) => {
  const token = sessionStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/pet/${ownerId}/owner`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las mascotas del dueño');
  }

  const pets = await response.json();

  // Adaptar los datos al DTO PetUpdateRequestDTO
  return pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
    age: pet.age,
    species: pet.species, // Mantener el valor original para el backend
    sizeCategory: pet.sizeCategory, // Mantener el valor original para el backend
    careNote: pet.careNote,
    ownerId: pet.ownerId, // Este campo no se muestra en el modal
  }));
};

// Función para actualizar datos de una mascota
export const updatePet = async (petId, petData) => {
  const token = sessionStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/pet/${petId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(petData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la mascota');
  }

  return response.json();
};

// Función para eliminar una mascota
export const deletePet = async (petId) => {
  const token = sessionStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/pet/${petId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la mascota');
  }

  return response.json();
};

// Función para crear mascotas
export const createPets = async (ownerId, petsList) => {
  const token = sessionStorage.getItem('token');
  console.log("Enviando datos al endpoint createPets:", {
    ownerId,
    petsList,
  });
  const response = await fetch(`${BASE_URL}/pet/${ownerId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(petsList),
  });

  if (!response.ok) {
    throw new Error('Error al crear las mascotas');
  }

  if (response.status === 201) {
    return; // La respuesta es nula, no se intenta parsear JSON
  }

  return response.json();
};