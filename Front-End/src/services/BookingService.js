import ApiService from './ApiService.js';

class BookingService {
    // Crear una nueva reserva
    async createBooking(bookingData) {
        try {
            const response = await ApiService.post('/bookings', bookingData);
            return response;
        } catch (error) {
            console.error('Error creando reserva:', error);
            throw error;
        }
    }

    // Obtener una reserva específica por ID
    async getBooking(bookingId) {
        try {
            const response = await ApiService.get(`/bookings/${bookingId}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo reserva:', error);
            throw error;
        }
    }

    // Obtener todas las reservas (con paginación)
    async getAllBookings(page = 0, size = 10, sortBy = 'startDateTime') {
        try {
            const response = await ApiService.get('/bookings', {
                page,
                size,
                sortBy
            });
            return response;
        } catch (error) {
            console.error('Error obteniendo todas las reservas:', error);
            throw error;
        }
    }

    // Obtener reservas de un usuario específico
    async getBookingsByUser(userId, page = 0, size = 10, sortBy = 'startDateTime') {
        try {
            const response = await ApiService.get(`/bookings/user/${userId}`, {
                page,
                size,
                sortBy
            });
            return response;
        } catch (error) {
            console.error('Error obteniendo reservas del usuario:', error);
            throw error;
        }
    }

    // Actualizar el estado de una reserva
    async updateBookingStatus(bookingId, status) {
        try {
            const response = await ApiService.patch(`/bookings/${bookingId}/${status}`);
            return response;
        } catch (error) {
            console.error('Error actualizando estado de reserva:', error);
            throw error;
        }
    }

    // Cancelar una reserva
    async cancelBooking(bookingId) {
        try {
            const response = await this.updateBookingStatus(bookingId, 'CANCELLED');
            return response;
        } catch (error) {
            console.error('Error cancelando reserva:', error);
            throw error;
        }
    }

    // Aceptar una reserva (para sitters)
    async acceptBooking(bookingId) {
        try {
            const response = await this.updateBookingStatus(bookingId, 'ACCEPTED');
            return response;
        } catch (error) {
            console.error('Error aceptando reserva:', error);
            throw error;
        }
    }

    // Completar una reserva
    async completeBooking(bookingId) {
        try {
            const response = await this.updateBookingStatus(bookingId, 'COMPLETED');
            return response;
        } catch (error) {
            console.error('Error completando reserva:', error);
            throw error;
        }
    }

    // Rechazar una reserva
    async rejectBooking(bookingId) {
        try {
            const response = await this.updateBookingStatus(bookingId, 'REJECTED');
            return response;
        } catch (error) {
            console.error('Error rechazando reserva:', error);
            throw error;
        }
    }

    // Eliminar una reserva
    async deleteBooking(bookingId) {
        try {
            const response = await ApiService.delete(`/bookings/${bookingId}`);
            return response;
        } catch (error) {
            console.error('Error eliminando reserva:', error);
            throw error;
        }
    }

    // Obtener reservas pendientes para sitters
    async getPendingBookings(page = 0, size = 10) {
        try {
            const response = await this.getAllBookings(page, size);
            // Filtrar solo las reservas pendientes
            const pendingBookings = response.content ?
                response.content.filter(booking => booking.status === 'PENDING') :
                [];

            return {
                ...response,
                content: pendingBookings
            };
        } catch (error) {
            console.error('Error obteniendo reservas pendientes:', error);
            throw error;
        }
    }

    // Obtener reservas aceptadas por un sitter
    async getAcceptedBookingsBySitter(sitterId, page = 0, size = 10) {
        try {
            const response = await ApiService.get(`/bookings/sitter/${sitterId}`, {
                page,
                size,
                sortBy: 'startDateTime'
            });

            // Filtrar solo las reservas aceptadas
            const acceptedBookings = response.content ?
                response.content.filter(booking => booking.status === 'ACCEPTED') : [];

            return {
                ...response,
                content: acceptedBookings
            };
        } catch (error) {
            console.error('Error obteniendo reservas aceptadas del sitter:', error);
            throw error;
        }
    }
}

export default new BookingService();