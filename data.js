const WorkshatiData = {

  carTypes: [
    { id: 'sedan', name: { ar: 'سيدان', en: 'Sedan' }, icon: 'fa-car' },
    { id: 'suv', name: { ar: 'دفع رباعي', en: 'SUV' }, icon: 'fa-car' },
    { id: 'pickup', name: { ar: 'بيك أب', en: 'Pickup' }, icon: 'fa-truck' },
    { id: 'hatchback', name: { ar: 'هاتشباك', en: 'Hatchback' }, icon: 'fa-car' },
    { id: 'coupe', name: { ar: 'كوبيه', en: 'Coupe' }, icon: 'fa-car' },
    { id: 'van', name: { ar: 'فان', en: 'Van' }, icon: 'fa-van' },
  ],

  systems: [
    {
      id: 'engine',
      name: { ar: 'نظام المحرك', en: 'Engine System' },
      icon: 'fa-fire',
      image: 'engine_system.png',
      color: '#C9A84C',
      partsCount: 2,
      faultsCount: 1,
      description: {
        ar: 'قلب السيارة الذي يحوّل الوقود إلى طاقة حركية.',
        en: 'The heart of the car that converts fuel into kinetic energy.'
      },
      badge: { ar: 'الأكثر أهمية', en: 'Most Important' }
    },
    {
      id: 'brakes',
      name: { ar: 'نظام الفرامل', en: 'Brake System' },
      icon: 'fa-circle-stop',
      image: 'braking_system.png',
      color: '#D64045',
      partsCount: 2,
      faultsCount: 1,
      description: {
        ar: 'النظام المسؤول عن إيقاف السيارة وإبطاء سرعتها بأمان.',
        en: 'The system responsible for stopping and slowing the car safely.'
      },
      badge: { ar: 'سلامة حيوية', en: 'Vital Safety' }
    },
    {
      id: 'battery',
      name: { ar: 'نظام البطارية والكهرباء', en: 'Battery & Electrical' },
      icon: 'fa-battery-full',
      image: 'battery_electrical_system.png',
      color: '#2D6A4F',
      partsCount: 1,
      faultsCount: 1,
      description: {
        ar: 'يوفر الطاقة الكهربائية لجميع أجزاء السيارة.',
        en: 'Provides electrical power to all parts of the car.'
      },
      badge: { ar: 'طاقة السيارة', en: 'Car Power' }
    },
    {
      id: 'suspension',
      name: { ar: 'نظام التعليق', en: 'Suspension System' },
      icon: 'fa-car',
      image: 'suspension_system.png',
      color: '#1B4F72',
      partsCount: 1,
      faultsCount: 1,
      description: {
        ar: 'يمتص الصدمات ويحافظ على استقرار السيارة.',
        en: 'Absorbs shocks and maintains vehicle stability.'
      },
      badge: { ar: 'راحة القيادة', en: 'Driving Comfort' }
    },
    {
      id: 'cooling',
      name: { ar: 'نظام التبريد', en: 'Cooling System' },
      icon: 'fa-fan',
      image: 'cooling_system.png',
      color: '#0077B6',
      partsCount: 1,
      faultsCount: 1,
      description: {
        ar: 'يحافظ على درجة حرارة المحرك ضمن النطاق الآمن.',
        en: 'Maintains the engine temperature within the safe range.'
      },
      badge: { ar: 'حماية المحرك', en: 'Engine Protection' }
    },
    {
      id: 'transmission',
      name: { ar: 'نظام ناقل الحركة (القير)', en: 'Transmission System' },
      icon: 'fa-cog',
      image: 'transmission_system.png',
      color: '#6A0572',
      partsCount: 1,
      faultsCount: 1,
      description: {
        ar: 'ينقل الطاقة من المحرك إلى العجلات ويتحكم في السرعة.',
        en: 'Transfers power from the engine to the wheels.'
      },
      badge: { ar: 'نقل الطاقة', en: 'Power Transfer' }
    }
  ],

  parts: [
    {
      id: 'radiator',
      systemId: 'cooling',
      name: { ar: 'الرديتر (المبرد)', en: 'Radiator' },
      image: 'radiator.png',
      icon: 'fa-fan',
      description: { ar: 'يبرد سائل التبريد', en: 'Cools the coolant' },
      function: { ar: 'تبريد السائل', en: 'Cooling the coolant' },
      lifespan: { ar: '100,000 - 200,000 كم', en: '100,000 - 200,000 km' },
      replacementCost: { ar: '150 - 200 ريال', en: '$150 - $600' },
      maintenanceTip: { ar: 'افحص مستوى السائل أسبوعياً', en: 'Check coolant level weekly' },
      difficulty: { ar: 'متوسط', en: 'Medium' },
      urgency: 'high'
    },
    {
      id: 'water-pump',
      systemId: 'cooling',
      name: { ar: 'طرمبة الماء', en: 'Water Pump' },
      image: 'water_pump.png',
      icon: 'fa-water',
      description: { ar: 'تضخ سائل التبريد', en: 'Pumps coolant' },
      function: { ar: 'ضخ السائل', en: 'Pumping coolant' },
      lifespan: { ar: '60,000 - 100,000 كم', en: '60,000 - 100,000 km' },
      replacementCost: { ar: '300 - 1,000 ريال', en: '$100 - $320' },
      maintenanceTip: { ar: 'استبدل مع سير التوقيت', en: 'Replace with timing belt' },
      difficulty: { ar: 'متوسط', en: 'Medium' },
      urgency: 'high'
    },
    {
      id: 'brake-pad',
      systemId: 'brakes',
      name: { ar: 'فحمات الفرامل', en: 'Brake Pad' },
      image: 'brake_pads.png',
      icon: 'fa-circle-stop',
      description: { ar: 'قطعة الاحتكاك للفرامل', en: 'Friction pad for brakes' },
      function: { ar: 'إبطاء السيارة', en: 'Slowing the car' },
      lifespan: { ar: '30,000 - 70,000 كم', en: '30,000 - 70,000 km' },
      replacementCost: { ar: '50 - 150 ريال', en: '$50 - $200' },
      maintenanceTip: { ar: 'افحص التيل كل 20,000 كم', en: 'Check pads every 20,000 km' },
      difficulty: { ar: 'متوسط', en: 'Medium' },
      urgency: 'critical'
    },
    {
      id: 'brake-disc',
      systemId: 'brakes',
      name: { ar: 'هوب الفرامل', en: 'Brake Disc' },
      image: 'brake_disc.png',
      icon: 'fa-circle',
      description: { ar: 'القرص المعدني للفرامل', en: 'Metal brake disc' },
      function: { ar: 'التوقف الآمن', en: 'Safe stopping' },
      lifespan: { ar: '60,000 - 120,000 كم', en: '60,000 - 120,000 km' },
      replacementCost: { ar: '300 - 1,200 ريال', en: '$100 - $400' },
      maintenanceTip: { ar: 'استبدل عند التآكل', en: 'Replace when worn' },
      difficulty: { ar: 'متوسط', en: 'Medium' },
      urgency: 'critical'
    },
    {
      id: 'battery',
      systemId: 'battery',
      name: { ar: 'البطارية', en: 'Battery' },
      image: 'battery.png',
      icon: 'fa-battery-full',
      description: { ar: 'مصدر الطاقة الكهربائية', en: 'Electrical power source' },
      function: { ar: 'توفير الطاقة', en: 'Providing power' },
      lifespan: { ar: '3 - 5 سنوات', en: '3 - 5 years' },
      replacementCost: { ar: '150 - 300 ريال', en: '$60 - $250' },
      maintenanceTip: { ar: 'افحص كل شهر', en: 'Check monthly' },
      difficulty: { ar: 'سهل', en: 'Easy' },
      urgency: 'medium'
    },
    {
      id: 'shock-absorber',
      systemId: 'suspension',
      name: { ar: 'المساعدات (الأمورتيزير)', en: 'Shock Absorber' },
      image: 'damper.png',
      icon: 'fa-water',
      description: { ar: 'يمتص الصدمات', en: 'Absorbs shocks' },
      function: { ar: 'تخفيف الاهتزازات', en: 'Reducing vibration' },
      lifespan: { ar: '50,000 - 100,000 كم', en: '50,000 - 100,000 km' },
      replacementCost: { ar: '100 - 200 ريال', en: '$100 - $400' },
      maintenanceTip: { ar: 'استبدل بالتزاوج', en: 'Replace in pairs' },
      difficulty: { ar: 'متوسط', en: 'Medium' },
      urgency: 'medium'
    }
  ],

  faults: [
    {
      id: 'engine-overheating',
      systemId: 'engine',
      name: { ar: 'ارتفاع درجة حرارة المحرك', en: 'Engine Overheating' },
      severity: 'critical',
      icon: 'fa-temperature-high',
      description: { ar: 'ارتفاع مؤشر الحرارة في لوحة القيادة', en: 'Temperature gauge rises' },
      symptoms: { ar: ['مؤشر الحرارة في الأحمر', 'بخار من الغطاء', 'رائحة حرق', 'فقدان القدرة'], en: ['Temperature in red', 'Steam from hood', 'Burning smell', 'Power loss'] },
      causes: { ar: ['نقص سائل التبريد', 'تلف طلمبة الماء', 'انسداد الرديتر', 'تسرب في النظام'], en: ['Low coolant', 'Water pump failure', 'Clogged radiator', 'System leak'] },
      solutions: { ar: ['أوقف السيارة فوراً', 'اتركها تبرد 30 دقيقة', 'افحص مستوى السائل', 'توجه للورشة'], en: ['Stop immediately', 'Let cool 30 min', 'Check coolant', 'Go to workshop'] },
      estimatedCost: { ar: '200 - 3,000 ريال', en: '$60 - $900' },
      urgency: 'critical',
      relatedParts: ['radiator', 'water-pump']
    },
    {
      id: 'brake-squeal',
      systemId: 'brakes',
      name: { ar: 'صرير الفرامل', en: 'Brake Squeal' },
      severity: 'warning',
      icon: 'fa-volume-high',
      description: { ar: 'صوت صرير عند الضغط على الفرامل', en: 'Squealing sound when braking' },
      symptoms: { ar: ['صوت صرير', 'اهتزاز بيدال الفرامل', 'انجراف عند الفرملة', 'ضعف التوقف'], en: ['Squealing sound', 'Pedal vibration', 'Car pulling', 'Weak braking'] },
      causes: { ar: ['تآكل تيل الفرامل', 'تراكم الغبار', 'قرص تالف', 'كاليبر مقيد'], en: ['Worn pads', 'Dust buildup', 'Damaged disc', 'Stuck caliper'] },
      solutions: { ar: ['افحص سماكة التيل', 'استبدل التيل', 'افحص القرص', 'نظف الكاليبر'], en: ['Check pad thickness', 'Replace pads', 'Check disc', 'Clean caliper'] },
      estimatedCost: { ar: '150 - 800 ريال', en: '$50 - $250' },
      urgency: 'high',
      relatedParts: ['brake-pad', 'brake-disc']
    },
    {
      id: 'battery-dead',
      systemId: 'battery',
      name: { ar: 'البطارية فارغة', en: 'Dead Battery' },
      severity: 'warning',
      icon: 'fa-battery-empty',
      description: { ar: 'عدم قدرة السيارة على الاقلاع', en: 'Car unable to start' },
      symptoms: { ar: ['السيارة لا تشتغل', 'صوت طرق خفيف', 'الأنوار خافتة', 'لا صوت عند الإقلاع'], en: ['No start', 'Clicking sound', 'Dim lights', 'No cranking'] },
      causes: { ar: ['قِدَم البطارية', 'ترك الأنوار مضاءة', 'تلف الدينامو', 'برودة شديدة'], en: ['Old battery', 'Lights left on', 'Alternator failure', 'Extreme cold'] },
      solutions: { ar: ['شحن البطارية', 'استبدل البطارية', 'افحص الدينامو', 'تأكد من الأنوار'], en: ['Jump start', 'Replace battery', 'Check alternator', 'Check lights'] },
      estimatedCost: { ar: '200 - 800 ريال', en: '$60 - $250' },
      urgency: 'medium',
      relatedParts: ['battery']
    },
    {
      id: 'suspension-noise',
      systemId: 'suspension',
      name: { ar: 'أصوات التعليق', en: 'Suspension Noise' },
      severity: 'info',
      icon: 'fa-volume-high',
      description: { ar: 'أصوات طرق من تحت السيارة', en: 'Knocking sounds from under car' },
      symptoms: { ar: ['أصوات طرق', 'اهتزاز عند القيادة', 'ميل السيارة لجهة', 'تآكل الإطارات'], en: ['Knocking', 'Vibration', 'Car leaning', 'Tire wear'] },
      causes: { ar: ['تلف الماصات', 'تلف الزنابرك', 'كرات توجيه تالفة', 'مطاط تعليق'], en: ['Damaged shocks', 'Broken springs', 'Bad ball joints', 'Worn rubber'] },
      solutions: { ar: ['افحص الماصات', 'افحص الزنابرك', 'افحص كرات التوجيه', 'ضبط الإطارات'], en: ['Check shocks', 'Check springs', 'Check ball joints', 'Align wheels'] },
      estimatedCost: { ar: '200 - 2,000 ريال', en: '$60 - $600' },
      urgency: 'medium',
      relatedParts: ['shock-absorber']
    },
    {
      id: 'coolant-leak',
      systemId: 'cooling',
      name: { ar: 'تسرب سائل التبريد', en: 'Coolant Leak' },
      severity: 'warning',
      icon: 'fa-droplet',
      description: { ar: 'انخفاض مستوى سائل التبريد', en: 'Coolant level dropping' },
      symptoms: { ar: ['بقع ملونة تحت السيارة', 'ارتفاع درجة الحرارة', 'رائحة حلوة', 'بخار من الغطاء'], en: ['Colored spots', 'Rising temp', 'Sweet smell', 'Steam'] },
      causes: { ar: ['تلف الخرطوم', 'تلف الرديتر', 'تسرب الطلمبة', 'تلف الثرموستات'], en: ['Hose damage', 'Radiator leak', 'Pump leak', 'Thermostat leak'] },
      solutions: { ar: ['افحص الخراطيم', 'افحص الرديتر', 'أضف سائل مؤقتاً', 'توجه للورشة'], en: ['Check hoses', 'Check radiator', 'Add coolant', 'Go to workshop'] },
      estimatedCost: { ar: '150 - 2,500 ريال', en: '$50 - $750' },
      urgency: 'high',
      relatedParts: ['radiator', 'water-pump']
    },
    {
      id: 'transmission-slip',
      systemId: 'transmission',
      name: { ar: 'انزلاق علبة التروس', en: 'Transmission Slip' },
      severity: 'warning',
      icon: 'fa-gears',
      description: { ar: 'تغيير التروس بشكل غير منتظم', en: 'Irregular gear changes' },
      symptoms: { ar: ['تأخر في التروس', 'المحرك يرفع دون تسارع', 'صوت طرق', 'رائحة حرق'], en: ['Late shifts', 'Revving no accel', 'Knocking', 'Burning smell'] },
      causes: { ar: ['نقص زيت علبة التروس', 'تآكل الكلتش', 'صمامات تالفة', 'حزام تالف'], en: ['Low fluid', 'Clutch wear', 'Bad valves', 'Damaged band'] },
      solutions: { ar: ['افحص مستوى الزيت', 'غيّر الزيت', 'افحص الكلتش', 'توجه لمتخصص'], en: ['Check fluid', 'Change oil', 'Check clutch', 'Go specialist'] },
      estimatedCost: { ar: '500 - 8,000 ريال', en: '$150 - $2,500' },
      urgency: 'high',
      relatedParts: []
    }
  ],

  maintenanceTips: [
    {
      id: 'tip-1',
      title: { ar: 'تغيير الزيت بانتظام', en: 'Regular Oil Changes' },
      desc: { ar: 'غيّر زيت المحرك كل 5,000 كم', en: 'Change oil every 5,000 km' },
      icon: 'fa-oil-can',
      category: 'engine'
    },
    {
      id: 'tip-2',
      title: { ar: 'فحص الفرامل', en: 'Check Brakes' },
      desc: { ar: 'افحص الفرامل كل 20,000 كم', en: 'Check brakes every 20,000 km' },
      icon: 'fa-circle-stop',
      category: 'brakes'
    },
    {
      id: 'tip-3',
      title: { ar: 'فحص سائل التبريد', en: 'Check Coolant' },
      desc: { ar: 'افحص السائل أسبوعياً', en: 'Check coolant weekly' },
      icon: 'fa-temperature-low',
      category: 'cooling'
    },
    {
      id: 'tip-4',
      title: { ar: 'فحص البطارية', en: 'Check Battery' },
      desc: { ar: 'افحص البطارية شهرياً', en: 'Check battery monthly' },
      icon: 'fa-battery-full',
      category: 'battery'
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorkshatiData;
}
