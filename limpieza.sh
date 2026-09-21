#!/usr/bin/env bash
# Made by Sinfallas <sinfallas@yahoo.com>
# Licence: GPL-2
LC_ALL=C

if [[ "$EUID" != "0" ]]; then
        echo "ERROR: debe ser root."
        exit 1
fi

clear
echo "Limpiando módulos, cachés de Vite y builds del frontend..."

# Eliminamos la carpeta de distribución y dependencias
rm -rf dist
rm -rf node_modules

# Eliminamos los cachés internos que Vite y Tailwind generan
rm -rf .vite
rm -rf .vite-temp

# Ejecutamos la limpieza profunda de Docker
docker system prune -af

echo "Finalizado."
exit 0
