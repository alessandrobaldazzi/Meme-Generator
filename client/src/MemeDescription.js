import { React } from "react";
import { Modal, Col, Button} from "react-bootstrap";
import MemeView from "./MemeView";



export default function MemeDescription(props){

    let t = props.templatesData.find((temp) => temp.name == props.template);
    
    return(
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Col>
                    <MemeView 
                        template = {t}
                        title = {props.title}
                        protected = {props.protected}
                        color = {props.color}
                        font = {props.font}
                        textone = {props.textone}
                        texttwo={props.texttwo}
                        textthree = {props.textthree}
                    />
                </Col>
                <Col>
                    <h1>{props.title}</h1>
                    <h2>Author: {props.author}</h2>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}