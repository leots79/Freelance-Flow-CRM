/**
 * Archivo: config.js
 * Propósito: Configuración centralizada de la URL base del API.
 * Este archivo DEBE cargarse ANTES que cualquier otro script JS.
 *
 * INSTRUCCIONES PARA PRODUCCIÓN:
 * Reemplaza 'TU-BACKEND.onrender.com' con la URL real que Render te asigne.
 */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://TU-BACKEND.onrender.com';
