# Personal Finance Assistant

A mobile-first web application for managing personal finances using voice commands. Built with React, TypeScript, Tailwind CSS, and Azure Speech to Text.

## Features

- Voice-based transaction recording
- Transaction history tracking
- Financial dashboard with metrics and charts
- iOS-inspired minimalist design
- Mobile-first responsive layout

## Prerequisites

- Node.js (v14 or higher)
- Azure Speech Services subscription

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd app-finance-personal
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Azure Speech Services credentials:

```
VITE_AZURE_SPEECH_KEY=your_azure_speech_key_here
VITE_AZURE_SPEECH_REGION=your_azure_speech_region_here
```

4. Start the development server:

```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages
├── store/         # Redux store and slices
└── types/         # TypeScript type definitions
```

## Technologies Used

- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Azure Speech to Text
- Chart.js
- React Router
- date-fns

## Voice Commands

The application supports natural language voice commands for recording transactions. Examples:

- "I spent $50 on groceries"
- "I earned $100 from freelance work"
- "Expense of $30 for lunch"
- "Income of $500 from salary"

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
