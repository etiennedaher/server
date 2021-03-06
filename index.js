const mainConfig = require('./mainConfig')
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbUrl = `mongodb+srv://etienne:etienne@cluster0.pgwc0.mongodb.net/Nasco`

const app = express()
const port = mainConfig.port

let employeeSchema = mongoose.Schema({
  dateCreated: Date,
  name: String,
  picture: String,
  jobTitle: String,
  department: String,
  location: String
})

app.use(cors());
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/health', (req, res) => {
  res.send({
    result : true,
    data : 'Healthy Server!'
  })
})

app.get('/getEmployee', (req, res) => {
  let id=req.query.id
  //TODO: validate Id

  mongoose.connection.db.collection('employee', (error, collection) => {
    collection.findOne({_id: new mongoose.Types.ObjectId(id)}, (error, record) => {
      if(error){
        res.send({
          result : false,
          data : error.toString()
        })
      }else{
        res.send({
          result : true,
          data : record
        })
      }
    });
  })
})

app.get('/listEmployees', (req, res) => {
  mongoose.connection.db.collection('employee', (error, collection) => {
    collection.find({}).sort({dateCreated : -1}).toArray((error, records) => {
      if(error){
        res.send({
          result : false,
          data : error.toString()
        })
      }else{
        res.send({
          result : true,
          data : records
        })
      }
    });
  })
})

app.delete('/deleteEmployee', (req, res) => {
  let id=req.query.id
  //TODO: validate Id

  mongoose.connection.db.collection('employee', (error, collection) => {
    collection.remove({_id: new mongoose.Types.ObjectId(id)}, (error, response) => {
      if(error){
        res.send({
          result : false,
          data : error.toString()
        })
      }else{
        res.send({
          result : true,
          data : true
        })
      }
    });
  })
})

app.post('/addEmployee', (req, res) => {
  //TODO: validate record before proceeding
  let name=req.body.name
  let picture=req.body.picture
  let jobTitle=req.body.jobTitle
  let department=req.body.department
  let location=req.body.location

  mongoose.connection.db.collection('employee', (error, collection) => {
    let employeeModel = mongoose.model('employee', employeeSchema, 'employee');
    employeeModel.create({
      dateCreated: new Date(),
      name: name,
      picture: picture,
      jobTitle: jobTitle,
      department: department,
      location: location
    }, function(error, response) {
      if(error){
        res.send({
          result : false,
          data : error.toString()
        })
      }else{
        res.send({
          result : true,
          data : true
        })
      }
    })
  })
})

app.put('/updateEmployee', (req, res) => {
  //TODO: validate record before proceeding
  let id=req.body.id
  let name=req.body.name
  let picture=req.body.picture
  let jobTitle=req.body.jobTitle
  let department=req.body.department
  let location=req.body.location

  mongoose.connection.db.collection('employee', (error, collection) => {
    let employeeModel = mongoose.model('employee', employeeSchema, 'employee');
    employeeModel.update({_id: new mongoose.Types.ObjectId(id)}, {
      name: name,
      picture: picture,
      jobTitle: jobTitle,
      department: department,
      location: location
    }, function(error, response) {
      if(error){
        res.send({
          result : false,
          data : error.toString()
        })
      }else{
        res.send({
          result : true,
          data : true
        })
      }
    })
  })
})

initDb(()=>{
  app.listen(port, () => {
    console.log(`Employees app listening at http://localhost:${port}`)
  })
})

function initDb(cb){
  mongoose.connect(`${dbUrl}?retryWrites=true`, {
    useNewUrlParser: true,
    // "replset": { "rs_name": "rs0" },
  }).then(() => {
    console.log('mongo db connected');
    return cb()
  })
}
