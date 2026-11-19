# Práctica Docker – Angular + nginx

Contenedor que **clona** un repositorio público de GitHub, **compila** la aplicación Angular
del equipo y **sirve** el resultado con **nginx**.

- Repositorio clonado: <https://github.com/romemz/curso> (rama `a-diaz`, carpeta `angular-app/`)
- Aplicación: *Curso - Presentaciones del equipo* (Angular 15)

### Origen de la app Angular

El equipo tenía sus tarjetas de presentación como HTML/CSS estático en las ramas del repo
`romemz/curso` (`a-diaz`/`jahir` y `Jaime`). Para convertirlas en una app Angular se tomó
**la plantilla y las dependencias** de <https://github.com/arsenk01/angular-todo>
(`package.json`, `angular.json`, `tsconfig*.json`, `.npmrc`, `browserslist`, Bootstrap, etc.)
y se reemplazó el código de la app de tareas por los componentes del equipo:

| Componente | Origen |
|---|---|
| `app-presentacion-jahir` | `index.html` + `styles.css` (rama `a-diaz` / `jahir`) |
| `app-presentacion-jaime` | `Curso/index.html` + `Curso/styles.css` (rama `Jaime`) |

`AppComponent` muestra los dos componentes juntos en una sola página.

## Integrantes del equipo

- Jair Eduardo
- Rodrigo Mendez
- Jicama Jaime
- NuggetEduardo
- Christian Raul

## Estructura

```
/mi-practica-docker/
├── Dockerfile          # Multi-stage: node (clone + build) -> nginx (serve)
├── docker-compose.yml  # Construye la imagen y publica el puerto 8080
├── .dockerignore       # Excluye archivos innecesarios del contexto de build
├── README.md
└── angular-nginx.tar   # Imagen generada con docker save
```

## Cómo funciona

| Etapa | Imagen base | Qué hace |
|---|---|---|
| `build` | `node:18-alpine` | Instala git, `git clone --depth 1 --branch a-diaz`, entra a `angular-app/`, `npm install`, `ng build --configuration production` |
| final | `nginx:1.27-alpine` | Copia los archivos compilados a `/usr/share/nginx/html` y los sirve en el puerto 80 (con `try_files` para las rutas de Angular) |

Se usa Node 18 porque Angular 15 no es compatible con versiones más nuevas de Node.
Los argumentos `REPO_URL`, `BRANCH` y `APP_DIR` se definen en `docker-compose.yml`
y pueden sobrescribirse con variables de entorno.

## Pasos ejecutados

### 1. Crear los archivos del proyecto

Se crearon `Dockerfile`, `docker-compose.yml`, `.dockerignore` y `README.md` en la carpeta `mi-practica-docker/`.

Validación de la configuración:

```powershell
cd mi-practica-docker
docker compose config
```

### 2. Construir la imagen y levantar el contenedor

```powershell
docker compose up -d --build
```

Resultado: la etapa `build` clonó el repositorio, instaló dependencias y compiló
(`Initial Total 629.27 kB`, ~25 s). Se generó la imagen
`mi-practica-docker/angular-nginx:1.0` y se inició el contenedor `angular-nginx`.

### 3. Verificar

```powershell
docker compose ps
docker images mi-practica-docker/angular-nginx
```

```
NAME            IMAGE                                  STATUS         PORTS
angular-nginx   mi-practica-docker/angular-nginx:1.0   Up             0.0.0.0:8080->80/tcp

IMAGE                                  ID             DISK USAGE   CONTENT SIZE
mi-practica-docker/angular-nginx:1.0   58ffe309c193   79.3MB       22.2MB
```

En el navegador: <http://localhost:8080> → responde `200` con el título **Curso - Presentaciones**
y muestra las tarjetas de Jahir y Jaime.

### 4. Guardar la imagen con `docker save`

```powershell
docker save mi-practica-docker/angular-nginx:1.0 -o angular-nginx.tar
```

Archivo generado: `angular-nginx.tar` (21.2 MB, por debajo del límite de 100 MB de GitHub).

### 5. Subir a GitHub

```powershell
git clone https://github.com/romemz/curso.git
# copiar la carpeta mi-practica-docker/ dentro del repo
cd curso
git add mi-practica-docker
git commit -m "Práctica Docker: Angular + nginx"
git push
```

### 6. Cargar la imagen en otra máquina

```powershell
docker load -i angular-nginx.tar
docker run -d -p 8080:80 mi-practica-docker/angular-nginx:1.0
```

### 7. Detener

```powershell
docker compose down
```
