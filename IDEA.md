# PRD — Misiones en Casa

## 1. Resumen del Producto

**Nombre:** Misiones en Casa  
**Tipo:** Web App familiar  
**Objetivo:** Gamificar las tareas domésticas mediante un sistema de misiones con recompensas económicas para niños.

La aplicación permite a un administrador (padre/madre) crear tareas pagadas y a los hijos autoasignarse misiones, completarlas y recibir recompensas tras aprobación.

---

## 2. Objetivos

### Objetivo principal
Motivar a los niños a realizar tareas domésticas mediante un sistema visual, divertido y gamificado.

### Objetivos secundarios
- Simplificar la gestión de tareas familiares
- Evitar conflictos sobre quién hizo qué
- Hacer transparente el sistema de recompensas
- Fomentar hábitos y responsabilidad

---

## 3. Usuarios

### Administrador (Padre/Madre)
- Crea y gestiona misiones
- Revisa tareas completadas
- Marca tareas como pagadas
- Consulta progreso de los hijos

### Niño/a (Usuario infantil)
- Visualiza misiones disponibles
- Se autoasigna misiones
- Marca misiones como completadas
- Consulta recompensas y progreso

---

## 4. Propuesta de Valor

- Convierte tareas en **misiones**
- Introduce **recompensas económicas + XP**
- Usa elementos de **gamificación (niveles, insignias, rachas)**
- Interfaz visual, clara y atractiva para niños

---

## 5. Alcance (MVP)

### Incluye
- Perfiles (admin + hijos)
- Crear misiones
- Lista de misiones
- Autoasignación
- Marcar como completada
- Revisión (aprobar/rechazar)
- Marcar como pagada
- Saldo por hijo
- Historial básico
- Avatares y colores
- Feedback visual (confeti)

### Excluye (fase futura)
- Subida de fotos
- Insignias complejas
- Notificaciones
- Rankings
- Tienda de recompensas

---

## 6. Funcionalidades

### 6.1. Crear misión (Admin)

Campos:
- título
- descripción
- recompensa (€)
- xp_reward
- categoría
- dificultad
- rareza (común/especial/épica)
- asignación (todos o hijo específico)
- fecha límite (opcional)
- repetible (boolean)

---

### 6.2. Ver misiones (Niños)

Cada misión muestra:
- título
- recompensa
- dificultad
- estado
- disponibilidad

Acción principal:
- "Aceptar misión"

---

### 6.3. Autoasignación

Reglas:
- solo si está disponible
- máximo 1 usuario por misión
- opcional: límite de misiones activas por usuario

---

### 6.4. Misiones del usuario

Secciones:
- En curso
- Pendientes de revisión
- Completadas
- Pagadas

Acciones:
- marcar como completada

---

### 6.5. Revisión (Admin)

Estados:
- disponible
- asignada
- completada (pendiente revisión)
- aprobada
- pagada
- rechazada

Acciones:
- aprobar
- rechazar
- marcar como pagada

---

### 6.6. Sistema de recompensas

Por usuario:
- total ganado
- pendiente de pago
- total pagado
- misiones completadas
- XP acumulado

---

## 7. Gamificación

### 7.1. XP y niveles
- cada misión otorga XP
- niveles progresivos

Ejemplo:
- Nivel 1: Explorador
- Nivel 2: Ayudante Pro
- Nivel 3: Maestro del Orden

---

### 7.2. Insignias (fase futura)
- primera misión
- 10 misiones completadas
- racha de días

---

### 7.3. Rachas (fase futura)
- completar al menos 1 misión diaria
- contador visual

---

### 7.4. Feedback visual
- confeti al completar
- mensajes positivos
- animaciones simples

---

## 8. UX / UI

### Estilo
- colorido
- tarjetas grandes
- iconos y emojis
- tipografía amigable

### Tono
- "misiones" en lugar de tareas
- "recompensas" en lugar de pagos
- mensajes positivos y motivadores

---

## 9. Pantallas

### 9.1. Selección de perfil
- lista de hijos con avatar
- acceso a modo admin

---

### 9.2. Vista niño
- resumen (nivel, saldo)
- misiones disponibles
- misiones en curso
- historial

---

### 9.3. Vista admin
- crear misión
- lista de misiones
- pendientes de revisión
- pendientes de pago
- resumen por hijo

---

### 9.4. Detalle de misión
- información completa
- estado
- acciones disponibles

---

## 10. Modelo de Datos

### Usuario
- id
- nombre
- rol (admin | child)
- avatar
- color
- pin

---

### Misión
- id
- título
- descripción
- recompensa_amount
- xp_reward
- categoría
- dificultad
- rareza
- estado
- assigned_child_id
- allowed_child_id
- due_date
- created_at
- updated_at
- completed_at
- approved_at
- paid_at

---

### Comentario
- id
- mission_id
- author_id
- text
- created_at

---

### Insignia (futuro)
- id
- nombre
- descripción
- icono

---

## 11. Reglas de negocio

1. Una misión solo puede estar asignada a un usuario
2. Solo el usuario asignado puede completarla
3. Solo el admin puede aprobar o pagar
4. El importe es fijo
5. Una misión rechazada puede volver a disponible o asignada
6. Misiones repetibles crean nuevas instancias

---

## 12. Arquitectura (propuesta)

- Next.js (fullstack)
- SQLite
- Docker (1 contenedor)
- volumen persistente para DB

---

## 13. Flujo principal

### Admin
1. Crear misión
2. Publicar
3. Revisar completadas
4. Aprobar
5. Marcar como pagada

### Niño
1. Ver misiones
2. Aceptar misión
3. Completar
4. Marcar como completada
5. Ver recompensa

---

## 14. Métricas de éxito

- uso recurrente por los niños
- número de misiones completadas
- facilidad de uso sin ayuda
- reducción de discusiones familiares
- satisfacción del administrador

---

## 15. Futuras mejoras

- notificaciones
- subida de fotos
- rankings
- tienda de recompensas
- misiones aleatorias
- bonus sorpresa
- modo vacaciones

---

## 16. Resumen ejecutivo

Aplicación web familiar que transforma tareas domésticas en misiones gamificadas con recompensas económicas. Permite a los niños autoasignarse tareas, completarlas y recibir recompensas tras validación del administrador, todo en una experiencia visual y motivadora.
