import axios from "axios";

const url = "/api";

//Login/Logout apis

async function logIn(credentials) {

    const response = await fetch(url+'/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      console.log("client: login returned ok from server")
      const user = await response.json();
      return user;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  
  async function logOut() {
    await fetch(url+'/sessions/current', { method: 'DELETE' });
  }
  
  async function getUserInfo() {
    const response = await fetch(url + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }

  //Memes/Templates 
  
  async function getAllTemplates(){
    return await axios
      .get(url + "/templates")
      .then((response) => {
        return response.data
      })
      .catch((err) =>{
        console.log(err);
      });
  }

  async function getAllMemes(){
    return await axios
      .get(url + "/memes")
      .then((response) =>{
        return response.data;
      })
      .catch((err) =>{
        console.log(err);
      });
  }

  async function deleteMeme(id){
    return await axios
      .delete(url + `/memes/${id}`)
      .then((response) =>{
        console.log(response);
        if(response.data === "No changes")
          return response.data;
        return (updateList) => (updateList ? false : true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function addMeme(meme){
    return await axios
      .post(url+"/memes", meme)
      .then((response) =>{
        console.log(response);
        return (updateList) => (updateList ? false : true);
      })
      .catch((err) =>{
        console.log(err);
      });
  }

  export { getAllTemplates, getAllMemes, logIn, logOut, getUserInfo, deleteMeme, addMeme }//, getSpecificMeme, getSpecificTemplate}