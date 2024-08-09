import { Group, Anchor, Container } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { ROLES } from "../helpers/constants"
import classes from "../styles/Header.module.css"

// ListAnimals Component
const Header = () => {
  const {
    auth: { role },
  } = useAuth()
  const navigate = useNavigate()

  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <Group>
          <Anchor
            component="button"
            onClick={() => navigate("/animals")}
            size="lg"
            className={classes.link}
          >
            Animals
          </Anchor>
          <Anchor
            component="button"
            onClick={() => navigate("/adoptions")}
            size="lg"
            className={classes.link}
          >
            Adoptions
          </Anchor>
          {role && [ROLES.Admin, ROLES.Volunteer].includes(role) && (
            <Anchor
              component="button"
              onClick={() => navigate("/adopters")}
              size="lg"
              className={classes.link}
            >
              Adopters
            </Anchor>
          )}
          {role === ROLES.Admin && (
            <Anchor
              component="button"
              onClick={() => navigate("/volunteers")}
              size="lg"
              className={classes.link}
            >
              Volunteers
            </Anchor>
          )}
        </Group>
      </Container>
    </header>
  )
}

export default Header
