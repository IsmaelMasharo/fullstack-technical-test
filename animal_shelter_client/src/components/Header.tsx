import { Group, Anchor, Container } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { ROLES } from "../helpers/constants"

// ListAnimals Component
const Header = () => {
  const {
    auth: { role },
  } = useAuth()
  const navigate = useNavigate()

  return (
    <Container>
      <Group>
        <Anchor
          component="button"
          onClick={() => navigate("/animals")}
          size="lg"
        >
          Animals
        </Anchor>
        <Anchor
          component="button"
          onClick={() => navigate("/adoptions")}
          size="lg"
        >
          Adoptions
        </Anchor>
        {role && [ROLES.Admin, ROLES.Volunteer].includes(role) && (
          <Anchor
            component="button"
            onClick={() => navigate("/adopters")}
            size="lg"
          >
            Adopters
          </Anchor>
        )}
        {role === ROLES.Admin && (
          <Anchor
            component="button"
            onClick={() => navigate("/volunteers")}
            size="lg"
          >
            Volunteers
          </Anchor>
        )}
      </Group>
    </Container>
  )
}

export default Header
