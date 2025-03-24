
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add comprehensive error handling for the root rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div style="color: white; padding: 20px;">Failed to load the application. Please check the console for errors.</div>';
} else {
  try {
    console.log("Attempting to mount React application");
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("App successfully mounted to DOM");
  } catch (error) {
    console.error("Failed to render the app:", error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px;">Failed to load the application. Please check the console for errors.</div>';
  }
}
