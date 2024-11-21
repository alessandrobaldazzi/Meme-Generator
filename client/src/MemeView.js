import { templateTraduction } from "./Meme";
import { Image } from "react-bootstrap";
import './MemeView.css';


export default function MemeView(props){

    function textfields(){
        if(props.template.textnum > 2){
            return(
                <>
                    <h3 className={props.template.postwo}>{props.texttwo}</h3>
                    <h3 className={props.template.posthree}>{props.textthree}</h3>
                </>
            );
        }
        else if(props.template.textnum > 1){
            return(
                <h3 className={props.template.postwo}>{props.texttwo}</h3>
            );
        }
    }

    return(
        <div className="divview" style={{fontFamily: props.font, color: props.color, }}>
            <Image src={templateTraduction(props.template.name)} fluid />
            <h3 className={props.template.posone}>{props.textone}</h3>
            {textfields()}
        </div>
    );
}