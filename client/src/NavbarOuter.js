import "bootstrap/dist/css/bootstrap.min.css";
import {Navbar, Nav, Container, Button} from "react-bootstrap";
import { LogButton } from "./Login"
import "./App.css";

export default function NavbarOuter(props){

    return(
    <>
        <Navbar sticky="top" variant="dark">
            <Container>
                <Navbar.Brand>Meme Generator 3000</Navbar.Brand>
                <Nav className="me-auto">
                    <Button variant="outline-primary" onClick={props.memeCreatShow}>Create meme</Button>
                </Nav>
                <LogButton logout={props.doLogout} loggedIn={props.isLogged}/>
            </Container>
        </Navbar>
    </>
    );
}