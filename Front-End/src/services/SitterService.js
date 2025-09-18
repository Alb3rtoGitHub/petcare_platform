import ApiService from './ApiService.js';

class SitterService {
    // Obtener todos los sitters con filtros
    async getSitters(cityId = null, page = 0, size = 10, sortBy = 'averageRating', sortDir = 'desc', all = false) {
        try {
            const params = {
                page,
                size,
                sortBy,
                sortDir,
                all
            };

            if (cityId) {
                params.cityId = cityId;
            }

            const response = await ApiService.get('/sitters', params);
            return response;
        } catch (error) {
            console.error('Error obteniendo sitters:', error);
            throw error;
        }
    }

    // Obtener un sitter específico por ID
    async getSitter(sitterId) {
        try {
            const response = await ApiService.get(`/sitters/${sitterId}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo sitter:', error);
            throw error;
        }
    }

    // Crear perfil de sitter
    async createSitterProfile(sitterData) {
        try {
            const response = await ApiService.post('/sitters', sitterData);
            return response;
        } catch (error) {
            console.error('Error creando perfil de sitter:', error);
            throw error;
        }
    }

    // Actualizar perfil de sitter
    async updateSitterProfile(sitterId, sitterData) {
        try {
            const response = await ApiService.put(`/sitters/${sitterId}`, sitterData);
            return response;
        } catch (error) {
            console.error('Error actualizando perfil de sitter:', error);
            throw error;
        }
    }

    // Actualizar parcialmente perfil de sitter
    async patchSitterProfile(sitterId, sitterData) {
        try {
            const response = await ApiService.patch(`/sitters/${sitterId}`, sitterData);
            return response;
        } catch (error) {
            console.error('Error actualizando parcialmente perfil de sitter:', error);
            throw error;
        }
    }

    // Eliminar perfil de sitter
    async deleteSitterProfile(sitterId) {
        try {
            const response = await ApiService.delete(`/sitters/${sitterId}`);
            return response;
        } catch (error) {
            console.error('Error eliminando perfil de sitter:', error);
            throw error;
        }
    }

    // Buscar sitters por ubicación
    async searchSittersByLocation(cityId, page = 0, size = 10) {
        try {
            return await this.getSitters(cityId, page, size);
        } catch (error) {
            console.error('Error buscando sitters por ubicación:', error);
            throw error;
        }
    }

    // Obtener sitters mejor calificados
    async getTopRatedSitters(limit = 10) {
        try {
            const response = await this.getSitters(null, 0, limit, 'averageRating', 'desc');
            return response;
        } catch (error) {
            console.error('Error obteniendo sitters mejor calificados:', error);
            throw error;
        }
    }

    // Formatear datos del sitter para mostrar en el frontend
    formatSitterForDisplay(sitter) {
        return {
            id: sitter.id,
            name: sitter.name || `${sitter.firstName} ${sitter.lastName}`,
            firstName: sitter.firstName,
            lastName: sitter.lastName,
            email: sitter.email,
            phoneNumber: sitter.phoneNumber,
            profilePicture: sitter.profilePicture,
            description: sitter.description,
            experience: sitter.experience,
            rating: sitter.averageRating || 0,
            reviewCount: sitter.reviewCount || 0,
            pricePerHour: sitter.pricePerHour,
            availability: sitter.availability || [],
            services: sitter.services || [],
            address: sitter.address,
            isActive: sitter.isActive,
            isVerified: sitter.isVerified
        };
    }

    // Generar URL de avatar para sitter
    generateSitterAvatarUrl(sitter) {
        if (sitter.profilePicture) {
            return sitter.profilePicture;
        }

        const initials = `${sitter.firstName?.[0] || ''}${sitter.lastName?.[0] || ''}`.toUpperCase();
        return `https://ui-avatars.com/api/?name=${initials}&background=10b981&color=ffffff&size=150`;
    }

    // Calcular distancia (placeholder - necesitaría implementación con geolocalización)
    calculateDistance(sitterAddress, userAddress) {
        // Por ahora retorna una distancia aleatoria
        // En una implementación real, usarías APIs de geolocalización
        return Math.floor(Math.random() * 20) + 1;
    }

    // Verificar disponibilidad del sitter
    isAvailable(sitter, requestedDateTime) {
        if (!sitter.availability || sitter.availability.length === 0) {
            return false;
        }

        const requestedDate = new Date(requestedDateTime);
        const dayOfWeek = requestedDate.getDay();

        return sitter.availability.some(slot =>
            slot.dayOfWeek === dayOfWeek &&
            slot.isAvailable
        );
    }
}

export default new SitterService();