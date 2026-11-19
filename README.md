# xtnegocio-web

Sitio de **XT Negocio** (https://www.xtnegocio.com.mx): partner autorizado de Certiprof en México. Certificaciones internacionales, capacitación para empresas e inclusión digital para adultos mayores. Parte de Grupo Empresarial Díaz.

Sitio estático (HTML, CSS y JavaScript, sin compilación).

## Estructura

```
index.html                 Página de inicio (una sola página con secciones)
empresas.html              Capacitación y certificación para empresas (cotización por WhatsApp)
inclusion-digital.html     Programa de Inclusión Digital para adultos mayores (informes por WhatsApp)
testimonios.html           Fotos y videos de alumnos en clase y con su constancia (visor de fotos en js/main.js)
img/testimonios/           Fotos (.webp, versión -sm para miniaturas) y portadas de video
video/testimonios/         Videos de testimonios (MP4 H.264 480 px, con faststart)
aviso-de-privacidad.html   Aviso de privacidad
404.html                   Página de error
mision.html, ventajas.html Redirigen a /#ventajas        (páginas del sitio anterior)
certificaciones.html       Redirige a /#certificaciones  (reemplaza la página hackeada)
contacto.html              Redirige a /#contacto         (página del sitio anterior)
css/styles.css             Estilos
js/config.js               Número de WhatsApp (editar aquí)
js/main.js                 Menú y formulario
img/logo-xtnegocio.png     Logo
```

## Seguridad
El 14 nov 2026 `certificaciones.html` del sitio anterior mostraba spam de apuestas (hackeo). Este sitio la reemplaza por una redirección limpia. Además conviene:
- Cambiar la contraseña del hosting/cPanel y de las cuentas FTP.
- Revisar en el administrador de archivos si hay archivos desconocidos o modificados recientemente.
- En Google Search Console, pedir que se vuelva a rastrear el sitio y revisar si hay avisos de seguridad.

## Datos de contacto usados
- Holbein #135, Col. Noche Buena, Benito Juárez, 03720 CDMX
- WhatsApp: 55 4394 3214 (en `js/config.js`) · Teléfono: 55 4034 3603
- xtnegocio@gmail.com

## Pendientes
- Confirmar los dos teléfonos (el sitio anterior mostraba ambos).
- Catálogo real de certificaciones que ofrece XT Negocio, con duración y precio (hoy se muestran las áreas de Certiprof y se consulta por WhatsApp).
- Fotos del equipo. (Las fotos y videos de alumnos ya están en testimonios.html; se publicaron con su autorización.)
- Correo con dominio propio (por ejemplo contacto@xtnegocio.com.mx).

## Publicación
Cada cambio en `main` se publica por FTP (`.github/workflows/deploy.yml`) con los secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` y `FTP_SERVER_DIR` de este repositorio. Antes de subir, el flujo respalda las páginas que reemplaza en los *Artifacts* de cada ejecución (90 días).
