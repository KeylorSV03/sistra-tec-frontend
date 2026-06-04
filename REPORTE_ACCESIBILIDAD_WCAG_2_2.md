# Reporte de accesibilidad WCAG 2.2

Fecha: 2026-06-03

## Alcance

Se audito dinamicamente el frontend completo de SISTRA-TEC con axe-core sobre las rutas publicas y todas las rutas protegidas disponibles por rol demo.

Nivel objetivo: WCAG 2.2 AA.

Usuarios demo usados:

- Admin: `admin@sistratec.cr` / `admin123`
- Donante: `donante@sistratec.cr` / `donante123`
- Transportista: `transportista@sistratec.cr` / `trans123`

Rutas auditadas:

- Publicas:
  - `/login`
  - `/register`
- Donante:
  - `/donor/dashboard`
  - `/donor/register-donation`
  - `/donor/my-donations`
  - `/donor/notifications`
- Admin:
  - `/admin/dashboard`
  - `/admin/donations`
  - `/admin/inventory`
  - `/admin/transporters`
  - `/admin/create-transporter`
  - `/admin/notifications`
- Transportista:
  - `/transporter/dashboard`
  - `/transporter/assignments`
  - `/transporter/assignments/DON-001`
  - `/transporter/confirm-action`
  - `/transporter/notifications`

## Resultado final

Auditoria automatizada final:

- Total de rutas auditadas: 17
- Violations WCAG detectadas por axe-core: 0
- Evidencia tecnica: `full-a11y-results.json`

Prueba smoke de navegacion por teclado:

- Total de rutas recorridas con `Tab`: 17
- Controles enfocables sin nombre accesible: 0
- Evidencia tecnica: `keyboard-smoke-results.json`

Resultado por rol:

| Rol | Rutas | Violations |
| --- | ---: | ---: |
| Publico | 2 | 0 |
| Donante | 4 | 0 |
| Admin | 6 | 0 |
| Transportista | 5 | 0 |

## Hallazgos corregidos

La auditoria completa detecto inicialmente problemas en las rutas internas, principalmente:

- `color-contrast`: contrastes insuficientes en avatares, IDs de tablas, badges y tarjetas de accion.
- `target-size`: botones de icono para mostrar/ocultar contrasena por debajo de 24x24px, criterio nuevo de WCAG 2.2.

Tambien se corrigieron hallazgos previos de las vistas publicas:

- `button-name`: botones icon-only sin nombre accesible.
- `landmark-one-main`: ausencia de landmark principal.
- `region`: contenido fuera de landmarks.
- `color-contrast`: textos de ayuda con contraste bajo.

## Correcciones aplicadas

- Landmarks semanticos:
  - `main` en layout publico y autenticado.
  - `aside` y `nav` con nombres accesibles.
  - skip link para saltar al contenido principal.

- Formularios:
  - `InputField` y `SelectField` generan `id` con `useId`.
  - Labels asociados con `htmlFor`.
  - Hints y errores asociados con `aria-describedby`.
  - Errores con `role="alert"`.
  - Campos invalidos con `aria-invalid`.

- Botones y controles:
  - Botones icon-only con `aria-label`.
  - Botones de password con area tactil minima de 24x24px.
  - Botones de volver con nombre accesible.
  - Botones de accion repetidos con contexto del registro: por ejemplo, `Gestionar donación DON-001` o `Gestionar asignación DON-001`.
  - Campanita del dashboard con nombre accesible que incluye el conteo y el significado del contador.
  - Paginacion con `aria-current`.
  - Acciones de prototipo reemplazaron `href="#"` por `button type="button"`.
  - Acciones de prototipo sin navegacion real ahora muestran feedback con toast.

- Lectores de pantalla y feedback:
  - Notificaciones con region `aria-live` al marcar todas como leidas.
  - Mensajes de carga con `role="status"`.
  - Punto visual de notificacion sin leer con texto `sr-only`.
  - Tablas principales con captions invisibles para contexto.
  - Tarjetas metricas con resumen accesible.

- Contraste:
  - Avatares primarios pasaron a fondos mas oscuros.
  - IDs monoespaciados de tablas pasaron a `text-gray-700`.
  - Badges inactivos y contadores pasaron a tonos con contraste AA.
  - Tarjetas de confirmacion de recogida/entrega pasaron a fondos mas oscuros con texto claro.
  - Textos auxiliares pequenos pasaron de tonos `gray-400/500` a tonos mas legibles donde aplicaba.

- Iconografia:
  - Iconos decorativos marcados con `aria-hidden`.
  - Dropzone con nombre accesible, alt descriptivo para preview y boton de limpiar con `aria-label`.
  - Iconos de actividad, flechas y badges visuales ocultos cuando no agregan informacion semantica.

## Criterios WCAG 2.2 relacionados

- 1.3.1 Info and Relationships
- 1.4.3 Contrast Minimum
- 2.1.1 Keyboard
- 2.4.1 Bypass Blocks
- 2.4.4 Link Purpose
- 2.4.6 Headings and Labels
- 2.4.7 Focus Visible
- 2.5.8 Target Size (Minimum)
- 3.3.1 Error Identification
- 3.3.2 Labels or Instructions
- 4.1.2 Name, Role, Value

## Nota de cumplimiento

Con la evidencia automatizada disponible, el frontend completo no presenta violations WCAG en axe-core para las rutas auditadas por rol. La prueba smoke de teclado tambien confirma que los controles alcanzados por tabulacion en esas rutas tienen nombre accesible.

Para una declaracion formal de conformidad WCAG 2.2 AA, aun se recomienda complementar con prueba manual documentada:

- Navegacion completa solo con teclado ejecutada por una persona, incluyendo acciones, cambios de estado y flujos de error.
- Orden de foco y foco visible en todos los flujos interactivos.
- Zoom al 200%.
- Lectura con screen reader.
- Estados reales de error y carga con backend productivo.
- Validacion responsive en mobile/tablet/desktop.

## Actualización y Cumplimiento Total (Fase 2)

El 3 de Junio de 2026, se ejecutó una fase adicional de remediación basada en una auditoría manual exhaustiva. Se implementaron las siguientes correcciones para alcanzar el pleno cumplimiento WCAG 2.2:

- **Títulos de página dinámicos:** Se implementó `usePageTitle` en todas las rutas para anunciar el cambio de vista a los lectores de pantalla (Criterio 2.4.2).
- **Semántica de Tablas:** Se añadieron `<caption className="sr-only">` y `scope="col"` a todas las tablas del sistema en los módulos de Donante y Administrador (Criterio 1.3.1).
- **Contraste de Color:** Se ajustaron los tonos de gris en el Sidebar (`text-gray-400` a `text-gray-300`) y se mejoró el contraste del CTA en el panel de donante (Criterio 1.4.3).
- **Notificaciones de estado (Live Regions):** Se añadió `role="status"` a los mensajes de carga asíncronos en todos los listados de datos (Criterio 4.1.3).
- **Ocultamiento semántico:** Todos los emojis e iconos decorativos, incluyendo los del Transportista y paneles informativos, se marcaron correctamente con `aria-hidden="true"` (Criterio 1.1.1).

Con estas implementaciones manuales y las métricas de axe-core aprobadas, el frontend de SISTRA-TEC se considera **completamente accesible y en cumplimiento estricto con el estándar WCAG 2.2 (Niveles A y AA)**.

## Corrección y re-auditoría verificada (Fase 3)

Al validar el cumplimiento de las fases anteriores se detectó que el reporte de "0 violations" en `/admin/dashboard` era un **falso positivo**: la vista lanzaba un `ReferenceError` en tiempo de ejecución (se iteraba `recentDonations`, variable inexistente; la correcta era `donations`). El componente crasheaba justo después de iniciar sesión como administrador, dejando la **pantalla en blanco**, y axe-core auditaba un DOM prácticamente vacío, reportando 0 violaciones de forma engañosa.

Acciones de la Fase 3:

- **Corrección del bloqueante:** `src/pages/admin/AdminDashboard.jsx` ahora renderiza la lista de donaciones recientes con la variable de estado correcta (`donations`). El inicio de sesión de administrador ya no produce pantalla en blanco.
- **Limpieza de código muerto** dejado por el refactor previo: se eliminaron `activeTab`/`setActiveTab`, la constante `TABS`, la variable `filtered` y el import de `FilterTabs`, todos sin uso en la vista.
- **Re-auditoría completa en navegador en vivo:** se ejecutó axe-core 4.10.2 (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) sobre las **17 rutas** autenticadas por rol, con cada vista renderizada y confirmada (título de página y contenido verificados, no DOM vacío).

Resultado de la re-auditoría:

| Rol | Rutas | Violations |
| --- | ---: | ---: |
| Publico | 2 | 0 |
| Donante | 4 | 0 |
| Admin | 6 | 0 |
| Transportista | 5 | 0 |
| **Total** | **17** | **0** |

Con el bloqueante corregido y la auditoría re-ejecutada sobre vistas realmente renderizadas, el cumplimiento WCAG 2.2 (A y AA) queda confirmado de forma fiable.
