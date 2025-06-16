module.exports = (req, res, next) => {
    console.log('\n══════════════════════════════════════');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Mostrar headers relevantes
    console.log('\n📦 Headers:');
    const relevantHeaders = {
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? '*****' : 'No presente',
        'origin': req.headers['origin']
    };
    console.log(relevantHeaders);

    // Mostrar body para métodos que lo usan
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        console.log('\n📝 Body:');
        console.log(req.body);
    }

    // Mostrar información de archivos si existen
    if (req.file) {
        console.log('\n📎 Archivo subido:');
        console.log({
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: `${(req.file.size / 1024).toFixed(2)} KB`
        });
    } else if (req.files) {
        console.log('\n📎 Archivos subidos:', req.files.length);
    }

    console.log('══════════════════════════════════════\n');
    next();
};