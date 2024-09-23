import { ChakraProvider } from '@chakra-ui/react'; // Import ChakraProvider
import './App.css'; 
import Dessert from './components/dessert'; // Import Dessert component

function App() {
  return (
    <ChakraProvider>
      <Dessert />
    </ChakraProvider>
  );
}

export default App;
