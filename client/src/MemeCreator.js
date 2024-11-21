import {Col, Form, Button, Row} from "react-bootstrap";
import { React, useState} from "react";
import MemeView from "./MemeView";
import { Modal } from "react-bootstrap";

function MemeCreator(props){
    let t = props.templatesData.find((temp) => temp.name == props.template);

    const colors = ["Black", "White", "Tomato", "Orange", "DodgerBlue", "SteelBlue"]; 
    const fonts = ["Times New Roman, Times, serif", "Arial, Helvetica, sans-serif", "Lucida Console, Courier New, monospace"];
    
    const [prot, setProt] = useState(props.protected);

    let op = [], cols = [], fnts = [];
    for(let i=0; i<props.templatesData.length; i++){
        op.push(<option>{props.templatesData[i].name}</option>)
    }

    for(let i=0; i<colors.length; i++){
        cols.push(<option>{colors[i]}</option>)
    }

    for(let i=0; i<fonts.length; i++){
        fnts.push(<option>{fonts[i]}</option>)
    }

    function textsForms(t){
        if(t && t.textnum == 2){
            return(
                <Form.Group>
                    <Form.Label>Text Two</Form.Label>
                    <Form.Control type="text" value={props.texttwo} onChange={e => {props.setTexttwo(e.target.value);}}/>
                </Form.Group>
            );
        }
        else if(t && t.textnum == 3){
            return(
                <>
                    <Form.Group>
                        <Form.Label>Text Two</Form.Label>
                        <Form.Control type="text" value={props.texttwo} onChange={e => {props.setTexttwo(e.target.value);}}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Text Three</Form.Label>
                        <Form.Control type="text" value={props.textthree} onChange={e => {props.setTextthree(e.target.value);}}/>
                    </Form.Group>
                </>
            );
        }
    }

    return(
        <Modal show={props.show} onHide={props.handleAddClose}>
            <Modal.Header>
                <Modal.Title>
                    Create your Meme
                </Modal.Title>
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
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={props.title} onChange={e => {props.setTitle(e.target.value);}}/>
                            <Form.Label>Template</Form.Label>
                            <Form.Control as="select" disabled={props.copied} defaultValue={props.template} onChange={e => {
                                props.setTemplate(e.target.value);
                            }}>
                                {op}
                            </Form.Control>
                            <Form.Group>
                                <Form.Label>Text One</Form.Label>
                                <Form.Control type="text" value={props.textone} onChange={e => {props.setTextone(e.target.value);}}/>
                            </Form.Group>
                            {textsForms(t)}
                            <Form.Label>Text Color</Form.Label>
                            <Form.Control as="select" onChange={e => {props.setColor(e.target.value);}}>
                                {cols} 
                            </Form.Control>
                            <Form.Label>Text Font</Form.Label>
                            <Form.Control as="select" onChange={e => {props.setFont(e.target.value);}}>
                                {fnts}
                            </Form.Control>
                            <Form.Check type="checkbox" label="Protected" 
                                disabled={props.copied && props.protected && props.author!=props.user_name} 
                                defaultChecked={props.protected} onClick={(e) => setProt(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => props.handleAdd(prot)}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export {MemeCreator}