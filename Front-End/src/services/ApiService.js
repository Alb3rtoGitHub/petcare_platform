// Servicio base para todas las peticiones API
import { showNotification } from '../components/NotificationProvider.jsx';

const BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
    constructor() {
        this.baseURL = BASE_URL;
    }

    // Helper para obtener headers con token de autenticación
    getHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Helper para manejar respuestas
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error del servidor' }));
            throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    // Método genérico para GET
    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        });

        return this.handleResponse(response);
    }

    // Método genérico para POST
    async post(endpoint, data = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });

        return this.handleResponse(response);
    }

    // Método genérico para PUT
    async put(endpoint, data = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });

        return this.handleResponse(response);
    }

    // Método genérico para PATCH
    async patch(endpoint, data = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });

        return this.handleResponse(response);
    }

    // Método genérico para DELETE
    async delete(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        if (response.status === 204 || response.status === 200) {
            return { success: true };
        }

        return this.handleResponse(response);
    }

    // Método para upload de archivos
    async uploadFile(endpoint, formData) {
        const token = localStorage.getItem('authToken');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData
        });

        return this.handleResponse(response);
    }
}

export default new ApiService();