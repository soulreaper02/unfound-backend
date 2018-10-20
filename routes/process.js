const fileStream = require('fs');
const xm2js = require('xml2js');
const Motor = require('../models/motor');
const moment = require('moment');
let time = '';
let fileName = ''; 

module.exports = function (app) {
    app.post('/fileupload', function(req, res) {
        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
          }
          let uploadedFile = req.files.upload
          uploadedFile.mv(`public/xml/${req.files.upload.name}`, function(err){
              time = moment().format();
              if (err) throw err;
              fileName = req.files.upload.name;
              const parser = new xm2js.Parser();
              fileStream.readFile(`public/xml/${fileName}`, function(err, data) {
                  if (err) throw err;
                  parser.parseString(data, function(err, result) {
                      if (err) throw err;
                      let data = JSON.stringify(result);
                      res.status(200).send(data);
                  })
              })
          })
    });

    app.post('/process', function(req, res) {
        if (Object.keys(req.body).length == 0) {
            return res.status(500).send('Server Issue');
        }
        let data = req.body.vehicles.vehicle;
        const responseData = [];
        for (let i = 0; i < data.length; i++){
            let sanity = {};
            sanity['id'] = data[i].id[0];
            sanity['powertrain'] = data[i].powertrain[0];
            sanity['frame'] = data[i].frame[0].material[0];
            sanity['wheels'] = data[i].wheels[0].wheel;
            sanity['wheelCount'] = (!sanity['wheels']) ?  0 : data[i].wheels[0].wheel.length ;
            sanity['vehicleType'] = checkVehicleType(sanity['frame'], sanity['powertrain'], sanity['wheelCount']);
            sanity['uploadTime'] = time;
            responseData.push(sanity);
        }

        function checkVehicleType(frame, powertrain, wheelcount) {
        
            if (frame.toLowerCase() == 'plastic' && powertrain.toLowerCase() == 'human' && wheelcount == '3') {
                return 'Big Wheel';
            } else if (frame.toLowerCase() == 'metal' && powertrain.toLowerCase() == 'human' && wheelcount == '2'){
                return 'Bicycle';
            } else if (frame.toLowerCase() == 'metal' && powertrain.toLowerCase() == 'internal combustion' && wheelcount == '2'){
                return 'Motorcycle';
            } else if (frame.toLowerCase() == 'plastic' && powertrain.toLowerCase() == 'bernoulli' && wheelcount == '0' ){
                return 'Hang Glider';
            } else if (frame.toLowerCase() == 'metal' && powertrain.toLowerCase() == 'internal combustion' && wheelcount == '4') {
                return 'Car';
            } else {
                return 'UFO';
            }
        }
       
        if (responseData) {
            for (let i = 0; i < responseData.length; i++) {
                console.log(responseData[i].vehicleType);
                if (responseData[i].vehicleType) {
                    const userData = new Motor({
                        fileName    : fileName,
                        filePath    : `public/xml/${fileName}`,
                        vehicalID   : responseData[i].id,
                        vehicalType : responseData[i].vehicleType,
                        frame       : responseData[i].frame,
                        powertrain  : responseData[i].powertrain,
                        wheelCount  : responseData[i].wheelCount,
                        wheels      : responseData[i].wheels,
                        uploadTime  : time
                    })
                    userData.save(function (err) {
                        if (err) throw err;
                        console.log('successfully saved');
                    })
                }
            }
        }
        res.status(200).send(responseData);
    });

    app.get('/getallfiles', function(req, res) {
        Motor.find().distinct('fileName', function(err, result) {
            console.log(result);
            let data = []
            for (let i = 0; i < result.length; i ++) {
                 let res = {};
                 res['filename'] = result[i];
                 res['filepath'] = `http://localhost:9000/public/xml/${result[i]}`;
                 data.push(res);
            }
            res.status(200).send(data);
        })
    })

    app.post('/getreports', function(req, res) {
        let search = req.body.filename;
        Motor.find({fileName : `${search}`}, function(err, docs) {
            if (err) throw err;
            res.status(200).send(docs);
        })
    })
}