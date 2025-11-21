const http = require('http');
const express = require('express');
const { checkBodyFields } =require("./helpers/bodyHelpers");
const cors = require("cors")
const config = require("./db/knexfile.js")
const pg = require('knex')(config.development);

const app = express();
http.Server(app); 
app.use(express.json())

const port = 3000;


app.use(cors());

app.get('/', (req, res) => {
  res.send("hello world")
})


// Students endpoints
app.get('/students', (req, res) => {
  pg.select("*").table("students").then((data) => {
    res.send(data)
  })
})

app.post('/students', (req, res) => {
  if(req.body) {
    if(checkBodyFields(req.body, ["uuid", "first_name", "last_name", "class", "year"])) {
      pg.insert(req.body).table("students").returning("*").then((data) => {
        res.status(200).send(data)
      })
      .catch((e) => {
        res.status(501).send()
      })
    }
    else {
      res.status(402).send({ "fields": "no"})
    }
  } else {
    res.status(401).send({"message": "no"})
  }
})


// Research Documents endpoints
app.get('/research-documents', (req, res) => {
  pg.select("*").table("research_documents").then((data) => {
    res.send(data)
  })
})

app.get('/research-documents/:id', (req, res) => {
  pg.select("*").table("research_documents").where('id', req.params.id).first().then((data) => {
    if(data) {
      res.send(data)
    } else {
      res.status(404).send()
    }
  })
})

app.post('/research-documents', (req, res) => {
  if(req.body) {
    if(checkBodyFields(req.body, ["uuid", "student_id", "title"])) {
      pg.insert(req.body).table("research_documents").returning("*").then((data) => {
        res.status(200).send(data)
      })
      .catch((e) => {
        res.status(501).send()
      })
    }
    else {
      res.status(400).send()
    }
  } else {
    res.status(400).send()
  }
})

app.put('/research-documents/:id', (req, res) => {
  if(req.body) {
    pg.update(req.body).table("research_documents").where('id', req.params.id).returning("*").then((data) => {
      if(data.length > 0) {
        res.status(200).send(data)
      } else {
        res.status(404).send()
      }
    })
    .catch((e) => {
      res.status(501).send()
    })
  } else {
    res.status(400).send()
  }
})

app.delete('/research-documents/:id', (req, res) => {
  pg.delete().table("research_documents").where('id', req.params.id).then(() => {
    res.status(200).send()
  })
  .catch((e) => {
    res.status(501).send()
  })
})


// Research Notes endpoints
app.get('/research-notes', (req, res) => {
  const documentId = req.query.research_document_id;
  let query = pg.select("*").table("research_notes");
  if(documentId) {
    query = query.where('research_document_id', documentId);
  }
  query.then((data) => {
    res.send(data)
  })
})

app.post('/research-notes', (req, res) => {
  if(req.body) {
    if(checkBodyFields(req.body, ["uuid", "research_document_id", "content", "note_type"])) {
      pg.insert(req.body).table("research_notes").returning("*").then((data) => {
        res.status(200).send(data)
      })
      .catch((e) => {
        res.status(501).send()
      })
    }
    else {
      res.status(400).send()
    }
  } else {
    res.status(400).send()
  }
})

app.delete('/research-notes/:id', (req, res) => {
  pg.delete().table("research_notes").where('id', req.params.id).then(() => {
    res.status(200).send()
  })
  .catch((e) => {
    res.status(501).send()
  })
})


// Research Resources endpoints
app.get('/research-resources', (req, res) => {
  const documentId = req.query.research_document_id;
  let query = pg.select("*").table("research_resources");
  if(documentId) {
    query = query.where('research_document_id', documentId);
  }
  query.then((data) => {
    res.send(data)
  })
})

app.post('/research-resources', (req, res) => {
  if(req.body) {
    if(checkBodyFields(req.body, ["uuid", "research_document_id", "title", "resource_type"])) {
      pg.insert(req.body).table("research_resources").returning("*").then((data) => {
        res.status(200).send(data)
      })
      .catch((e) => {
        res.status(501).send()
      })
    }
    else {
      res.status(400).send()
    }
  } else {
    res.status(400).send()
  }
})

app.delete('/research-resources/:id', (req, res) => {
  pg.delete().table("research_resources").where('id', req.params.id).then(() => {
    res.status(200).send()
  })
  .catch((e) => {
    res.status(501).send()
  })
})


module.exports = app;