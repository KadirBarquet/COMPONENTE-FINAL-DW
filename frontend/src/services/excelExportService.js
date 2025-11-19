import * as XLSX from 'xlsx';

const excelExportService = {
    // Exportar datos de usuario a Excel
    exportUserData: (userData, settings) => {
        const workbook = XLSX.utils.book_new();

        // Hoja 1: Información del Usuario
        const userSheet = XLSX.utils.json_to_sheet([
            {
                'Campo': 'Nombre de Usuario',
                'Valor': userData.username
            },
            {
                'Campo': 'Email',
                'Valor': userData.email
            },
            {
                'Campo': 'Rol',
                'Valor': userData.role
            },
            {
                'Campo': 'Fecha de Registro',
                'Valor': new Date(userData.created_at).toLocaleDateString('es-ES')
            },
            {
                'Campo': 'Fecha de Exportación',
                'Valor': new Date().toLocaleDateString('es-ES')
            }
        ]);

        // Hoja 2: Configuración
        const settingsSheet = XLSX.utils.json_to_sheet([
            {
                'Configuración': 'Idioma',
                'Valor': settings.language
            },
            {
                'Configuración': 'Zona Horaria',
                'Valor': settings.timezone
            },
            {
                'Configuración': 'Tema',
                'Valor': settings.theme
            },
            {
                'Configuración': 'Notificaciones por Email',
                'Valor': settings.emailNotifications ? 'Habilitado' : 'Deshabilitado'
            },
            {
                'Configuración': 'Visibilidad del Perfil',
                'Valor': settings.profileVisibility
            },
            {
                'Configuración': 'Email Visible',
                'Valor': settings.showEmail ? 'Sí' : 'No'
            }
        ]);

        // Agregar las hojas al workbook
        XLSX.utils.book_append_sheet(workbook, userSheet, 'Usuario');
        XLSX.utils.book_append_sheet(workbook, settingsSheet, 'Configuración');

        // Descargar el archivo
        const filename = `datos-usuario-${userData.username}-${Date.now()}.xlsx`;
        XLSX.writeFile(workbook, filename);

        return { success: true, filename };
    },

    // Exportar datos genéricos a Excel
    exportToExcel: (data, filename, sheetName = 'Datos') => {
        try {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Ajustar ancho de columnas automáticamente
            const maxWidth = 50;
            const colWidth = data.length > 0
                ? Object.keys(data[0]).map(key => ({
                    wch: Math.min(key.length, maxWidth)
                }))
                : [];
            worksheet['!cols'] = colWidth;

            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            XLSX.writeFile(workbook, `${filename}-${Date.now()}.xlsx`);

            return { success: true, message: 'Datos exportados exitosamente' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export default excelExportService;