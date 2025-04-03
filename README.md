# Parking Management System

A modern, admin-focused parking management solution built with React, TypeScript, and Tailwind CSS. This system provides a sleek interface for managing multi-floor parking facilities with real-time monitoring and automated fare calculation.

## Features

###  Parking Space Management
- Real-time visualization of parking spaces across multiple floors (B1, B2, B3)
- Dynamic status indicators (available, occupied, reserved)
- Interactive grid layout for easy space management

###  Fare Calculation
- Automated fare calculation based on parking duration
- Different rates for cars (Nrs. 50/hour) and bikes (Nrs. 20/hour)
- Real-time fare display during vehicle exit

###  Secure Authentication
- User registration and login system
- Password recovery functionality
- Role-based access control

###  Vehicle Tracking
- Record entry and exit times
- Store vehicle details (license plate, type)
- Track parking duration

###  Multi-Floor Support
- Easy navigation between parking floors
- Floor-wise occupancy summary
- Quick status overview

###  Notifications
- Real-time alerts for parking events
- Notification system for vehicle overstay
- System status updates

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context
- **Authentication**: Local Storage (Demo)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Admin Access
- Email: admin@parking.com
- Password: admin123

## Design Philosophy

The system features a modern, dark-themed interface with:
- Neon accents for important actions
- Glassmorphic UI elements
- Smooth animations and transitions
- Responsive design for all screen sizes
- Clear visual hierarchy and status indicators

## Future Enhancements

- Database integration for persistent storage
- Advanced analytics and reporting
- Payment gateway integration
- Mobile app for parking attendants
- Integration with number plate recognition systems