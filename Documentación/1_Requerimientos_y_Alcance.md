# 1. Requerimientos y Alcance del Proyecto

Este documento describe la base del proyecto **FreelanceFlow CRM**, el problema que resuelve, quiénes lo usarán y qué funciones incluye la aplicación para ayudar a organizar el flujo de trabajo de los trabajadores independientes.

---

## 1. ¿Qué es FreelanceFlow CRM?

Es un sistema web diseñado para que los **trabajadores independientes (freelancers)** puedan auto-gestionar su cartera de clientes, dar seguimiento a sus proyectos en curso y monitorear el progreso de las tareas asociadas.

### 1.1 El Problema (Situación Actual)
Muchos freelancers no cuentan con un sistema organizado para administrar a sus clientes y proyectos. Suelen usar hojas de cálculo, cuadernos o múltiples herramientas dispersas. Esto genera desorden, olvido de entregas y dificultad para calcular sus ganancias reales.

### 1.2 La Solución (Situación Esperada)
Con FreelanceFlow CRM, el freelancer tiene un panel único (dashboard) donde visualiza sus clientes, proyectos activos y próximas entregas. Esto incrementa la productividad, mejora la organización del tiempo y proporciona claridad financiera sobre sus proyectos pagados y pendientes.

---

## 2. Público Objetivo

El sistema está orientado a profesionales autónomos que manejan varios clientes y proyectos de forma simultánea, tales como:
*   Desarrolladores de software y diseñadores web.
*   Diseñadores gráficos e ilustradores.
*   Editores de video, animadores y fotógrafos.
*   Consultores, redactores de contenido y gestores de proyectos (Project Managers).

---

## 3. Características Principales de la Aplicación

1.  **Inicio de Sesión Seguro:** Acceso restringido mediante correo electrónico y contraseña única.
2.  **Gestión Centralizada:** Un directorio completo para registrar clientes y asociarles proyectos específicos.
3.  **Visualización de Estatus:** Un tablero visual para conocer en qué fase se encuentra cada proyecto (Pendiente, En Progreso, Completado).
4.  **Panel de Métricas (Dashboard):** Tarjetas con indicadores rápidos (KPIs) sobre el total de clientes, proyectos activos y alertas de entregas urgentes o retrasadas.
5.  **Lista de Tareas:** Un espacio para monitorear las tareas pendientes y en progreso necesarias para culminar un proyecto.

---

## 4. Alcance del Proyecto

El proyecto está diseñado como un **MVP (Producto Mínimo Viable)**. Esto significa que nos enfocamos en las funciones esenciales de administración antes de agregar características más complejas.

*   **Frontend (Interfaz de Usuario):** Pantallas limpias, modernas y responsivas (que se adaptan a teléfonos móviles, tabletas y computadoras) creadas con tecnologías web nativas.
*   **Backend (Servidor):** Un servidor de Node.js que gestiona las peticiones de datos, valida la seguridad y realiza los procesos internos.
*   **Base de Datos:** Un almacenamiento estructurado que vincula a cada freelancer con sus respectivos clientes, proyectos y facturas.

### 4.1 Limitaciones del Sistema
*   **Equipo:** Desarrollado por un equipo académico de dos personas.
*   **Gestión de Pagos:** El sistema no cobra dinero real ni se integra con bancos o pasarelas de pago (como PayPal o Stripe). Solo registra de forma manual el estado del cobro (si ya fue pagado o está pendiente) con fines administrativos.
*   **Monousuario Local:** Cada freelancer tiene control completo y exclusivo sobre su información registrada.

---

## 5. Requerimientos del Sistema

Para entender los requerimientos de forma sencilla:
*   **Requerimiento Funcional:** Lo que el sistema **debe hacer** obligatoriamente (las funciones).
*   **Requerimiento No Funcional:** Las características de **cómo** debe funcionar (velocidad, seguridad, diseño).

### 5.1 Requerimientos Funcionales
*   **Módulo de Registro e Inicio de Sesión:** El usuario debe poder crear una cuenta e iniciar sesión de forma segura para proteger sus datos.
*   **Módulo de Administración de Clientes (CRUD):** El freelancer puede **C**rear, **R**eer/Visualizar, **U**ptodate/Editar y **D**elete/Eliminar la información de sus clientes (Nombre, Empresa, RFC/NIT, Correo, Teléfono).
*   **Módulo de Administración de Proyectos (CRUD):** Permite crear, editar, visualizar y eliminar proyectos, asignándolos a un cliente específico y definiendo una fecha límite (deadline).
*   **Módulo de Tareas:** Permite registrar y mover tareas según su estado (Pendientes, En Progreso, Completadas) para mantener el control diario del avance.

### 5.2 Requerimientos No Funcionales
*   **Diseño Limpio y Responsivo:** La aplicación web debe ser fácil de usar y verse bien tanto en celulares como en computadoras.
*   **Seguridad de Contraseñas:** Las contraseñas no se guardan como texto simple en la base de datos, sino codificadas mediante encriptación.
*   **Velocidad de Carga:** Al utilizar código limpio y directo en el frontend (Vanilla JavaScript y CSS), las páginas se cargan de forma casi instantánea.
