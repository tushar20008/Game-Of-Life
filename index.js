var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Blocks HTML characters (security equivalent to htmlentities in PHP)
    fs = require('fs');

// Loading the page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var defaultColor = "rgb(255,255,255)";
var row = 15, col = 15;
var cells = [];
for(var i=0; i<row; i++){
    var temp = [];
    for(var j=0; j<col; j++){
        temp.push(defaultColor);
    }
    cells.push(temp);
}

// Get Next generation of cells every 5 secs
setInterval(function(){
    getNextGen();
    io.emit('updateCell',  cells);
}, 5000);

io.sockets.on('connection', function (socket) {

    socket.on('new_client', function(randomColor) {
        socket.color = randomColor;
        io.emit('updateCell',  cells);
    });

    socket.on('createCell', function (cellInfo) {
        if(cells[cellInfo[0]][cellInfo[1]] == socket.color)
            cells[cellInfo[0]][cellInfo[1]] = defaultColor;
        else
            cells[cellInfo[0]][cellInfo[1]] = socket.color;
        io.emit('createCell',  {cellInfo: cellInfo, color:cells[cellInfo[0]][cellInfo[1]]});
    }); 

    socket.on('createPattern', function (patternName) {
        if(createPattern(patternName, socket.color)){
            io.emit('updateCell',  cells);
        }
    });

});

function createPattern(patternName, color){

    // Need 4x4 dead cells
    if(patternName == 'block'){
        for(var i=0; i<row-3; i++){
            for(var j=0; j<col-3; j++){
                var isEmpty = true;
                for(var m=i; m<i+4; m++){
                    for(var n=j; n<j+4; n++){
                        if(cells[m][n] != defaultColor){
                            isEmpty = false;
                            break;
                        }
                    }
                    if(!isEmpty)
                        break;
                }
                if(isEmpty){
                    cells[i+1][j+1] = color;
                    cells[i+2][j+2] = color;
                    cells[i+1][j+2] = color;
                    cells[i+2][j+1] = color;
                    return true;
                }
            }
        }
    }
    // Need 5x5 dead cells
    else{
        for(var i=0; i<row-4; i++){
            for(var j=0; j<col-4; j++){
                var isEmpty = true;
                for(var m=i; m<i+5; m++){
                    for(var n=j; n<j+5; n++){
                        if(cells[m][n] != defaultColor){
                            isEmpty = false;
                            break;
                        }
                    }
                    if(!isEmpty)
                        break;
                }
                if(isEmpty){
                    if(patternName == 'tub'){
                        cells[i+1][j+2] = color;
                        cells[i+2][j+1] = color;
                        cells[i+2][j+3] = color;
                        cells[i+3][j+2] = color;
                        return true;
                    }
                    else if(patternName == 'blinker'){
                        cells[i+2][j+1] = color;
                        cells[i+2][j+2] = color;
                        cells[i+2][j+3] = color;
                        return true;
                    }
                    return true;
                }
            }
        }
    }
    return false;
}

// Check the conditions for each cell to see next gen
function getNextGen(){
    var nextGen = [];
    for(var i=0; i<row; i++){
        var temp = [];
        for(var j=0; j<col; j++){
            temp.push(defaultColor);
        }
        nextGen.push(temp);
    }

    for(var i=0; i<row; i++){
        for(var j=0; j<col; j++){
            var alive = 0, status = 'alive';
            var aliveNeighbourColors = [];
            if (cells[i][j] == defaultColor)
                status = 'dead'; 

            if(j>0 && cells[i][j-1] != defaultColor){
                alive++;
                aliveNeighbourColors.push(cells[i][j-1]);
            }
            if(j>0 && i>0 && cells[i-1][j-1] != defaultColor){
                alive++;
                aliveNeighbourColors.push(cells[i-1][j-1]);
            }
            if(j>0 && i<row-1 && cells[i+1][j-1] != defaultColor){
                alive++;
                aliveNeighbourColors.push(cells[i+1][j-1]);
            }
            if(i>0 && cells[i-1][j] != defaultColor){
                alive++;
                aliveNeighbourColors.push(cells[i-1][j]);
            }
            if(i<row-1 && cells[i+1][j] != defaultColor){
                alive++;
                aliveNeighbourColors.push(cells[i+1][j]);
            }
            if(i>0 && j<col-1 && cells[i-1][j+1] != defaultColor){
                alive++;
                aliveNeighbourColors.push(cells[i-1][j+1]);
            }
            if(j<col-1 && cells[i][j+1] != defaultColor){
                alive++;
                aliveNeighbourColors.push(cells[i][j+1]);
            }
            if(i<row-1 && j<col-1 && cells[i+1][j+1] != defaultColor){
                alive++;
                aliveNeighbourColors.push(cells[i+1][j+1]);
            }

            nextGen[i][j] = defaultColor;
            if(status == 'alive' && (alive == 2 || alive == 3))
                nextGen[i][j] = cells[i][j];
            if(status == 'dead' && alive == 3)
                nextGen[i][j] = getColor(aliveNeighbourColors);
        }
    }
    cells = nextGen;
}

// Gets average color for the next generation cell resulted from reproduction
function getColor(colors){
    var r = 0, g = 0, b = 0;
    for(var i=0; i<3; i++){
        var color = colors[i];
        color = color.split(")");
        color = color[0].split("(");
        color = color[1].split(",");
        r += parseInt(color[0]);
        g += parseInt(color[1]);
        b += parseInt(color[2]);
    }
    r = r/3;
    g = g/3;
    b = b/3;
    var color = "rgb(" + r + "," + g + "," + b + ")";
    return color;
}

server.listen(8080);
