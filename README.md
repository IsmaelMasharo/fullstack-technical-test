# Animal Shelter

## Descripción

Fullstack app para solicitud de adopción de animales usando Django y React.

[Project Live URL](https://animal-shelter-client-mc64i35wj-ismaels-projects-a388b994.vercel.app/login)

## Backend en Django

### Requisitos

- **Versión de Python**: 3.12
- **Dependencias**: Instaladas a través de `requirements.txt`

### Configuración

1. **Clonar el Repositorio**:

```bash
git clone git@github.com:IsmaelMasharo/fullstack-technical-test.git
cd fullstack-technical-test/animal_shelter_api
```

2. **Crear un Entorno Virtual**:

```bash
python -m venv venv
```

3. **Activar el Entorno Virtual**:

En Windows:

```bash
venv\Scripts\activate
```

En macOS/Linux:

```bash
source venv/bin/activate
```

4. **Instalar Dependencias**:

```bash
pip install -r requirements.txt
```

5. **Ejecutar Migraciones**:

```bash
python manage.py migrate
```

6. **Iniciar el Servidor de Desarrollo**:

```bash
python manage.py runserver
```

El servidor estará corriendo en http://localhost:8000.

## Frontend en React

### Requisitos

**Versión de Node**: 22.2

### Configuración

Navegar al Directorio del Frontend:

```bash
cd fullstack-technical-test/animal_shelter_client
```

Instalar Dependencias:

```bash
npm install
```

Iniciar el Servidor de Desarrollo:

```bash
npm run dev
```

La aplicación de React estará corriendo en http://localhost:5173.

---

### TODO

- Tests
- Error responses
