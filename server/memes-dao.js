'use strict';
const db = require('./db');

//1. Get all Templates
exports.listTemplates = () =>{
    return new Promise((resolve, reject) =>{
        const sql = "SELECT * FROM templates";
        db.all(sql, [], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
            const template = rows.map((e) => ({
                id : e.id,
                name : e.name,
                textnum : e.textnum,
                posone : e.posone,
                postwo : e.postwo,
                posthree : e.posthree,
            }));
            resolve(template);
        });
    });
}

//2. Get all available memes
exports.listMemes = (userId) => {
    return new Promise((resolve, reject) =>{
        let sql;
        if(userId != null && userId != ""){
            sql = "SELECT * FROM memas";
        }
        else{
            sql = "SELECT * FROM memas WHERE protected = \"0\"";
        }
        db.all(sql, [], (err, rows)=>{
            if(err){
                reject(err);
                return;
            }
            const meme = rows.map((e) =>({
                id : e.id,
                title : e.title,
                author : e.author,
                template : e.template,
                textone : e.textone,
                texttwo : e.texttwo,
                textthree : e.textthree,
                color : e.color,
                font : e.font,
                protected : e.protected,
            }));
            resolve(meme);
        });
    });
}

//3. Delete own meme
exports.deleteMeme = (id, user) => {
    return new Promise((resolve, reject) => {
      const sql1 = "SELECT name FROM users WHERE id=?";
      const sql2 = "DELETE FROM memas WHERE id=? AND author=?";
      db.get(sql1, [user], (err, row) =>{
        if (err) {
          reject({ error: "db error" });
          return;
        }
        if (row == undefined) {
          reject({ error: "user not found." });
        } 
        else {
          db.run(sql2, [id, row.name],  function(err) {
            if (err) {
              reject(err);
              return;
            } 
            else if(this.changes == 0){
              resolve("No changes: ");
            }
            else{
              resolve("Ok: ");
            }
          });
        }
      });
    });
};

//4. Add new meme
exports.createMeme = (meme) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT MAX(id) FROM memas";
      db.get(sql, (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        resolve(row.id);
      });
    }).then((id) => {
      const sql =
        "INSERT INTO memas VALUES (?, ? ,?, ?, ?, ?,?, ?, ?, ?)";
      db.run(
        sql,
        [
            id,
            meme.title,
            meme.author,
            meme.template,
            meme.textone,
            meme.texttwo,
            meme.textthree,
            meme.color,
            meme.font,
            meme.protected
        ],
        (err) => {
          if (err) {
            reject(err.message);
            return;
          }
          return;
        }
      );
    });
  };