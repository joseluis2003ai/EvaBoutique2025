require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const sql = require('mssql');

// 1. Primero inicializamos la app
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Luego requerimos los middlewares
const debugMiddleware = require('./debugMiddleware');

// 3. Configuración de middlewares
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(debugMiddleware); // Ahora está después de la inicialización

// 4. Configuración de SQL Server
const dbConfig = {
    server: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'BoutiqueAdmin',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'BoutiqueDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// 5. Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'), false);
        }
    }
});

// 6. Conexión a la base de datos
let pool;
async function initDB() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Conectado a SQL Server');
        
        // Verificación adicional de conexión
        const testResult = await pool.request().query('SELECT 1 AS test');
        console.log('Prueba de conexión exitosa:', testResult.recordset);
    } catch (err) {
        console.error('❌ Error conectando a SQL Server:', err);
        process.exit(1);
    }
}

// 7. Configuración de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// 8. Rutas de la API
// ... (configuraciones previas se mantienen igual)

// 8. Rutas de la API - MODIFICAR ESTA SECCIÓN
app.get('/api/agregar', async (req, res) => {
    try {
        const result = await pool.request()
            .query('SELECT IdProducto, Nombre, Categoria, Precio, Stock, ImagenUrl, Descripcion FROM Productos ORDER BY IdProducto DESC');
        
        // Transformar las URLs de las imágenes para incluir la ruta completa
        const productos = result.recordset.map(producto => ({
            ...producto,
            ImagenUrl: `http://localhost:3000/uploads/${producto.ImagenUrl}`
        }));

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener productos',
            error: error.message 
        });
    }
});

// ... (el resto del código se mantiene igual)

// Otras rutas (get /api/productos, etc.) permanecen igual...

// 9. Iniciar servidor
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ No se pudo iniciar el servidor:', err);
});