import { useState, useEffect } from 'react';
import {
  Box, Button, Grid, Heading, Image, Text, VStack, HStack, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
} from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';
import data from '../data.json';
import CartImage from '../assets/images/illustration-empty-cart.svg';

export default function Dessert() {
  const [cart, setCart] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();  

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dessert) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.name === dessert.name);
      if (itemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[itemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { ...dessert, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (dessertName) => {
    setCart((prevCart) => prevCart.filter(item => item.name !== dessertName));
  };

  const increaseQuantity = (dessertName) => {
    setCart((prevCart) => prevCart.map(item => 
      item.name === dessertName ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (dessertName) => {
    setCart((prevCart) => prevCart.map(item => 
      item.name === dessertName ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // New function to handle modal close and clear the cart
  const handleClose = () => {
    setCart([]); // Clear the cart
    onClose(); // Close the modal
  };

  return (
    <Box minH="100vh" bg="gray.50" p={{ base: 4, md: 8 }} display="flex" flexDirection="column">
      <Box display="flex" flexDirection={{ base: 'column', lg: 'row' }} justifyContent="space-between" alignItems="start">
        {/* Dessert Section */}
        <Box w={{ base: 'full', lg: '70%' }} pr={{ base: 0, lg: 10 }}>
          <Heading as="h1" size="xl" mb={6} color="black" fontWeight="bold">Desserts</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {data.map((dessert, index) => (
              <Box key={index} bg="white" shadow="lg" rounded="lg" overflow="hidden">
                <Image src={dessert.image.desktop} alt={dessert.name} objectFit="cover" h={{ base: '36', md: '48' }} w="full" />
                <VStack p={4} textAlign="center">
                  <Heading as="h2" size="md" color="gray.800" fontWeight="semibold">{dessert.name}</Heading>
                  <Text fontSize="lg" color="gray.600">${dessert.price.toFixed(2)}</Text>
                  <Text fontSize="lg" color="gray.500">{dessert.category}</Text>
                  <Button
                    colorScheme="orange"
                    leftIcon={<FaShoppingCart />}
                    onClick={()=>addToCart(dessert)}
                    size="lg"
                    variant="outline"
                    rounded="full"
                    mt={3}
                  >
                    Add to Cart
                  </Button>
                </VStack>
              </Box>
            ))}
          </Grid>
        </Box>

        {/* Cart Section for Desktop */}
        <Box display={{ base: 'none', lg: 'block' }} w="30%">
          <Box bg="white" shadow="lg" p={4} rounded="lg">
            <Heading as="h2" size="lg" mb={4} color="black">Your Cart ({cart.length})</Heading>
            {cart.length === 0 ? (
              <VStack justifyContent="center" h="48">
                <Image src={CartImage} alt="Empty Cart" />
                <Text textAlign="center" fontSize="lg" mt={2} color="gray.600">Your added items will appear here</Text>
              </VStack>
            ) : (
              <>
                <VStack spacing={4}>
                  {cart.map((item, index) => (
                    <HStack key={index} justifyContent="space-between" w="full">
                      <Text color="gray.800">{item.name}</Text>
                      <HStack>
                        <Button size="sm" bg="gray.300" onClick={() => decreaseQuantity(item.name)}>-</Button>
                        <Text>{item.quantity} x ${item.price.toFixed(2)}</Text>
                        <Button size="sm" bg="gray.300" onClick={() => increaseQuantity(item.name)}>+</Button>
                        <Button size="sm" colorScheme="red" onClick={() => removeFromCart(item.name)}>Remove</Button>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
                <Text mt={4} fontSize="lg" fontWeight="bold">Order Total: ${calculateTotal()}</Text>
                <Button colorScheme="orange" w="full" mt={4} onClick={onOpen}>Confirm Order</Button>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Fixed Cart Section for Mobile */}
      <Box display={{ base: 'block', lg: 'none' }} bottom="0" left="0" right="0" bg="white" p={4} shadow="lg">
        <Box>
          <Heading as="h2" size="lg" mb={2} color="black">Your Cart ({cart.length})</Heading>
          {cart.length === 0 ? (
            <VStack justifyContent="center" h="48">
              <Image src={CartImage} alt="Empty Cart" />
              <Text textAlign="center" fontSize="lg" mt={2} color="gray.600">Your added items will appear here</Text>
            </VStack>
          ) : (
            <VStack spacing={4}>
              {cart.map((item, index) => (
                <HStack key={index} justifyContent="space-between" w="full">
                  <Text color="gray.800">{item.name}</Text>
                  <HStack>
                    <Button size="sm" bg="gray.300" onClick={() => decreaseQuantity(item.name)}>-</Button>
                    <Text>{item.quantity} x ${item.price.toFixed(2)}</Text>
                    <Button size="sm" bg="gray.300" onClick={() => increaseQuantity(item.name)}>+</Button>
                    <Button size="sm" colorScheme="red" onClick={() => removeFromCart(item.name)}>Remove</Button>
                  </HStack>
                </HStack>
              ))}
              <Text mt={4} fontSize="lg" fontWeight="bold">Order Total: ${calculateTotal()}</Text>
              <Button colorScheme="orange" w="full" mt={4} onClick={onOpen}>Confirm Order</Button>
            </VStack>
          )}
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">Order Confirmed!</ModalHeader>
          <ModalBody>
            <Text color="gray.600">Your order has been placed successfully!</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" onClick={handleClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
