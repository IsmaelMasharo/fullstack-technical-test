import { Group, Anchor, Container, Button } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import classes from "../styles/Header.module.css"
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout"
import { ROLES } from "../helpers/constants"

const Header = () => {
  const {
    auth: { role },
  } = useAuth()
  const navigate = useNavigate()
  const logout = useLogout()

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
          {role && [ROLES.Admin, ROLES.Volunteer].includes(role) && (
            <>
              <Anchor
                component="button"
                onClick={() => navigate("/adoptions")}
                size="lg"
                className={classes.link}
              >
                Adoptions
              </Anchor>
              <Anchor
                component="button"
                onClick={() => navigate("/adopters")}
                size="lg"
                className={classes.link}
              >
                Adopters
              </Anchor>
            </>
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
        <Button onClick={logout}>Log Out</Button>
      </Container>
    </header>
  )
}

export default Header
