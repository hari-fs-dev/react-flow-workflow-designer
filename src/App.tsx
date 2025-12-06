import { ReactFlowProvider } from 'reactflow';
import AppShell from './components/layout/AppShell';

function App() {
  return (
    <ReactFlowProvider>
      <AppShell />
    </ReactFlowProvider>
  );
}

export default App;
