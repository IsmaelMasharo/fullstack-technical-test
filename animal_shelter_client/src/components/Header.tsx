import { Group, Anchor, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
      <Container>
        <Group >    
          <Anchor component="button" onClick={() => navigate('/animals')} size="lg">
            Animals
          </Anchor>
          <Anchor component="button" onClick={() => navigate('/adoptions')} size="lg">
            Adoptions
          </Anchor>
          <Anchor component="button" onClick={() => navigate('/adopters')} size="lg">
            Adopters
          </Anchor>
          <Anchor component="button" onClick={() => navigate('/volunteers')} size="lg">
            Volunteers
          </Anchor>
        </Group>
      </Container>
  );
};

export default Header;
