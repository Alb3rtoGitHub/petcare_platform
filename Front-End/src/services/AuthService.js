import ApiService from './ApiService.js';

class AuthService {
    // Login de usuario
    async login(email, password) {
        try {
            const response = await ApiService.post('/auth', {
                email,
                password
            });

            // Guardar token y datos del usuario
            if (response.token) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userId', response.id);

                // Obtener información completa del usuario
                const userInfo = await this.getUserInfo(response.id);
                return {
                    ...response,
                    user: userInfo
                };
            }

            return response;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    // Registro de usuario
    async register(registerData) {
        try {
            const response = await ApiService.post('/auth/register', registerData);
            return response;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    // Obtener información del usuario logueado
    async getUserInfo(userId) {
        try {
            const response = await ApiService.get(`/user/${userId}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo info del usuario:', error);
            throw error;
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('pc_user');
    }

    // Verificar si el usuario está logueado
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    // Obtener token actual
    getToken() {
        return localStorage.getItem('authToken');
    }

    // Obtener ID del usuario actual
    getCurrentUserId() {
        return localStorage.getItem('userId');
    }

    // Decodificar JWT para obtener roles y otros datos
    decodeToken() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decodificando token:', error);
            return null;
        }
    }

    // Obtener rol del usuario actual
    getCurrentUserRole() {
        const decoded = this.decodeToken();
        if (!decoded || !decoded.roles) return null;

        const role = decoded.roles[0];
        // Convertir roles del backend al formato del frontend
        if (role === 'ROLE_OWNER') return 'owner';
        if (role === 'ROLE_SITTER') return 'sitter';
        if (role === 'ROLE_ADMIN') return 'admin';

        return role?.toLowerCase();
    }
}

export default new AuthService();