import React from 'react'
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../services/appApi";

function Navigation() {
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();

    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user);
        window.location.replace("/");
    }
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="" style={{ width: 50, height: 50 }} />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!user && (
                <LinkContainer to="/login" className="fs-5">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              )}
              <LinkContainer to="/chat" className="fs-5">
                <Nav.Link>Chat</Nav.Link>
              </LinkContainer>
              {user && (
                <NavDropdown
                  title={
                    <>
                      {/* console.log({user.picture}) */}
                      <img
                        src={user.picture}
                        alt=""
                        style={{
                          width: 30,
                          height: 30,
                          marginRight: 10,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      {user.name}
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item>
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default Navigation