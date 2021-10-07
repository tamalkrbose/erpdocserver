
var bodyParser = require('body-parser');
var express = require('express');
var serveStatic = require('serve-static');
var http = require('http');
var fs = require("fs");
var cors = require('cors');
var mysql = require('mysql2');

var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('/test1', test1);


app.all('/dashboard/getExcelData', getExcelData);
app.all('/dashboard/setExcelData', setExcelData);

app.set('port', process.env.PORT || 9603);
app.listen(app.get('port'), function () {
console.log('Express server listening on port ' + app.get('port'));
});
/*
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });
app.set('port', process.env.PORT || 9603);
app.listen(app.get('port'), function () {
console.log('Express server listening on port ' + app.get('port'));
});*/



//app.use('/web', express.static('../web'));

//app.get('/studentDel', studentDel);



var con = mysql.createConnection({
    connectionLimit: 100,
    host: "34.93.31.132",
    user: "remote",
    password: "Remote@147",
    port: 3306,
    database: "erpexcel"
});

async function runDB2(query, data) {
    
    let promise = new Promise((resolve, reject) => {
        con.connect(function(err) {
            if (err) reject(err);
            else {
                con.query(query, data, (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                });
            }
        });
    });
    let result = await promise;
    return result;
}

async function test1(req, res){
	result = [{status:'ok'}];
	res.send(result);
}



async function getExcelData(req, res){
    var batchNumber = req.body.batchNumber;


    console.log("getExcelData() postId: ", dataArray);

    var query = `select *
                from erpexcel.t_excel e
                where e.batch_number = '${(batchNumber)}';`
	
	//console.log(query);
	var result = await runDB2(query);
    console.log('getPostDetail result: ', result);
    res.send(result);
    
}

async function setExcelData(req, res){
    // console.log(req.body);
    var dataArray = req.body.dataArray;
    var batchNumber = req.body.batchNumber;
    console.log("setExcelData() postId: ", dataArray);

    var query = '';
	for (var i = 1; i < dataArray.length; i++) {
        query += `INSERT INTO erpexcel.t_excel (po_id, customer_id, ship_name, ship_mobile_number, ship_city, ship_pincode, order_date, weight, status, batch_number)
        VALUES ('${dataArray[i][0]}', '${dataArray[i][1]}', '${dataArray[i][2]}', '${dataArray[i][3]}', '${dataArray[i][4]}', '${dataArray[i][5]}', '${dataArray[i][6]}', '${dataArray[i][7]}', '${dataArray[i][7]}', '${batchNumber}');`
    }
	console.log(query);
	var result = await runDB2(query);
    console.log('getPostDetail result: ', result);
    res.send(result);
    
}


