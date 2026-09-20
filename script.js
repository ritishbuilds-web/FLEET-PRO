// ========================================
// FLEETPRO - DATA MANAGEMENT
// ========================================

// Vehicle data
let vehicles = [
    {
        id: 1,
        make: "Toyota",
        model: "Hilux",
        year: 2022,
        plateNumber: "TN-01-AB-1234",
        vin: "JTEGD17M0F7012345",
        status: "active",
        driverId: 1,
        lastMaintenance: "2026-06-01",
        fuelConsumption: 12.5
    },
    {
        id: 2,
        make: "Volvo",
        model: "FH16",
        year: 2023,
        plateNumber: "TN-02-CD-5678",
        vin: "YV2RG10A0J7123456",
        status: "maintenance",
        driverId: null,
        lastMaintenance: "2026-06-15",
        fuelConsumption: 9.8
    },
    {
        id: 3,
        make: "Tata",
        model: "Prima",
        year: 2021,
        plateNumber: "TN-03-EF-9012",
        vin: "MAT12345678901234",
        status: "active",
        driverId: null,
        lastMaintenance: "2026-07-10",
        fuelConsumption: 10.2
    }
];


// Driver data
let drivers = [
    {
        id: 1,
        name: "Rajesh Kumar",
        licenseNumber: "DL-2024-001",
        contact: "+91 9876543210",
        assignedVehicleId: 1,
        status: "active"
    },
    {
        id: 2,
        name: "Arun Prakash",
        licenseNumber: "DL-2023-045",
        contact: "+91 9876543211",
        assignedVehicleId: null,
        status: "active"
    }
];


// Maintenance data
let maintenance = [
    {
        id: 1,
        vehicleId: 2,
        date: "2026-09-25",
        type: "Engine Service",
        cost: 8500,
        description: "Regular engine inspection",
        status: "scheduled"
    },
    {
        id: 2,
        vehicleId: 1,
        date: "2026-06-01",
        type: "Oil Change",
        cost: 3500,
        description: "Engine oil and filter replacement",
        status: "completed"
    }
];


// Fuel records
let fuelRecords = [
    {
        id: 1,
        vehicleId: 1,
        date: "2026-09-18",
        fuelType: "Diesel",
        quantity: 45,
        cost: 4200,
        mileage: 18500
    },
    {
        id: 2,
        vehicleId: 3,
        date: "2026-09-17",
        fuelType: "Diesel",
        quantity: 38,
        cost: 3600,
        mileage: 12400
    }
];


// Demo user
const user = {
    username: "admin",
    password: "fleet123",
    role: "Administrator"
};