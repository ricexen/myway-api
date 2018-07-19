# MayWay API
Un sistema que determine las rutas de transporte público para que los usuarios puedan acceder a ellas y determinar los transportes que pueden utilizar.
### Tecnologías
1. [Express](http://expressjs.com/)
2. [MongoDB](https://www.mongodb.com/)
3. [Mongoose](http://mongoosejs.com/)

### Instalación
Clonar el repositorio con `git clone https://github.com/xentyo/myway-api`
Entrar al respositorio con `cd myway-api` e installar las dependencias con `npm install` o `yarn`
### Configuración
Copiar el archivo `.env.example` a `.env` con `cp .env.example .env` desde la raiz del proyecto
Abres el archivo con tu editor de código favorito y configuras el URI de tu base de datos en mongo
`MONGO_URI=mongodb://<user>:<password>@<host>/<database>`
`MONGO_DB=<database>`
