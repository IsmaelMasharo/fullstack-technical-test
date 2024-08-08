import  { useState, useEffect } from 'react';
import { Paper, Title, Button, Text, Group, Loader, Card, Alert, Modal, TextInput } from '@mantine/core';
import { getAvailableAnimals, getAnimals, requestAdoption } from "../api/shelter.api"

// ListAnimals Component
const ListAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnimals = async () => {
    try {
      const response = await getAnimals(); // getAvailableAnimals
      console.log({requestAnimals: response}) 
      setAnimals(response.data);
    } catch (err) {
      setError('Error fetching animals.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleRequestAdoption = async (animalId) => {
    try {
        const response = await requestAdoption(animalId)
        console.log({requestedAdoption: response})
        fetchAnimals()
    } catch (err) {
        alert(err.response.data.detail)
    }
  }

  if (loading) return <Loader size="lg" />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Paper
      radius="md"
      p="xl"
      withBorder
    >
              <Title order={2} mb="md">Animals Available for Adoption</Title>
      <Group direction="column" spacing="md">
        {animals.map((animal) => (
          <Card key={animal.id} shadow="sm" padding="lg">
            <Text weight={500}>{animal.name}</Text>
            <Text>Age: {animal.age}</Text>
            <Text>Breed: {animal.breed}</Text>
            <Text>Type: {animal.type}</Text>
            <Button mt="md" onClick={() => handleRequestAdoption(animal.id)}>Adopt</Button>
          </Card>
        ))}
      </Group>
      </Paper>
  );
};

const Dashboard = () => {
    return (
        <ListAnimals />
    )
}

export default Dashboard