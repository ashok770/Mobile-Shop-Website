import React from 'react';
import {
  Wrench, Smartphone, ShieldCheck, Wifi, Headphones, Package,
  Monitor, Battery, Cpu, HardDrive, Settings, Zap, RefreshCcw,
  BatteryCharging, Cable, Bluetooth, Signal, Shield, LifeBuoy,
  PhoneCall, Mail, MapPin, Clock, Star, Heart, Layers, Grid3X3,
  Plug, Aperture, CircuitBoard, Hammer, ScanLine, Flashlight,
  Volume2, Droplet, Terminal, Box, CardSim, ArrowRightLeft, Unlock
} from "lucide-react";

// Safe Lucide icon map matching both kebab-case and PascalCase
const ICON_MAP = {
  Wrench, wrench: Wrench,
  Smartphone, smartphone: Smartphone,
  ShieldCheck, 'shield-check': ShieldCheck,
  Wifi, wifi: Wifi,
  Headphones, headphones: Headphones,
  Package, package: Package,
  Monitor, monitor: Monitor,
  Battery, battery: Battery,
  Cpu, cpu: Cpu,
  HardDrive, 'hard-drive': HardDrive,
  Settings, settings: Settings,
  Zap, zap: Zap,
  RefreshCcw, 'refresh-ccw': RefreshCcw,
  BatteryCharging, 'battery-charging': BatteryCharging,
  Cable, cable: Cable,
  Bluetooth, bluetooth: Bluetooth,
  Signal, signal: Signal,
  Shield, shield: Shield,
  LifeBuoy, 'life-buoy': LifeBuoy,
  PhoneCall, 'phone-call': PhoneCall,
  Mail, mail: Mail,
  MapPin, 'map-pin': MapPin,
  Clock, clock: Clock,
  Star, star: Star,
  Heart, heart: Heart,
  Layers, layers: Layers,
  Grid3X3, 'grid-3x3': Grid3X3,
  Plug, plug: Plug,
  Aperture, aperture: Aperture,
  CircuitBoard, 'circuit-board': CircuitBoard,
  Hammer, hammer: Hammer,
  ScanLine, 'scan-line': ScanLine,
  Flashlight, flashlight: Flashlight,
  Volume2, 'volume-2': Volume2,
  Droplet, droplet: Droplet,
  Terminal, terminal: Terminal,
  Box, box: Box,
  CardSim, 'sim-card': CardSim,
  ArrowRightLeft, 'arrow-right-left': ArrowRightLeft,
  Unlock, unlock: Unlock,
};

export const ServiceIcon = ({ name, size = 24, className = "" }) => {
  // Try exact match first
  let IconComponent = ICON_MAP[name];

  // If not found, try to convert kebab-case to PascalCase (just in case)
  if (!IconComponent && name) {
    const pascalCase = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    IconComponent = ICON_MAP[pascalCase];
  }

  // Fallback to Package
  if (!IconComponent) {
    IconComponent = Package;
  }

  return <IconComponent size={size} className={className} />;
};
