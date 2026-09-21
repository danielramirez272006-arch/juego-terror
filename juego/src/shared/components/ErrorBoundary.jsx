import React from 'react';
import { BlueScreen } from './BlueScreen';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error ? this.state.error.toString() : "Error desconocido";
      return <BlueScreen errorMessage={msg} />;
    }

    return this.props.children; 
  }
}
