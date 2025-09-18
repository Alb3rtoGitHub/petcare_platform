import { useState, useEffect, useRef, useCallback } from 'react';
import { showNotification } from '../components/NotificationProvider.jsx';

export const useBookingPolling = (loadBookingsFunction, dependencies = [], interval = 30000) => {
    const [previousBookings, setPreviousBookings] = useState([]);
    const intervalRef = useRef(null);
    const isPollingRef = useRef(false);

    // Función para comparar y notificar cambios
    const compareBookings = useCallback((oldBookings, newBookings) => {
        if (!oldBookings || oldBookings.length === 0) return;

        newBookings.forEach(newBooking => {
            const oldBooking = oldBookings.find(old => old.id === newBooking.id);

            if (oldBooking && oldBooking.status !== newBooking.status) {
                const statusMessages = {
                    'ACCEPTED': {
                        type: 'success',
                        title: 'Reserva Aceptada',
                        message: `Tu reserva para ${newBooking.petName || 'tu mascota'} ha sido aceptada por el cuidador.`
                    },
                    'REJECTED': {
                        type: 'warning',
                        title: 'Reserva Rechazada',
                        message: `Tu reserva para ${newBooking.petName || 'tu mascota'} ha sido rechazada. Puedes buscar otro cuidador.`
                    },
                    'COMPLETED': {
                        type: 'success',
                        title: 'Servicio Completado',
                        message: `El servicio para ${newBooking.petName || 'tu mascota'} ha sido completado. ¡Puedes dejar una reseña!`
                    },
                    'CANCELLED': {
                        type: 'info',
                        title: 'Reserva Cancelada',
                        message: `La reserva para ${newBooking.petName || 'tu mascota'} ha sido cancelada.`
                    }
                };

                const statusConfig = statusMessages[newBooking.status?.toUpperCase()];
                if (statusConfig) {
                    showNotification(
                        statusConfig.type,
                        statusConfig.title,
                        statusConfig.message,
                        5000
                    );
                }
            }
        });
    }, []);

    // Función de polling silenciosa
    const silentPoll = useCallback(async () => {
        if (isPollingRef.current) return; // Evitar polling concurrente

        try {
            isPollingRef.current = true;
            const currentBookings = await loadBookingsFunction(true); // silent = true

            if (previousBookings.length > 0 && currentBookings) {
                compareBookings(previousBookings, currentBookings);
            }

            if (currentBookings) {
                setPreviousBookings(currentBookings);
            }
        } catch (error) {
            console.error('Error en polling silencioso:', error);
        } finally {
            isPollingRef.current = false;
        }
    }, [loadBookingsFunction, previousBookings, compareBookings]);

    // Iniciar polling
    const startPolling = useCallback(() => {
        if (intervalRef.current) return; // Ya está corriendo

        intervalRef.current = setInterval(silentPoll, interval);
    }, [silentPoll, interval]);

    // Detener polling
    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Efecto para manejar el polling
    useEffect(() => {
        startPolling();

        return () => {
            stopPolling();
        };
    }, dependencies);

    // Función para actualizar bookings (para usar después de cargas manuales)
    const updateBookings = useCallback((bookings) => {
        setPreviousBookings(bookings || []);
    }, []);

    return {
        startPolling,
        stopPolling,
        updateBookings,
        isPolling: !!intervalRef.current
    };
};

export const useRealtimeBookings = (userId, bookingService, userType = 'owner') => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función de carga de bookings
    const loadBookings = useCallback(async (silent = false) => {
        try {
            if (!silent) {
                setLoading(true);
                setError(null);
            }

            let response;
            if (userType === 'owner') {
                response = await bookingService.getBookingsByUser(userId);
            } else if (userType === 'sitter') {
                // Para sitters, cargar tanto pendientes como aceptadas
                const [pendingResponse, acceptedResponse] = await Promise.all([
                    bookingService.getPendingBookings(),
                    bookingService.getAcceptedBookingsBySitter(userId)
                ]);

                response = {
                    content: [
                        ...(pendingResponse.content || []),
                        ...(acceptedResponse.content || [])
                    ]
                };
            }

            const formattedBookings = response.content || [];
            setBookings(formattedBookings);

            return formattedBookings;
        } catch (err) {
            console.error('Error cargando bookings:', err);
            if (!silent) {
                setError(err.message);
            }
            throw err;
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [userId, bookingService, userType]);

    // Hook de polling
    const { updateBookings } = useBookingPolling(
        loadBookings,
        [userId, userType],
        30000 // 30 segundos
    );

    // Cargar datos iniciales
    useEffect(() => {
        if (userId) {
            loadBookings().then(updateBookings).catch(console.error);
        }
    }, [userId, loadBookings, updateBookings]);

    // Función para refrescar manualmente
    const refresh = useCallback(async () => {
        const freshBookings = await loadBookings(false);
        updateBookings(freshBookings);
        return freshBookings;
    }, [loadBookings, updateBookings]);

    return {
        bookings,
        loading,
        error,
        refresh,
        loadBookings
    };
};

export default useBookingPolling;