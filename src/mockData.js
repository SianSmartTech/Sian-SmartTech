export const mainCategories = [
  {
    id: "laptop",
    title: "Laptop Services",
    description: "New laptop sales, certified refurbished resale, chip-level micro-soldering, and general hardware repair services.",
    icon: "Laptop",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    category: "LAPTOPS"
  },
  {
    id: "computer",
    title: "Computer & PC Services",
    description: "Desktop repairs, system assembly, custom gaming/workstation building, OS setup, software installation, and backup.",
    icon: "Monitor",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
    category: "COMPUTERS"
  },
  {
    id: "printer",
    title: "Printer Services",
    description: "Laser & inkjet printer maintenance, paper jam fixes, cartridge refilling, printhead cleaning, and servicing.",
    icon: "Printer",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80",
    category: "PRINTERS"
  },
  {
    id: "cctv",
    title: "CCTV Installation & Setup",
    description: "Indoor & outdoor security camera wiring, DVR/NVR configuration, cable laying, and remote viewing feed setup.",
    icon: "Video",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
    category: "CCTV"
  },
  {
    id: "drone",
    title: "Drone Assembly & Service",
    description: "Custom drone assembly, flight controller tuning, motor mounting, calibration testing, and crash damage repairs.",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80",
    category: "DRONE TECH"
  },
  {
    id: "website",
    title: "Website Development & Design",
    description: "Custom, highly responsive websites built with modern technologies like React, Next.js, and WordPress. High performance, SEO-friendly.",
    icon: "Globe",
    image: "/images/web_development.webp",
    category: "DEVELOPMENT"
  }
];
export const services = [
  {
    id: 1,
    categories: ["laptop"],
    title: "Laptop Repair & Service",
    description: "Complete hardware diagnostics, screen replacement, keyboard repair, battery replacements, and cooling system cleaning for all laptop brands.",
    icon: "Laptop",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    category: "LAPTOPS",
    rating: 4.9,
    turnaround: "1-2 Days",
    warranty: "6 Months",
    priceRange: "Started at ₹499",
    benefits: ["Brand Warranty", "Express Service", "Genuine Spares"]
  },
  {
    id: 2,
    categories: ["computer"],
    title: "Computer Repair & Service",
    description: "Professional desktop computer repair, power supply replacement, motherboard servicing, hardware troubleshooting, and general servicing.",
    icon: "Monitor",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
    category: "COMPUTERS",
    rating: 4.8,
    turnaround: "Same Day",
    warranty: "90 Days",
    priceRange: "Started at ₹399",
    benefits: ["On-Site Repair", "Expert Fixing", "Diagnostic Report"]
  },
  {
    id: 3,
    categories: ["printer"],
    title: "Printer Repair & Service",
    description: "Laser & inkjet printer maintenance, paper jam resolution, printhead cleaning, cartridge refilling, and printer network setup.",
    icon: "Printer",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80",
    category: "PRINTERS",
    rating: 4.7,
    turnaround: "2-3 Days",
    warranty: "30 Days",
    priceRange: "Started at ₹499",
    benefits: ["Toner Refill", "Head Cleaned", "Free Delivery"]
  },
  {
    id: 4,
    categories: ["drone"],
    title: "Drone Service",
    description: "Custom drone assembly, flight controller tuning, motor mounting, propeller calibration, battery diagnostics, and crash repair.",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80",
    category: "DRONES",
    rating: 4.9,
    turnaround: "3-5 Days",
    warranty: "6 Months",
    priceRange: "Custom",
    benefits: ["Flight Test", "ESC Calibration", "Firmware Updates"]
  },
  {
    id: 5,
    categories: ["laptop", "computer", "printer", "drone"],
    title: "Chip Level Service (Laptop, Computer, Printer, Drone)",
    description: "Advanced microscopic soldering, BGA rework, bios reprogramming, motherboard short-circuit troubleshooting, and component IC replacements.",
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
    category: "CHIP LEVEL",
    rating: 4.9,
    turnaround: "2-4 Days",
    warranty: "90 Days",
    priceRange: "Started at ₹1,500",
    benefits: ["BGA Rework", "IC Replacement", "Bios Programming"]
  },
  {
    id: 6,
    categories: ["cctv"],
    title: "CCTV Installation",
    description: "Secure indoor and outdoor CCTV camera setup, DVR/NVR network configuration, cable laying, and remote viewing setup on smartphones.",
    icon: "Video",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
    category: "CCTV",
    rating: 4.8,
    turnaround: "1-2 Days",
    warranty: "1 Year",
    priceRange: "Custom",
    benefits: ["Remote Access", "Night Vision IP", "Secure Cabling"]
  },
  {
    id: 7,
    categories: ["computer"],
    title: "Data Backup Service",
    description: "Secure data backup setup, lost file recovery from hard drives or SSDs, forensic disk imaging, and regular backup automation.",
    icon: "HardDrive",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    category: "DATA BACKUP",
    rating: 4.8,
    turnaround: "1-2 Days",
    warranty: "Secure",
    priceRange: "Started at ₹999",
    benefits: ["Secure Storage", "Lost Recovery", "Auto Schedule"]
  },
  {
    id: 8,
    categories: ["computer"],
    title: "Software Installation",
    description: "Operating system installations (Windows/Linux), driver configuration, office suite setup, antivirus licenses, and system speed optimization.",
    icon: "Settings",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&q=80",
    category: "SOFTWARE",
    rating: 4.8,
    turnaround: "2-4 Hours",
    warranty: "30 Days",
    priceRange: "Started at ₹299",
    benefits: ["Official Setup", "Bloatware Cleaned", "Driver Config"]
  },
  {
    id: 9,
    categories: ["computer"],
    title: "System Assembly & Custom PC Build",
    description: "Professional assembly of high-end gaming rigs, workstation setups, rendering PCs, custom cooling systems, and cable routing.",
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
    category: "CUSTOM BUILD",
    rating: 5.0,
    turnaround: "1-2 Days",
    warranty: "3 Years",
    priceRange: "Custom",
    benefits: ["Cable Management", "Stress Testing", "Component Warranty"]
  },
  {
    id: 10,
    categories: ["laptop"],
    title: "Refurbished Laptops & Resale",
    description: "Factory-certified refurbished laptops with full testing checklists, ready-to-use setup, and company backup warranties at great rates.",
    icon: "RefreshCw",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    category: "REFURBISHED",
    rating: 4.8,
    turnaround: "Same Day",
    warranty: "6 Months",
    priceRange: "Started at ₹12,000",
    benefits: ["40+ Checkpoints", "Warranty Covered", "Charger Included"]
  },
  {
    id: 11,
    categories: ["laptop"],
    title: "New Laptops Sale",
    description: "Official dealer of brand-new laptops from Dell, HP, Lenovo, Asus, Apple, and Acer with official brand guarantees.",
    icon: "ShoppingBag",
    image: "/images/new_laptops.webp",
    category: "NEW LAPTOPS",
    rating: 4.9,
    turnaround: "Same Day",
    warranty: "Official Brand",
    priceRange: "Brand Prices",
    benefits: ["Official Warranty", "Free Basic Setup", "Gifts Included"]
  },
  {
    id: 12,
    categories: ["laptop", "computer", "printer"],
    title: "Laptop, Computer & Printer Accessories Sales",
    description: "Sales of authentic accessories including keyboards, mice, SSDs, external hard drives, RAM modules, cables, routers, and print cartridges.",
    icon: "Keyboard",
    image: "/images/accessories.webp",
    category: "ACCESSORIES",
    rating: 4.8,
    turnaround: "Instant",
    warranty: "Manufacturer",
    priceRange: "Best Prices",
    benefits: ["100% Genuine", "Exchange Options", "Official Spares"]
  }
];

export const portfolio = [
  {
    id: 1,
    title: "Corporate Office Network",
    description: "Complete network infrastructure setup for 50+ workstations.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    category: "Network",
  },
  {
    id: 2,
    title: "Gaming PC Build",
    description: "High-performance custom gaming rig with RGB lighting.",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
    category: "Custom Build",
  },
  {
    id: 3,
    title: "Data Center Upgrade",
    description: "Server hardware upgrade and optimization for a local business.",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    category: "Enterprise",
  },
  {
    id: 4,
    title: "Laptop Repair Service",
    description: "Screen replacement and motherboard repair for MacBook Pro.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    category: "Repair",
  },
  {
    id: 5,
    title: "Smart Home Setup",
    description: "IoT device integration and home automation system installation.",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
    category: "Smart Home",
  },
  {
    id: 6,
    title: "Workstation Assembly",
    description: "Professional video editing workstation with dual monitors.",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
    category: "Custom Build",
  },
];
export const pricing = [
  {
    id: 1,
    name: "General Diagnostics",
    price: "₹150",
    period: "base fee",
    features: [
      "Initial troubleshooting",
      "Problem identification",
      "Physical checking",
      "Detailed repair estimate",
      "Diagnostic fee"
    ],
    popular: false,
  },
  {
    id: 2,
    name: "General Service & Repair",
    price: "₹350",
    period: "standard",
    features: [
      "Complete cleaning & servicing",
      "Standard software diagnosis",
      "General minor repairs",
      "Thermal paste replacement",
      "Repair service charge"
    ],
    popular: true,
  },
  {
    id: 3,
    name: "OS Installation",
    price: "₹350",
    period: "one-time",
    features: [
      "Windows / Linux installation",
      "Driver configuration & updates",
      "Essential free tools setup",
      "System performance tuning",
      "OS setup only"
    ],
    popular: false,
  },
  {
    id: 4,
    name: "OS Installation + Backup",
    price: "₹450",
    period: "one-time",
    features: [
      "Full Operating System installation",
      "Complete user data backup",
      "Data migration & restore",
      "Driver setup & verification",
      "Full data protection"
    ],
    popular: false,
  },
  {
    id: 5,
    name: "Spare Part Replacement",
    price: "₹200",
    period: "plus spare cost",
    features: [
      "Replacing screen, keyboard, RAM, SSD, etc.",
      "Professional mounting & fitting",
      "Compatibility verification",
      "Post-installation test",
      "Service spot charge + spare parts cost"
    ],
    popular: false,
  }
];

export const itPricing = [
  {
    id: 1,
    name: "Starter Website",
    icon: "Globe",
    price: "₹2,999",
    period: "one-time",
    subtitle: null,
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Basic SEO setup",
      "1 year free hosting",
      "30 days support"
    ],
    popular: false,
    buttonText: "Get started",
  },
  {
    id: 2,
    name: "Business Website",
    icon: "BarChart2",
    price: "₹5,999",
    period: "one-time",
    hostingNote: null,
    subtitle: null,
    features: [
      "20+ pages, full functionality",
      "WhatsApp integration",
      "Email notifications",
      "Advanced SEO + speed tuning",
      "1 year free hosting",
      "60 days priority support"
    ],
    popular: true,
    buttonText: "Get started",
  }
];
export const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Retail Store Owner",
    content: "Sian SmartTech saved our business! They recovered all our crucial files after a database crash and set up a secure automatic data backup system. Extremely reliable and professional team.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "E-commerce Founder",
    content: "They built a highly responsive e-commerce website for my brand. The design is absolutely premium, it loads instantly, and they optimized the SEO perfectly. The best website development team in Madurai!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },

  {
    id: 4,
    name: "Arun Prasath",
    role: "Gaming Enthusiast",
    content: "The custom gaming PC they built for me is a beast! Clean cable management, perfect airflow, and top performance. I also purchased all my mechanical keyboard and gaming mouse accessories here.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  },
  {
    id: 5,
    name: "Meenakshi Sundaram",
    role: "School Administrator",
    content: "Excellent CCTV installation service. They set up high-definition cameras across our school campus and configured remote mobile viewing. They also handle our school printer maintenance with great efficiency.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    id: 6,
    name: "Siddharth",
    role: "Drone Photographer",
    content: "Superb drone service! Sian SmartTech repaired my drone's cracked motor arm, replaced the damaged ESC, and calibrated the flight controller. It flies perfectly stable now. Highly recommended for drone repairs.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
  }
];
export const companyInfo = {
  name: "Sian SmartTech",
  tagline: "Your Trusted Laptop & Computer Service Center in Madurai",
  description: "Sian SmartTech offers professional laptop service, computer repair, and chip-level hardware services with over 5 years of experience. We specialize in motherboard repair, device upgrades, data recovery, and custom PC builds in Anuppanadi, Madurai.",
  phone: "+91 93446 78135",
  email: "siansmarttech@gmail.com",
  address: "5/195, Ponnu Pillai Thoppu, Anuppanadi, Madurai - 625009.",
  hours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
  mapUrl:
    "https://maps.google.com/maps?q=5%2F195%2C%20ponnu%20pillai%20thoppu%2C%20anuppanadi%2C%20madurai%20-%20625009&t=&z=15&ie=UTF8&iwloc=&output=embed",
};
export const googleReviews = [
  {
    id: 1,
    authorName: "Senthil Kumar",
    rating: 5,
    relativeTime: "1 week ago",
    text: "Excellent chip level service. My dead laptop was repaired perfectly. Very professional support.",
    localGuide: true,
  },
  {
    id: 2,
    authorName: "Anitha R.",
    rating: 5,
    relativeTime: "3 days ago",
    text: "Honest and reliable service. Instead of changing expensive parts, they fixed the loose cable connection and charged very nominally.",
    localGuide: false,
  },
  {
    id: 3,
    authorName: "Vijay Prasad",
    rating: 5,
    relativeTime: "2 weeks ago",
    text: "The best place in Madurai for custom PC builds. Cable management is pristine and thermals are super cool.",
    localGuide: true,
  },
  {
    id: 4,
    authorName: "Divya Lakshmi",
    rating: 5,
    relativeTime: "1 month ago",
    text: "Prompt data recovery service. Recovered my lost office files from a corrupted hard drive. Lifesavers!",
    localGuide: false,
  }
];
export const itServicesData = [
  {
    id: 1,
    title: "Website Development & Design",
    description: "Custom, highly responsive websites built with modern technologies like React, Next.js, and WordPress. High performance, SEO-friendly, and secure.",
    icon: "Globe",
    image: "/images/web_development.webp",
    category: "DEVELOPMENT",
    rating: 5.0,
    turnaround: "1-2 Weeks",
    warranty: "30 Days Support",
    priceRange: "Started at ₹2,999",
    benefits: ["Responsive Design", "SEO Optimized", "Free Setup & Deployment"]
  },
  {
    id: 2,
    title: "Freelancing IT Services",
    description: "Professional IT freelancing services including custom database setups, server integration, web applications, and network consultancy.",
    icon: "Briefcase",
    image: "/images/freelancing.webp",
    category: "CONSULTING",
    rating: 4.9,
    turnaround: "Project-based",
    warranty: "Support Included",
    priceRange: "Based on task",
    benefits: ["Custom Coding", "Expert Consultants", "On-Time Delivery"]
  }
];