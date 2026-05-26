# 5. Frontend y Diseño de la Interfaz

Este documento describe la interfaz visual de **FreelanceFlow CRM**, su mapa de navegación, la identidad gráfica acordada y cómo está estructurada la interacción del lado del cliente utilizando JavaScript nativo.

---

## 1. El Mapa del Sitio y Flujo de Navegación

El sitio web está diseñado con un panel administrativo continuo que permite al usuario moverse fácilmente por las distintas secciones utilizando la barra de navegación lateral (**Sidebar**).

Las páginas que componen el sitio son:
*   **Página de Login (`index.html`):** Es la puerta de entrada al sistema. Si el usuario no ha iniciado sesión, es forzado a quedarse aquí. Cuenta con validaciones básicas de formato de correo y longitud de contraseña.
*   **Dashboard de Inicio (`pages/dashboard.html`):** Una vez adentro, es la pantalla de bienvenida. Muestra resúmenes rápidos de ingresos (simulado), proyectos activos, alertas de proyectos en riesgo de entrega y una lista de próximas entregas ordenadas de la más cercana a la más lejana.
*   **Directorio de Clientes (`pages/clients.html`):** Muestra una tabla con todos los clientes del usuario. Permite abrir un formulario flotante (modal) para añadir nuevos clientes o editar sus datos, además de borrarlos directamente.
*   **Gestión de Proyectos (`pages/projects.html`):** Una lista interactiva de proyectos en curso. Al igual que con clientes, permite agregar, editar y eliminar registros usando formularios modales e incluye barras visuales que indican el nivel de progreso del proyecto.
*   **Listado de Tareas (`pages/tasks.html`):** Un tablero visual de tareas estructurado en columnas ("Pendientes" y "En Progreso") que permite monitorear las tareas pendientes del freelancer.

---

## 2. Identidad Visual y Diseño Gráfico

La interfaz visual del proyecto busca transmitir seriedad, orden y modernidad para encajar con el perfil profesional de los usuarios.

### 2.1 Paleta de Colores Corporativa
Los colores principales del sistema están definidos en [variables.css](file:///c:/Users/leove/OneDrive/Semestre%209%20DDMI/ProyectoWeb/ProyectoFreelanceCRM_02/frontend/css/variables.css):
*   **Color Principal (Corporativo):** `#1c1a2f` (Un tono azul/violeta oscuro y elegante para el sidebar y logos).
*   **Color Auxiliar (Acento):** `#4f46e5` (Un color morado brillante para botones y elementos interactivos importantes).
*   **Fondo General:** `#f4f5f7` (Gris muy claro que descansa la vista y da sensación de amplitud).
*   **Color de Superficies:** `#ffffff` (Blanco puro para las tarjetas y tablas de datos).
*   **Colores de Estado:**
    *   **Peligro / Riesgo:** `#ef4444` (Rojo).
    *   **Éxito / Completado:** `#10b981` (Verde).
    *   **Advertencia / Pendiente:** `#f59e0b` (Amarillo/Naranja).

### 2.2 Tipografía
Se utiliza la fuente tipográfica de Google Fonts llamada **Inter**, que es una de las familias tipográficas más populares en el diseño moderno de interfaces web debido a su excelente legibilidad en pantallas pequeñas (teléfonos móviles).

---

## 3. Lógica del Frontend y Manipulación del DOM

La interacción en las pantallas se maneja con **JavaScript Vanilla (nativo)** sin usar frameworks pesados. Esto permite aprender cómo interactúa el navegador con el código HTML:

### 3.1 Control del DOM
JavaScript se conecta a los elementos de HTML a través de comandos como `document.getElementById()` o `document.querySelector()`. Por ejemplo, para capturar cuando un usuario envía un formulario:
```javascript
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evita que la página web recargue
    // ... código para enviar los datos al servidor
});
```

### 3.2 Protección de Rutas (Route Guarding en Frontend)
Al cargar cualquier página interna (como el dashboard), el script [dashboard.js](file:///c:/Users/leove/OneDrive/Semestre%209%20DDMI/ProyectoWeb/ProyectoFreelanceCRM_02/frontend/js/dashboard.js) revisa si el token de seguridad existe en la memoria local:
*   Si existe la clave `ff_token`, se carga la información con normalidad.
*   Si no existe y el sitio web está corriendo en un servidor web real, la página expulsa al usuario al login (`index.html`) para evitar accesos no autorizados.

### 3.3 Consumo Dinámico de la API
Tanto `clients.js` como `projects.js` consumen los servicios del backend haciendo peticiones asíncronas (`async/await`) con la función nativa `fetch()`. Esto permite crear un flujo fluido donde los datos se guardan o se borran de forma inmediata en la pantalla.

---

## 4. Guía de Estilos de Código (Convenciones CSS)

Para mantener el código ordenado entre los desarrolladores, se siguen estas reglas de nomenclatura en los estilos:
*   **Nombres de clases CSS:** Se escriben usando el formato **camelCase** (la primera palabra en minúscula y las siguientes palabras inician con mayúscula, ej: `.cardHeader`, `.btnSecondary`, `.dataTable`).
*   **Diseño Responsivo:** Se utilizan consultas de medios (`@media`) en CSS para ajustar el tamaño del menú y de las tarjetas de manera que la página sea 100% funcional en dispositivos móviles de cualquier tamaño.
*   **Variables CSS:** Todos los colores y fuentes comunes deben llamarse usando variables de CSS (ej. `var(--primaryColor)`) para facilitar cambios rápidos de diseño en el futuro.
