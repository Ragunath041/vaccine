# Vaccination Management System

A modern web application for managing child vaccinations, built with React, TypeScript, and Tailwind CSS. This application operates entirely offline using localStorage for data persistence.

## Features

- **Parent Dashboard**: Manage children, book vaccination appointments, and track vaccination records
- **Doctor Dashboard**: View and manage appointments, accept/reject appointment requests
- **Offline Functionality**: All data is stored in localStorage, no backend required
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Usage

### Test Accounts

The application comes with pre-configured test accounts:

#### Parent Account
- Email: parent@example.com
- Password: password

#### Doctor Accounts
- Email: arun.patel@example.com
- Password: password

- Email: priya.sharma@example.com
- Password: password

### Login Options

The login page provides several options to help with testing:

1. **Show Test Doctor Accounts**: Displays a list of available doctor accounts
2. **Debug Login**: Automatically fills in doctor credentials
3. **Direct Login**: Bypasses the normal login flow and logs in directly as a doctor
4. **Test Data Options**: Initialize or reset test data in localStorage

### Parent Workflow

1. Log in as a parent
2. Add children to your profile
3. Book vaccination appointments
4. View vaccination records

### Doctor Workflow

1. Log in as a doctor
2. View pending appointments
3. Accept or reject appointment requests
4. Mark appointments as completed

## Troubleshooting

If you encounter login issues:

1. Click on "Test Data Options" on the login page
2. Click "Reset Test Data" to clear and reinitialize all data
3. Try logging in again with the provided test credentials

## Development

This application uses:

- React for UI components
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI for component library
- React Router for navigation
- localStorage for data persistence

## License

This project is licensed under the MIT License.