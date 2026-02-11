const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const connectDB = require('./config/db');

dotenv.config();

// const doctors = [
//     {
//         name: "Dr. Emily Carter",
//         specialization: "Cardiologist",
//         experience: 15,
//         location: "New York, NY",
//         hospital: "City Heart Center",
//         email: "emily.carter@example.com",
//         image: "https://randomuser.me/api/portraits/women/44.jpg",
//         rating: 4.8,
//         distance: "2.5 km"
//     },
//     {
//         name: "Dr. James Wilson",
//         specialization: "Dermatologist",
//         experience: 10,
//         location: "Los Angeles, CA",
//         hospital: "Skin Care Clinic",
//         email: "james.wilson@example.com",
//         image: "https://randomuser.me/api/portraits/men/32.jpg",
//         rating: 4.5,
//         distance: "4.0 km"
//     },
//     {
//         name: "Dr. Sarah Lee",
//         specialization: "Pediatrician",
//         experience: 8,
//         location: "Chicago, IL",
//         hospital: "Children's Hospital",
//         email: "sarah.lee@example.com",
//         image: "https://randomuser.me/api/portraits/women/68.jpg",
//         rating: 4.9,
//         distance: "1.2 km"
//     },
//     {
//         name: "Dr. Michael Chen",
//         specialization: "Neurologist",
//         experience: 20,
//         location: "San Francisco, CA",
//         hospital: "Brain & Spine Institute",
//         email: "michael.chen@example.com",
//         image: "https://randomuser.me/api/portraits/men/11.jpg",
//         rating: 5.0,
//         distance: "5.5 km"
//     },
//     {
//         name: "Dr. Olivia Martinez",
//         specialization: "Psychiatrist",
//         experience: 12,
//         location: "Miami, FL",
//         hospital: "Mind Wellness Center",
//         email: "olivia.martinez@example.com",
//         image: "https://randomuser.me/api/portraits/women/33.jpg",
//         rating: 4.7,
//         distance: "3.0 km"
//     },
//     {
//         name: "Dr. David Kim",
//         specialization: "Orthopedic Surgeon",
//         experience: 18,
//         location: "Seattle, WA",
//         hospital: "Joint Care Hospital",
//         email: "david.kim@example.com",
//         image: "https://randomuser.me/api/portraits/men/55.jpg",
//         rating: 4.6,
//         distance: "6.0 km"
//     }
// ];

const seedDoctors = async () => {
    try {
        await connectDB();

        await Doctor.deleteMany(); // Clear existing
        console.log('Doctors Cleared');

        await Doctor.insertMany(doctors);
        console.log('Doctors Imported');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDoctors();
