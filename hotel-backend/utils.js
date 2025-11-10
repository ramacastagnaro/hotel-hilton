// Esta función tomará la lista "plana" de la base de datos y la anidará
export function nestRoomData(rows) {

    const roomMap = new Map();

    // 1. Recorremos cada fila que nos dio la base de datos
    for (const row of rows) {
    
    // 2. Si es la primera vez que vemos esta habitación, creamos su 'entrada'
    if (!roomMap.has(row.room_id)) {
        roomMap.set(row.room_id, {
        // Copiamos los datos principales de la habitación
        room_id: row.room_id,
        name: row.name,
        category: row.category,
        description: row.description,
        capacity: row.capacity,
        price: row.price,
        // Preparamos los arrays vacíos para las listas anidadas
        images: [],
        tariffs: [],
        services: [],
        // Usamos Sets para evitar duplicados fácilmente
        _imageUrls: new Set(),
        _tariffIds: new Set(),
        _serviceIds: new Set(),
        });
    }

    // 3. Obtenemos la habitación de nuestro Map
    const room = roomMap.get(row.room_id);

    // 4. Añadimos la imagen (si no es nula y no la hemos añadido ya)
    if (row.image_url && !room._imageUrls.has(row.image_url)) {
        room.images.push(row.image_url);
        room._imageUrls.add(row.image_url);
    }

    // 5. Añadimos la tarifa (si no es nula y no la hemos añadido ya)
    if (row.tariff_id && !room._tariffIds.has(row.tariff_id)) {
        room.tariffs.push({
        tariff_id: row.tariff_id,
        name: row.tariff_name,
        price: row.tariff_price,
        benefits: row.tariff_benefits
        });
        room._tariffIds.add(row.tariff_id);
    }

    // 6. Añadimos el servicio (si no es nula y no lo hemos añadido ya)
    if (row.service_id && !room._serviceIds.has(row.service_id)) {
        room.services.push({
        id: row.service_id,
        name: row.service_name,
        icon: row.service_icon
        });
        room._serviceIds.add(row.service_id);
    }
    }

    // 7. Limpiamos y devolvemos un array con los valores finales
    const nestedResults = Array.from(roomMap.values());
    nestedResults.forEach(room => {
    delete room._imageUrls;
    delete room._tariffIds;
    delete room._serviceIds;
    });

    return nestedResults;
}