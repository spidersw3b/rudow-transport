export type UserRole = "customer" | "admin" | "super_admin";

export type RequestStatus =
  | "Pending"
  | "Accepted"
  | "Planned"
  | "Dispatched"
  | "In Transit"
  | "Delivered"
  | "Delayed"
  | "Cancelled";

export type Priority = "Low" | "Medium" | "High";

export type ServiceType =
  | "Fleet Relocation"
  | "Dealership Transport"
  | "Jobsite Delivery"
  | "Expedited Freight"
  | "FTL Shipping"
  | "LTL Shipping"
  | "Dedicated Fleet Services"
  | "Final Mile Delivery"
  | "Regional Hauling"
  | "Scheduled Route Delivery"
  | "Custom Logistics"
  | "Other";

export type FleetVehicleType =
  | "Semi Truck"
  | "Car Hauler"
  | "Flatbed"
  | "Box Truck"
  | "Cargo Van"
  | "Sprinter";

export type FleetStatus =
  | "Available"
  | "In Transit"
  | "In Maintenance"
  | "Out of Service";

export type DriverStatus = "Available" | "On Route" | "Off Duty" | "Inactive";

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  role: UserRole;
  password_hash: string | null;
  created_at: string;
}

export interface TransportRequest {
  id: string;
  request_id: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string | null;
  phone: string | null;
  company: string | null;
  service_type: string;
  vehicle_description: string | null;
  origin_location: string | null;
  destination: string | null;
  special_instructions: string | null;
  photo_url: string | null;
  status: RequestStatus;
  priority: Priority;
  tracking_number: string | null;
  driver_assigned: string | null;
  estimated_completion: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  request_metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface FleetVehicle {
  id: string;
  unit_number: string | null;
  make: string;
  model: string;
  year: number | null;
  vin: string | null;
  vehicle_type: FleetVehicleType | string | null;
  status: FleetStatus | string;
  current_location: string | null;
  driver_assigned: string | null;
  mileage: number | null;
  last_maintenance: string | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  license_number: string | null;
  license_expiry: string | null;
  status: DriverStatus | string;
  current_assignment: string | null;
  created_at: string;
}
