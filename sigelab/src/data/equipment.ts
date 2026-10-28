export type EquipmentCategory =
  | 'Cámara'
  | 'Laptop'
  | 'Proyector'
  | 'Router'
  | 'Switch'
  | 'Tablet'
  | 'Monitor'
  | 'Kit electrónico';

export type EquipmentStatus =
  | 'Disponible'
  | 'En préstamo'
  | 'Dañado'
  | 'En mantenimiento';

export type Equipment = {
  id: string;
  code: string;
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  image: number;
  images: number[];
  brand?: string;
  model?: string;
  serialNumber?: string;
  laboratory?: string;
  codeLaboratory?: string;
  description?: string;
};

export const equipmentData: Equipment[] = [
  {
    id: '1',
    code: 'CAM-001',
    name: 'Cámara réflex',
    category: 'Cámara',
    status: 'Disponible',
    image: require('../../assets/images/equipment/camera/canon.png'),
    images: [
      require('../../assets/images/equipment/camera/canon.png'),
      require('../../assets/images/equipment/camera/canon1.png'),
      require('../../assets/images/equipment/camera/canon2.png'),
      require('../../assets/images/equipment/camera/canon3.png'),
    ],
    brand: 'Canon',
    model: 'EOS Rebel T7',
    serialNumber: 'CN-T7-000101',
    laboratory: 'Laboratorio de Computación',
    codeLaboratory: 'LAB-01',
    description:
      'Cámara para tomar fotografías en actividades educativas y proyectos audiovisuales.',
  },
  {
    id: '2',
    code: 'CAM-002',
    name: 'Cámara web',
    category: 'Cámara',
    status: 'Disponible',
    image: require('../../assets/images/equipment/camera/logitech.png'),
    images: [
      require('../../assets/images/equipment/camera/logitech.png'),
      require('../../assets/images/equipment/camera/logitech1.png'),
      require('../../assets/images/equipment/camera/logitech2.png'),
      require('../../assets/images/equipment/camera/logitech3.png'),
    ],
    brand: 'Logitech',
    model: 'C920',
    serialNumber: 'LG-C920-000102',
    laboratory: 'Laboratorio de Computación',
    codeLaboratory: 'LAB-01',
    description:
      'Cámara para videollamadas, clases virtuales y reuniones en línea.',
  },
  {
    id: '3',
    code: 'LAP-001',
    name: 'Laptop de préstamo 1',
    category: 'Laptop',
    status: 'Disponible',
    image: require('../../assets/images/equipment/laptop/laptopDell.png'),
    images: [
      require('../../assets/images/equipment/laptop/laptopDell.png'),
      require('../../assets/images/equipment/laptop/laptopDell1.png'),
      require('../../assets/images/equipment/laptop/laptopDell2.png'),
      require('../../assets/images/equipment/laptop/laptopDell3.png'),
    ],
    brand: 'Dell',
    model: 'Latitude 5440',
    serialNumber: 'DL-5440-000201',
    laboratory: 'Laboratorio de Computación',
    codeLaboratory: 'LAB-01',
    description:
      'Laptop para prácticas, investigaciones y trabajos educativos.',
  },
  {
    id: '4',
    code: 'LAP-002',
    name: 'Laptop de préstamo 2',
    category: 'Laptop',
    status: 'En préstamo',
    image: require('../../assets/images/equipment/laptop/laptopLenovo.png'),
    images: [
      require('../../assets/images/equipment/laptop/laptopLenovo.png'),
      require('../../assets/images/equipment/laptop/laptopLenovo1.png'),
      require('../../assets/images/equipment/laptop/laptopLenovo2.png'),
      require('../../assets/images/equipment/laptop/laptopLenovo3.png'),
    ],
    brand: 'Lenovo',
    model: 'ThinkPad E14',
    serialNumber: 'LN-E14-000202',
    laboratory: 'Laboratorio de Computación',
    codeLaboratory: 'LAB-01',
    description:
      'Laptop para prácticas, investigaciones y trabajos educativos.',
  },
  {
    id: '5',
    code: 'PRO-001',
    name: 'Proyector portátil',
    category: 'Proyector',
    status: 'Disponible',
    image: require('../../assets/images/equipment/proyector/proyectorEpson.png'),
    images: [
      require('../../assets/images/equipment/proyector/proyectorEpson.png'),
      require('../../assets/images/equipment/proyector/proyectorEpson1.png'),
      require('../../assets/images/equipment/proyector/proyectorEpson2.png'),
      require('../../assets/images/equipment/proyector/proyectorEpson3.png'),
    ],
    brand: 'Epson',
    model: 'TPowerLite X49',
    serialNumber: 'EP-X49-000301',
    laboratory: 'Laboratorio de Computación',
    codeLaboratory: 'LAB-01',
    description: 'Proyector para presentaciones y actividades educativas.',
  },
  {
    id: '6',
    code: 'ROU-001',
    name: 'Router de práctica',
    category: 'Router',
    status: 'Disponible',
    image: require('../../assets/images/equipment/router/routerCisco.png'),
    images: [
      require('../../assets/images/equipment/router/routerCisco.png'),
      require('../../assets/images/equipment/router/routerCisco1.png'),
      require('../../assets/images/equipment/router/routerCisco2.png'),
      require('../../assets/images/equipment/router/routerCisco3.png'),
    ],
    brand: 'Cisco',
    model: 'ISR 4221',
    serialNumber: 'CS-4221-000401',
    laboratory: 'Laboratorio de Redes',
    codeLaboratory: 'LAB-02',
    description:
      'Router para prácticas de configuración de redes y conectividad.',
  },
  {
    id: '7',
    code: 'SWI-001',
    name: 'Switch de práctica',
    category: 'Switch',
    status: 'Disponible',
    image: require('../../assets/images/equipment/switch/switchCisco.png'),
    images: [
      require('../../assets/images/equipment/switch/switchCisco.png'),
      require('../../assets/images/equipment/switch/switchCisco1.png'),
      require('../../assets/images/equipment/switch/switchCisco2.png'),
      require('../../assets/images/equipment/switch/switchCisco3.png'),
    ],
    brand: 'Cisco',
    model: 'Catalyst 2960',
    serialNumber: 'CS-2960-000501',
    laboratory: 'Laboratorio de Redes',
    codeLaboratory: 'LAB-02',
    description:
      'Switch para prácticas de conexión, administración y configuración de redes.',
  },
  {
    id: '8',
    code: 'TAB-001',
    name: 'Tablet de préstamo',
    category: 'Tablet',
    status: 'Disponible',
    image: require('../../assets/images/equipment/tablet/samsungGalaxy.png'),
    images: [
      require('../../assets/images/equipment/tablet/samsungGalaxy.png'),
      require('../../assets/images/equipment/tablet/samsungGalaxy1.png'),
      require('../../assets/images/equipment/tablet/samsungGalaxy2.png'),
      require('../../assets/images/equipment/tablet/samsungGalaxy3.png'),
    ],
    brand: 'Samsung',
    model: 'Galaxy Tab A9',
    serialNumber: 'SM-A9-000601',
    laboratory: 'Laboratorio de Redes',
    codeLaboratory: 'LAB-02',
    description:
      'Tablet para consultar información, realizar actividades educativas y acceder a recursos digitales.',
  },
  {
    id: '9',
    code: 'MON-001',
    name: 'Monitor 24 pulgadas',
    category: 'Monitor',
    status: 'Disponible',
    image: require('../../assets/images/equipment/monitor/monitorLG.png'),
    images: [
      require('../../assets/images/equipment/monitor/monitorLG.png'),
      require('../../assets/images/equipment/monitor/monitorLG1.png'),
      require('../../assets/images/equipment/monitor/monitorLG2.png'),
      require('../../assets/images/equipment/monitor/monitorLG3.png'),
    ],
    brand: 'LG',
    model: '24MP400',
    serialNumber: 'LG-24MP-000701',
    laboratory: 'Laboratorio de Electrónica',
    codeLaboratory: 'LAB-03',
    description:
      ' Monitor para visualizar información y realizar prácticas de computación y electrónica.',
  },
  {
    id: '10',
    code: 'KIT-001',
    name: 'Kit Arduino',
    category: 'Kit electrónico',
    status: 'Disponible',
    image: require('../../assets/images/equipment/arduino/arduino.png'),
    images: [
      require('../../assets/images/equipment/arduino/arduino.png'),
      require('../../assets/images/equipment/arduino/arduino1.png'),
      require('../../assets/images/equipment/arduino/arduino2.png'),
      require('../../assets/images/equipment/arduino/arduino3.png'),
    ],
    brand: 'Arduino',
    model: 'Starter Kit UNO R3',
    serialNumber: '',
    laboratory: 'Laboratorio de Electrónica',
    codeLaboratory: 'LAB-03',
    description:
      'Kit electrónico para prácticas de programación, circuitos y proyectos de robótica.',
  },
];
