# Shipping Box Calculator

> **Enterprise-grade React application for calculating shipping costs worldwide from India**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

A shipping cost calculator built with modern React patterns, featuring comprehensive error handling, performance optimizations.

## 🏗️ Architecture Overview

**MVC (Model-View-Controller) pattern implementation**:

- **Clean Architecture**: Separation of concerns with layered architecture
- **MVC Pattern**: Complete separation of business logic from presentation layer
- **SOLID Principles**: Well-structured, maintainable, and extensible code
- **Performance Optimizations**: Memoization, lazy loading, and efficient rendering
- **Error Handling**: Comprehensive validation and user feedback
- **Accessibility**: WCAG 2.1 compliant with proper ARIA attributes
- **Testing**: Unit tests with high coverage and best practices

### 🎯 MVC Pattern Implementation

#### 📊 **Model Layer** (Business Logic & Data)
```
src/
├── context/BoxContext.js      # State management & business operations
├── utils/index.js             # Pure business logic functions
└── constants/index.js         # Business rules & configuration
```

**Features:**
- **Pure Business Functions**: All calculations, validations, and data transformations
- **State Management**: Complex state logic using useReducer pattern
- **Session State**: In-memory state management for current session
- **Business Rules**: Centralized shipping rates and validation rules

#### 🎨 **View Layer** (Presentation Only)
```
src/
├── components/AddBox.js       # Form presentation component
├── components/BoxList.js      # Table presentation component
├── components/BoxRow.js       # Individual row component
├── components/Navbar.js       # Navigation presentation
└── components/Notification.js # Toast notification component
```

**Features:**
- **Zero Business Logic**: Components only handle rendering and user interactions
- **Event Delegation**: All business operations delegated to controllers
- **Presentation State**: Only UI-specific state (loading, touched, etc.)
- **Accessibility**: WCAG compliant with proper ARIA attributes

#### 🎮 **Controller Layer** (Orchestration)
```
src/
├── hooks/useBoxForm.js        # Form business logic controller
├── hooks/useFormValidation.js # Form validation controller
├── hooks/useNotification.js   # Notification operations controller
└── context/BoxContext.js      # Main business controller
```

**Features:**
- **Business Logic Orchestration**: Coordinates between model and view
- **Custom Hooks**: Reusable business logic abstraction
- **Event Handling**: Processes user actions and triggers business operations
- **State Coordination**: Manages complex state transitions

### Technical Features
- **🛡️ Error Handling**: Comprehensive validation and user feedback
- **⚡ Performance**: Memoization and optimized rendering
- **🔄 State Management**: Context API with useReducer for complex state
- **🎯 Custom Hooks**: Reusable business logic abstraction (useFormValidation, useNotification)
- **🧪 Testing**: Comprehensive unit tests with Jest
- **📚 Documentation**: JSDoc comments and architectural documentation

## 🛠️ Technical Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM v6
- **State Management**: Context API + useReducer
- **Styling**: CSS3 with CSS Grid/Flexbox
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App
- **Code Quality**: ESLint + Prettier (configured)

## 📁 Project Architecture

```
src/
├── components/              # Reusable UI components
│   ├── AddBox.js           # Form component with validation
│   ├── BoxList.js          # Data table with CRUD operations
│   ├── BoxRow.js           # Individual table row component
│   ├── Navbar.js           # Navigation with active states
│   └── Notification.js     # Toast notification component
├── hooks/                  # Custom hooks for business logic
│   ├── useBoxForm.js       # Form state management
│   ├── useFormValidation.js # Form validation logic
│   └── useNotification.js  # Notification management
├── context/                # Global state management
│   └── BoxContext.js       # Application state provider
├── utils/                  # Pure utility functions
│   ├── index.js            # Helper functions
│   └── __tests__/          # Unit tests
├── constants/              # Application constants
│   └── index.js            # Configuration and constants
├── App.js                  # Main application with routing
└── index.js                # Application entry point
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 or **yarn**: >= 1.22.0

### Installation

```bash
# Clone and navigate to project
cd "/Users/vignesh-11339/vignesh_projects/Shipping Box"

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Development Commands

```bash
# Start with specific port
PORT=3001 npm start

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Format code
npm run format
```

## 💡 Advanced Usage

### Custom Hook Integration

```javascript
import { useBoxForm } from './hooks/useBoxForm';

const MyComponent = () => {
  const {
    formData,
    errors,
    handleChange,
    validateForm,
    resetForm
  } = useBoxForm();
  
  // Component logic here
};
```

### Context Usage

```javascript
import { useBox } from './context/BoxContext';

const MyComponent = () => {
  const {
    boxes,
    statistics,
    addBox,
    removeBox,
    loading,
    error
  } = useBox();
  
  // Component logic here
};
```

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- AddBox.test.js
```

### Performance Optimizations

1. **Memoization**: React.memo() for expensive components
2. **Callback Optimization**: useCallback for stable references
3. **State Optimization**: useReducer for complex state logic

## 🎯 Code Quality

### Best Practices Implemented

- **Single Responsibility Principle**: Each component has one clear purpose
- **DRY (Don't Repeat Yourself)**: Reusable utilities and components
- **Error Handling**: Comprehensive error boundaries and validation
- **Accessibility**: ARIA attributes, semantic HTML, keyboard navigation
- **Performance**: Optimized rendering and memory usage
- **Security**: Input validation and XSS prevention

## 📱 Responsive Design

### Mobile-First Approach
- Progressive enhancement
- Touch-friendly interactions
- Optimized performance on mobile devices


