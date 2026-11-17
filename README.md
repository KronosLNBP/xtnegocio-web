# xtnegocio-web

Sitio de **XT Negocio** (https://www.xtnegocio.com.mx): partner autorizado de Certiprof en México. Certificaciones internacionales, capacitación para empresas e inclusión digital para adultos mayores. Parte de Grupo Empresarial Díaz.

Sitio estático (HTML, CSS y JavaScript, sin compilación).

## Estructura

```
index.html                 Página de inicio (una sola página con secciones)
aviso-de-privacidad.html   Aviso de privacidad
404.html                   Página de error
inclusion-digital.html     Redirige a /#inclusion        (página del sitio anterior)
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
- Testimonios reales y fotos (equipo, alumnos, programa de inclusión digital).
- Correo con dominio propio (por ejemplo contacto@xtnegocio.com.mx).

## Publicación
Cada cambio en `main` se publica por FTP (`.github/workflows/deploy.yml`) con los secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` y `FTP_SERVER_DIR` de este repositorio. Antes de subir, el flujo respalda las páginas que reemplaza en los *Artifacts* de cada ejecución (90 días).
