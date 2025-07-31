// Job Card Types and Templates

export interface JobCardTask {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedHours: number;
  skillRequired: string;
  partsRequired: string[];
  tools: string[];
  safetyNotes: string[];
  completed: boolean;
  actualHours?: number;
  completedBy?: string;
  completedDate?: string;
  notes?: string;
}

export interface JobCardTemplate {
  id: string;
  name: string;
  description: string;
  category: JobCardCategory;
  vehicleType: "truck" | "trailer" | "both";
  estimatedDuration: number; // hours
  tasks: JobCardTask[];
  partsInventory: PartRequirement[];
  skillsRequired: string[];
  safetyRequirements: string[];
}

export interface PartRequirement {
  partId: string;
  name: string;
  quantity: number;
  category: string;
  estimatedCost: number;
  critical: boolean;
}

export type JobCardCategory =
  | "preventive_maintenance"
  | "corrective_maintenance"
  | "inspection_followup"
  | "safety_repair"
  | "emergency_repair"
  | "tyre_service"
  | "body_repair";

// Common task templates
export const COMMON_TASKS = {
  // Engine tasks
  oil_change: {
    id: "oil_change",
    name: "Engine Oil Change",
    description: "Drain old oil, replace filter, add new oil",
    category: "Engine",
    estimatedHours: 1,
    skillRequired: "Basic Maintenance",
    partsRequired: ["Engine Oil", "Oil Filter", "Drain Plug Gasket"],
    tools: ["Oil Drain Pan", "Socket Set", "Oil Filter Wrench"],
    safetyNotes: ["Ensure engine is warm but not hot", "Use proper lifting equipment"],
    completed: false,
  },

  coolant_flush: {
    id: "coolant_flush",
    name: "Coolant System Flush",
    description: "Drain and refill cooling system",
    category: "Engine",
    estimatedHours: 2,
    skillRequired: "Cooling System",
    partsRequired: ["Coolant", "Thermostat", "Coolant System Cleaner"],
    tools: ["Coolant Drain Pan", "Pressure Tester", "Funnel"],
    safetyNotes: ["Allow engine to cool completely", "Dispose of coolant properly"],
    completed: false,
  },

  // Brake tasks
  brake_pad_replacement: {
    id: "brake_pad_replacement",
    name: "Brake Pad Replacement",
    description: "Replace worn brake pads",
    category: "Brakes",
    estimatedHours: 3,
    skillRequired: "Brake System",
    partsRequired: ["Brake Pads", "Brake Fluid", "Brake Cleaner"],
    tools: ["Brake Caliper Tool", "C-Clamp", "Brake Spoon"],
    safetyNotes: [
      "Use proper jack stands",
      "Test brakes before driving",
      "Dispose of old pads properly",
    ],
    completed: false,
  },

  brake_inspection: {
    id: "brake_inspection",
    name: "Brake System Inspection",
    description: "Comprehensive brake system check",
    category: "Brakes",
    estimatedHours: 1.5,
    skillRequired: "Brake System",
    partsRequired: [],
    tools: ["Brake Gauge", "Flashlight", "Mirror"],
    safetyNotes: ["Check all brake components thoroughly"],
    completed: false,
  },

  // Tyre tasks
  tyre_rotation: {
    id: "tyre_rotation",
    name: "Tyre Rotation",
    description: "Rotate tyres according to manufacturer pattern",
    category: "Tyres",
    estimatedHours: 1,
    skillRequired: "Basic Maintenance",
    partsRequired: [],
    tools: ["Tyre Iron", "Jack", "Torque Wrench"],
    safetyNotes: ["Use proper jack stands", "Torque to specification"],
    completed: false,
  },

  tyre_replacement: {
    id: "tyre_replacement",
    name: "Tyre Replacement",
    description: "Remove old tyre and install new one",
    category: "Tyres",
    estimatedHours: 0.5,
    skillRequired: "Tyre Service",
    partsRequired: ["New Tyre", "Valve Stem", "Wheel Weights"],
    tools: ["Tyre Machine", "Wheel Balancer", "Tyre Pressure Gauge"],
    safetyNotes: ["Check tyre pressure after installation", "Balance wheel properly"],
    completed: false,
  },
};

export const JOB_CARD_TEMPLATES: JobCardTemplate[] = [
  {
    id: "truck_service_5000km",
    name: "5,000km Truck Service",
    description: "Standard 5,000km preventive maintenance service",
    category: "preventive_maintenance",
    vehicleType: "truck",
    estimatedDuration: 4,
    tasks: [
      COMMON_TASKS.oil_change,
      {
        ...COMMON_TASKS.brake_inspection,
        id: "brake_check_service",
      },
      {
        id: "air_filter_check",
        name: "Air Filter Inspection",
        description: "Check and clean/replace air filter",
        category: "Engine",
        estimatedHours: 0.5,
        skillRequired: "Basic Maintenance",
        partsRequired: ["Air Filter"],
        tools: ["Screwdriver"],
        safetyNotes: ["Handle filter carefully"],
        completed: false,
      },
    ],
    partsInventory: [
      {
        partId: "oil_15w40",
        name: "15W-40 Engine Oil",
        quantity: 20,
        category: "Fluids",
        estimatedCost: 300,
        critical: true,
      },
      {
        partId: "oil_filter_std",
        name: "Standard Oil Filter",
        quantity: 1,
        category: "Filters",
        estimatedCost: 45,
        critical: true,
      },
      {
        partId: "air_filter_std",
        name: "Air Filter",
        quantity: 1,
        category: "Filters",
        estimatedCost: 85,
        critical: false,
      },
    ],
    skillsRequired: ["Basic Maintenance", "Brake System"],
    safetyRequirements: ["Safety glasses", "Work gloves", "Proper lifting equipment"],
  },

  {
    id: "brake_repair_urgent",
    name: "Urgent Brake Repair",
    description: "Emergency brake system repair",
    category: "emergency_repair",
    vehicleType: "truck",
    estimatedDuration: 6,
    tasks: [
      COMMON_TASKS.brake_pad_replacement,
      {
        id: "brake_fluid_change",
        name: "Brake Fluid Replacement",
        description: "Drain and replace brake fluid",
        category: "Brakes",
        estimatedHours: 1,
        skillRequired: "Brake System",
        partsRequired: ["DOT 4 Brake Fluid"],
        tools: ["Brake Bleeder Kit", "Wrench Set"],
        safetyNotes: ["Avoid skin contact with brake fluid", "Test system thoroughly"],
        completed: false,
      },
      {
        id: "brake_test",
        name: "Brake System Test",
        description: "Comprehensive brake performance test",
        category: "Brakes",
        estimatedHours: 1,
        skillRequired: "Brake System",
        partsRequired: [],
        tools: ["Brake Tester", "Pressure Gauge"],
        safetyNotes: ["Test in safe environment", "Verify all functions"],
        completed: false,
      },
    ],
    partsInventory: [
      {
        partId: "brake_pads_front",
        name: "Front Brake Pads",
        quantity: 1,
        category: "Brakes",
        estimatedCost: 250,
        critical: true,
      },
      {
        partId: "brake_fluid_dot4",
        name: "DOT 4 Brake Fluid",
        quantity: 2,
        category: "Fluids",
        estimatedCost: 60,
        critical: true,
      },
    ],
    skillsRequired: ["Brake System", "Safety Testing"],
    safetyRequirements: [
      "Safety glasses",
      "Work gloves",
      "Brake fluid resistant gloves",
      "Proper ventilation",
    ],
  },

  {
    id: "tyre_service_complete",
    name: "Complete Tyre Service",
    description: "Full tyre inspection, rotation, and replacement as needed",
    category: "tyre_service",
    vehicleType: "both",
    estimatedDuration: 3,
    tasks: [
      {
        id: "tyre_inspection",
        name: "Tyre Inspection",
        description: "Comprehensive tyre condition assessment",
        category: "Tyres",
        estimatedHours: 1,
        skillRequired: "Tyre Service",
        partsRequired: [],
        tools: ["Tread Depth Gauge", "Pressure Gauge", "Flashlight"],
        safetyNotes: ["Check for irregular wear patterns", "Measure tread depth accurately"],
        completed: false,
      },
      COMMON_TASKS.tyre_rotation,
      {
        id: "wheel_alignment_check",
        name: "Wheel Alignment Check",
        description: "Check and adjust wheel alignment",
        category: "Tyres",
        estimatedHours: 1,
        skillRequired: "Alignment",
        partsRequired: [],
        tools: ["Alignment Equipment", "Measuring Tools"],
        safetyNotes: ["Ensure vehicle is level", "Follow manufacturer specifications"],
        completed: false,
      },
    ],
    partsInventory: [
      {
        partId: "tyre_295_80r22",
        name: "295/80R22.5 Tyre",
        quantity: 2,
        category: "Tyres",
        estimatedCost: 1200,
        critical: false,
      },
    ],
    skillsRequired: ["Tyre Service", "Alignment"],
    safetyRequirements: ["Safety glasses", "Steel-toed boots", "Proper lifting equipment"],
  },

  {
    id: "trailer_inspection_service",
    name: "Trailer Inspection Service",
    description: "Comprehensive trailer inspection and maintenance",
    category: "inspection_followup",
    vehicleType: "trailer",
    estimatedDuration: 2.5,
    tasks: [
      {
        id: "coupling_inspection",
        name: "Coupling System Check",
        description: "Inspect fifth wheel and coupling components",
        category: "Coupling",
        estimatedHours: 0.5,
        skillRequired: "Trailer Systems",
        partsRequired: [],
        tools: ["Grease Gun", "Inspection Light"],
        safetyNotes: ["Check locking mechanism thoroughly"],
        completed: false,
      },
      {
        id: "trailer_brake_check",
        name: "Trailer Brake Inspection",
        description: "Check trailer brake system operation",
        category: "Brakes",
        estimatedHours: 1,
        skillRequired: "Brake System",
        partsRequired: [],
        tools: ["Brake Tester", "Air Pressure Gauge"],
        safetyNotes: ["Test emergency brake operation"],
        completed: false,
      },
      {
        id: "trailer_lights_test",
        name: "Trailer Lights Test",
        description: "Test all trailer lighting systems",
        category: "Electrical",
        estimatedHours: 0.5,
        skillRequired: "Electrical",
        partsRequired: [],
        tools: ["Multimeter", "Test Light"],
        safetyNotes: ["Check all light functions"],
        completed: false,
      },
    ],
    partsInventory: [
      {
        partId: "coupling_grease",
        name: "Coupling Grease",
        quantity: 1,
        category: "Lubricants",
        estimatedCost: 35,
        critical: false,
      },
    ],
    skillsRequired: ["Trailer Systems", "Brake System", "Electrical"],
    safetyRequirements: ["Safety glasses", "Work gloves"],
  },
];

export const getTemplatesByCategory = (category: JobCardCategory) => {
  return JOB_CARD_TEMPLATES.filter((template) => template.category === category);
};

export const getTemplatesByVehicleType = (vehicleType: "truck" | "trailer" | "both") => {
  return JOB_CARD_TEMPLATES.filter(
    (template) => template.vehicleType === vehicleType || template.vehicleType === "both"
  );
};

export const getTemplateById = (id: string) => {
  return JOB_CARD_TEMPLATES.find((template) => template.id === id);
};

export const calculateTemplateCost = (template: JobCardTemplate) => {
  return template.partsInventory.reduce(
    (total, part) => total + part.estimatedCost * part.quantity,
    0
  );
};

export const getSkillCategories = () => {
  const skills = new Set<string>();
  JOB_CARD_TEMPLATES.forEach((template) => {
    template.skillsRequired.forEach((skill) => skills.add(skill));
    template.tasks.forEach((task) => skills.add(task.skillRequired));
  });
  return Array.from(skills);
};
