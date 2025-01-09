# Consulta de precios SAP-SF

Este proyecto permite consultar y actualizar precios entre los sistemas SAP y Salesforce. Proporciona una interfaz intuitiva para que los usuarios puedan comparar precios y, si es necesario, actualizar los datos en Salesforce con base en la información de SAP.

## Características principales

- Consulta de precios desde SAP y Salesforce.
- Actualización de precios incorrectos en Salesforce.
- Sincronización automática al presionar un botón.
- Comparación visual de precios en la interfaz de usuario.

---

## Tecnologías utilizadas

### Frontend
- **Angular**: Framework para la creación de una interfaz de usuario dinámica.
- **TypeScript**: Tipado estático para mayor seguridad y escalabilidad.


## Requisitos previos

1. **Node.js** y **Angular CLI** instalados.
2. **Servidor PHP local**: Configurado con acceso al archivo `api.php`.
3. **MySQL**: Base de datos configurada con las tablas:
   - `NT_SAP`
   - `ITM1`
4. **Configuración del servidor local**:
   - Servidor: `10.57.1.163`

---

## Instalación y configuración

### Frontend

1. Instala las dependencias del proyecto Angular:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```
3. Accede a la aplicación en tu navegador:
   ```
   http://localhost:4200
   ```

---

## Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo y modificarlo libremente, siempre y cuando menciones al autor original.
