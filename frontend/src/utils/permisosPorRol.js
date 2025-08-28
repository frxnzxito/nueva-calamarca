export const botonesPorRuta = [
  { ruta: '/usuarios', label: '👥 Usuarios' },
  { ruta: '/produccion', label: '🛠️ Producción' },
  { ruta: '/asistencias', label: '🧑‍🏭 Asistencia' },
  { ruta: '/salida-mineral', label: '🚚 Salida Mineral' },
  { ruta: '/entrada-mineral', label: '⛏️ Entrada Mineral' },
  { ruta: '/planillas', label: '📄 Planillas' },
  { ruta: '/perfil', label: '👤 Perfil' },
  { ruta: '/dias-trabajados', label: '📅 Días Trabajados' },
  { ruta: '/pago', label: '💰 Pago' }
];

export const permisosPorRolId = {
    1:[ //Administrador: 
        '/usuarios',
        '/produccion',
        '/asistencias',
        '/salida-mineral',
        '/entrada-mineral',
        '/planillas',
        '/perfil',
        '/dias-trabajados',
        '/pago'
    ],
    2:[ //Licenciado 
        '/usuarios',
        '/produccion',
        '/asistencias',
        '/entrada-mineral',
        '/salida-mineral',
        '/planillas',
        '/perfil',
        '/dias-trabajados',
        '/pago'
    ],
    3:[ //Encargado de mina: 
        '/usuarios',
        '/produccion',
        '/asistencias',
        '/salida-mineral',
        '/perfil',
    ],
    4:[//Encargado de ingenio
        '/asistencias',
        '/entrada-mineral',
        '/perfil',
        '/dias-trabajados',
        '/pago'
    ],
    5:[ //Chofer:
        '/asistencias',
        '/perfil',
        '/dias-trabajados',
        '/pago'
    ],
    6:[ //Jornalero
        '/asistencias',
        '/produccion',
        '/perfil',
        '/dias-trabajados',
        '/pago'
    ]
};
