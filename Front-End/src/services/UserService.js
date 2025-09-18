import ApiService from './ApiService.js';

class UserService {
    // Obtener información de un usuario
    async getUser(userId) {
        try {
            const response = await ApiService.get(`/user/${userId}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            throw error;
        }
    }

    // Actualizar información del usuario
    async updateUser(userId, userData, profilePicture = null) {
        try {
            // Si hay imagen, usar FormData
            if (profilePicture) {
                const formData = new FormData();
                formData.append('data', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
                formData.append('file', profilePicture);

                const response = await ApiService.uploadFile(`/user/${userId}`, formData);
                return response;
            } else {
                // Si no hay imagen, enviar solo los datos
                const response = await ApiService.put(`/user/${userId}`, userData);
                return response;
            }
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            throw error;
        }
    }

    // Eliminar un usuario
    async deleteUser(userId) {
        try {
            const response = await ApiService.delete(`/user/${userId}`);
            return response;
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            throw error;
        }
    }

    // Obtener el perfil del usuario actual
    async getCurrentUserProfile() {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('Usuario no autenticado');
            }
            return await this.getUser(userId);
        } catch (error) {
            console.error('Error obteniendo perfil actual:', error);
            throw error;
        }
    }

    // Actualizar el perfil del usuario actual
    async updateCurrentUserProfile(userData, profilePicture = null) {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('Usuario no autenticado');
            }
            return await this.updateUser(userId, userData, profilePicture);
        } catch (error) {
            console.error('Error actualizando perfil actual:', error);
            throw error;
        }
    }

    // Formatear datos del usuario para mostrar en el frontend
    formatUserForDisplay(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            address: user.address ? {
                country: user.address.countryCode,
                region: user.address.region,
                city: user.address.city,
                streetAddress: user.address.streetAddress,
                unit: user.address.unit
            } : null
        };
    }

    // Validar formato de email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar formato de teléfono
    isValidPhone(phone) {
        const phoneRegex = /^\+?[\d\s\-()]+$/;
        return phoneRegex.test(phone);
    }

    // Generar avatar placeholder si no hay imagen
    generateAvatarUrl(user) {
        if (user.profilePicture) {
            return user.profilePicture;
        }

        // Generar avatar basado en iniciales
        const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
        return `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=ffffff&size=150`;
    }
}

export default new UserService();