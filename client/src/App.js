import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import NavbarOuter from "./NavbarOuter";
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Button} from "react-bootstrap";
import { Login } from "./Login"
import { MemeList } from "./MemeList";
import { MemeCreator } from "./MemeCreator";
import { toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MemeDescription from "./MemeDescription";
import {getAllTemplates, 
  getAllMemes, 
  logIn, 
  logOut, 
  getUserInfo, 
  deleteMeme,
  addMeme
} from "./API"

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [memes, setMemes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [updateList, setupdateList] = useState(false);
  const [user_name, setUserName] = useState("");
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getUserInfo().then((user) => {
          console.log(user);
          setUserName(user.name);
        });
        setLoggedIn(true);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    getAllTemplates().then((templates) =>{
      setTemplates(templates);
    });
    getAllMemes().then((memes) =>{
      setMemes(memes);
    });
  }, [loggedIn, updateList]);

  //Meme hooks
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);

  const [template, setTemplate] = useState("onedoesnotsimply");
  const [title, setTitle] = useState("");
  const [isProtected, setProtected] = useState(false);
  const [textone, setTextone] = useState(""); 
  const [texttwo, setTexttwo] = useState(""); 
  const [textthree, setTextthree] = useState(""); 
  const [color, setColor] = useState("Black");
  const [font, setFont] = useState("Times New Roman, Times, serif");
  const [author, setAuthor] = useState("");

  const[isCopied, setCopied] = useState(false);

  const doLogIn = async (credentials) => {
    try {
      console.log("inside doLogin");
      console.log(credentials);
      const user = await logIn(credentials);
      setUserName(user.name);
      console.log(user);
      console.log("loggggin");
      setLoggedIn(true);
    } catch(err) {
      toast.error("Wrong email or/and password, try again");
      console.log(err);
    }
  }

  const doLogOut = async () => {
    await logOut();
    setLoggedIn(false);
    setUserName("");
    setMemes([]);
  }

  function setNewMeme(){
    setTemplate("onedoesnotsimply");
    setTitle("");
    setProtected(false);
    setTextone("");
    setTexttwo("");
    setTextthree("");
    setColor("Black");
    setFont("")
    setCopied(false);
    setAuthor("");
  }

  function selectMeme(meme){
    setTemplate(meme.template);
    setTitle(meme.title);
    setProtected(meme.protected);
    setColor(meme.color);
    setFont(meme.font);
    setTextone(meme.textone);
    setTexttwo(meme.texttwo);
    setTextthree(meme.textthree);
    setAuthor(meme.author);
  }

  function seeMeme(id){
    let meme = getMeme(id);
    selectMeme(meme);
    handleViewShow();
  }

  function copyMeme(id){
    let meme = getMeme(id);
    selectMeme(meme);
    setCopied(true);
    handleAddShow();
  }

  function getMeme(id){
    return memes.find(m => m.id == id);
  }

  //FormErrors?
  const findFormErrors = () =>{
    const newErrors = {};
    let temp;
    if(!template || template == ""){
      newErrors.template = "The template cannot be empty";
    }
    else if(!(temp = templates.find(t => t.name == template))){
      newErrors.template = "The template doesn't exist";
    }
    if(!title || title == ""){
      newErrors.title = "The title cannot be empty";
    }
    if(!textone || textone == ""){
      newErrors.textone = "Text one cannot be empty";
    }
    if(temp && temp.textnum>1){
      if(!texttwo || texttwo == ""){
        newErrors.texttwo = "Text two cannot be empty";
      }
    }
    if(temp && temp.textnum>2){
      if(!textthree || textthree == ""){
        newErrors.textthree = "Text three cannot be empty";
      }
    }
    return newErrors;
  }

  //View meme managing
  const handleViewClose = () =>{
    setShowView(false);
    setNewMeme();
  }

  const handleViewShow = () => setShowView(true);

  const handleAddClose = () =>{
    setShowAdd(false);
    setNewMeme();
  }

  const handleAddShow = () => {
    if(loggedIn){
      setShowAdd(true);
      return;
    }
    toast.error("You must be logged to create a meme");
  };

  const handleAdd = (val) =>{
    const newErrors = findFormErrors();
    if(Object.keys(newErrors).length>0){
      //Errors
      Object.values(newErrors).forEach((v) => toast.error(v));
    }
    else{
      //No errors
      setShowAdd(false);
      const newMeme = {
        id: memes.length
          ? memes.map((m) => m.id).sort((a,b) => a-b)[
              memes.length-1
            ] +1
          :1,
        template: template,
        title: title,
        protected: val=='on' ? 1 : 0,
        textone: textone,
        texttwo: texttwo,
        textthree: textthree,
        color: color,
        font: font,
        author: user_name,
      };
      newMemeApi(newMeme);
      setNewMeme();

      toast.success("Meme Added Successfully", { autoClose: 5000});
    }
  };

  //APIs

  let newMemeApi = async (newMeme) =>{
    if(loggedIn){
      addMeme({
        id : newMeme.id,
        template : newMeme.template,
        title : newMeme.title,
        protected : newMeme.protected,
        color : newMeme.color,
        font : newMeme.font,
        textone : newMeme.textone,
        texttwo : newMeme.texttwo,
        textthree : newMeme.textthree,
        author : newMeme.author
      })
      .then((memes) => setupdateList(memes));
    }
  }

  let deleteMemeApi = async (id)=>{
    if(loggedIn){
      deleteMeme(id)
      .then((meme) => {
        if(meme === "No changes"){
          toast.error("A meme can be deleted only by his author");
        }
        else{
          setupdateList(meme)
          toast.success("Task Deleted Successfully", { autoClose: 5000 });
        }
      })
      .catch((err) => toast.error("Error in deletion of meme", { autoClose: 5000 }));
      return;
    }
    toast.error("You must be logged to delete a meme");
  }

  const deleteAMeme = (memeId) =>{
    deleteMemeApi(memeId);
  }
  
  return (
    <Router>
      <Switch>
        <Route exact path="/login" render={ ()=>
          <>{ loggedIn ? <Redirect to="/home" /> : <Login handleSubmit={doLogIn}/> } </>
        }/>
        <Route path="/" render={ ()=>          
          <>
            <Redirect to="/home"/>
            <>
              <NavbarOuter doLogout={doLogOut} isLogged={loggedIn} memeCreatShow={handleAddShow}/>
              <ToastContainer/>
              <Container fluid>
                <MemeList 
                  isLogged={loggedIn} 
                  memes={memes} 
                  templates={templates} 
                  showMeme = {seeMeme}
                  deleteMeme={deleteAMeme}
                  copyMeme={copyMeme}
                />
                <MemeCreator
                  show = {showAdd}
                  handleClose={handleAddClose}
                  handleShow ={handleAddShow}
                  handleAdd = {handleAdd}
                  templatesData = {templates}
                  template = {template}
                  setTemplate = {setTemplate}
                  title = {title}
                  setTitle={setTitle}
                  protected = {isProtected}
                  setProtected = {setProtected}
                  color = {color}
                  setColor={setColor}
                  font = {font}
                  setFont = {setFont}
                  textone = {textone}
                  setTextone={setTextone}
                  texttwo={texttwo}
                  setTexttwo={setTexttwo}
                  textthree = {textthree}
                  setTextthree={setTextthree}
                  copied = {isCopied}
                  author = {author}
                  user_name ={user_name}
                />
                <MemeDescription
                  show = {showView}
                  handleClose={handleViewClose}
                  handleShow ={handleViewShow}
                  templatesData = {templates}
                  template = {template}
                  title = {title}
                  protected = {isProtected}
                  color = {color}
                  font = {font}
                  textone = {textone}
                  texttwo={texttwo}
                  textthree = {textthree}
                  author = {author}
                />
                <Button
                     className="btn btn-lg fixed-right-bottom"
                     onClick={handleAddShow}
                   >
                     &#43;
                </Button>
              </Container>
            </>
          </>
        }/>
      </Switch>
    </Router>
  );
}

export default App;
