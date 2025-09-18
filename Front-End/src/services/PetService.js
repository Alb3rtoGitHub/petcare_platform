import ApiService from './ApiService.js';

class PetService {
    // Crear mascotas para un owner
    async createPets(ownerId, petsList) {
        try {
            const response = await ApiService.post(`/pet/${ownerId}`, petsList);
            return response;
        } catch (error) {
            console.error('Error creando mascotas:', error);
            throw error;
        }
    }

    // Crear una sola mascota
    async createPet(ownerId, petData) {
        try {
            const response = await this.createPets(ownerId, [petData]);
            return response;
        } catch (error) {
            console.error('Error creando mascota:', error);
            throw error;
        }
    }

    // Obtener una mascota específica por ID
    async getPet(petId) {
        try {
            const response = await ApiService.get(`/pet/${petId}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo mascota:', error);
            throw error;
        }
    }

    // Obtener todas las mascotas de un owner
    async getAllPetsByOwner(ownerId) {
        try {
            const response = await ApiService.get(`/pet/${ownerId}/owner`);
            return response;
        } catch (error) {
            console.error('Error obteniendo mascotas del owner:', error);
            throw error;
        }
    }

    // Actualizar información de una mascota
    async updatePet(petId, petData) {
        try {
            const response = await ApiService.put(`/pet/${petId}`, petData);
            return response;
        } catch (error) {
            console.error('Error actualizando mascota:', error);
            throw error;
        }
    }

    // Eliminar una mascota
    async deletePet(petId) {
        try {
            const response = await ApiService.delete(`/pet/${petId}`);
            return response;
        } catch (error) {
            console.error('Error eliminando mascota:', error);
            throw error;
        }
    }

    // Mapear especies del backend al frontend
    mapSpeciesToDisplay(species) {
        const speciesMap = {
            'DOG': 'Perro',
            'CAT': 'Gato',
            'BIRD': 'Ave',
            'FISH': 'Pez',
            'RABBIT': 'Conejo',
            'HAMSTER': 'Hamster',
            'OTHER': 'Otro'
        };
        return speciesMap[species] || species;
    }

    // Mapear tamaños del backend al frontend
    mapSizeToDisplay(size) {
        const sizeMap = {
            'SMALL': 'Pequeño',
            'MEDIUM': 'Mediano',
            'LARGE': 'Grande'
        };
        return sizeMap[size] || size;
    }

    // Mapear especies del frontend al backend
    mapSpeciesFromDisplay(species) {
        const speciesMap = {
            'Perro': 'DOG',
            'Gato': 'CAT',
            'Ave': 'BIRD',
            'Pez': 'FISH',
            'Conejo': 'RABBIT',
            'Hamster': 'HAMSTER',
            'Otro': 'OTHER'
        };
        return speciesMap[species] || 'OTHER';
    }

    // Mapear tamaños del frontend al backend
    mapSizeFromDisplay(size) {
        const sizeMap = {
            'Pequeño': 'SMALL',
            'Mediano': 'MEDIUM',
            'Grande': 'LARGE'
        };
        return sizeMap[size] || 'MEDIUM';
    }

    // Formatear datos de mascota para el frontend
    formatPetForDisplay(pet) {
        return {
            id: pet.id,
            name: pet.name,
            age: pet.age,
            type: this.mapSpeciesToDisplay(pet.species),
            breed: pet.breed || 'Sin especificar',
            size: this.mapSizeToDisplay(pet.sizeCategory),
            careNote: pet.careNote || '',
            image: pet.image || null
        };
    }

    // Formatear datos de mascota para enviar al backend
    formatPetForBackend(pet) {
        return {
            name: pet.name,
            age: parseInt(pet.age) || 0,
            species: this.mapSpeciesFromDisplay(pet.type),
            sizeCategory: this.mapSizeFromDisplay(pet.size),
            careNote: pet.careNote || ''
        };
    }
}

export default new PetService();