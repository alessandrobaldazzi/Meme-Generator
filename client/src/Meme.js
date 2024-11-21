import React from "react";
import {Card, Col, Button} from "react-bootstrap";

import epichandshake from "./templates/Epic-Handshake.jpg"
import drake from "./templates/30b1gx.jpg"
import mike from "./templates/Mike-Wazowski-With-Two-Eyes-Blank-Meme-Template-768x768.jpg"
import readnotice from "./templates/read-the-notice-meme-template.jpg"
import onedoesnotsimply from "./templates/One-Does-Not-Simply.jpg"
import twobuttons from "./templates/Two-Buttons.jpg"

export default function Meme(props){
    return(
        <Col>
            <Card>
                <Card.Img variant="top" src={templateTraduction(props.template)}/>
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>Author: {props.author}</Card.Text>
                    <Button variant="primary" onClick ={() =>props.showMeme(props.id)} >See Complete</Button>
                    <Button variant="primary" onClick ={() => props.copyMeme(props.id)} >Copy Meme</Button>
                    <Button variant="primary" onClick ={() => props.deleteMeme(props.id)} >Delete Meme</Button>
                </Card.Body>
            </Card>
        </Col>

    );

}

const templateTraduction = (template)=>{
    switch(template){
        case "epichandshake":
            return epichandshake;
        case "drake":
            return drake;
        case "mike":
            return mike;
        case "readnotice":
            return readnotice;
        case "onedoesnotsimply":
            return onedoesnotsimply;
        case "twobuttons":
            return twobuttons;
        default:
            return "";
    }
}

export {templateTraduction}