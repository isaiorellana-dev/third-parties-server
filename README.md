# Third Parties Server

Servidor para consumir APIs y automatizar tareas en aplicaciones de terceros como Notion y Google Drive.

Creado con Node, Express y TypeScript.

## Docs

- [Google Drive](https://developers.google.com/drive/api/reference/rest/v3)
- [Notion](https://developers.notion.com/reference/intro)

## Webhooks disponibles

- Creador de carpetas
  `/n/p?params`

  Recibe los datos de un ticket de Notion con las propiedades necesarias para crear la ruta de carpetas correspondiente en Google Drive.

### Next features

- Enviar correos electronicos de campañas exitosas.
- Comprar numeros tollfree y venviar formulario de verificacion.
