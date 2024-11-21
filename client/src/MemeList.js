import {CardColumns, Row} from "react-bootstrap";
import Meme from "./Meme";
import './MemeList.css';

export default function MemeList(props){
    function memeActions(){
            return props.memes.map((meme) => (
                <Meme id={meme.id}
                    template = {meme.template}
                    title = {meme.title}
                    protected = {meme.protected}
                    author = {meme.author}
                    showMeme = {props.showMeme}
                    deleteMeme={props.deleteMeme}
                    copyMeme={props.copyMeme}
                />
            ));
    }
    
    return(
        <CardColumns xs={1} md={5} className="memecolumns">
        <>
            {props.memes.length ? 
                memeActions()
            :<></>}
        </>
        </CardColumns>
    );
}

export {MemeList}