const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer(function(req,res) {
    res.writeHead(200,{ 'Content-Type':'text/html'}) //writes html to browser
    fs.readFile('index.html', function (error,data) {
        if (error) {
            res.writeHead(404)
            res.write('Error: File Not Found')
        }
        else{
            res.write(data)
        }
        res.end()
    })
/*
    res.write('Hello Node') //change to restful probably
    res.end()
*/
})

server.listen(port, function(error){
    if (error) {
        console.log('something wrong', error)
    }
    else {
        console.log('server is listening ' + port)
    }
})