const socket = io.connect('http://localhost:4000');

var room="room2";
    socket.emit("join_room", room);


    var data={"room":'client',
    "x":"30",
    "y":"30"
    }
    socket.emit("coordinates", data);



// function showCoords(event) {
//     var x = event.clientX;
//     var y = event.clientY;
//     var coords = "X coords: " + x + ", Y coords: " + y;

//     var d = document.getElementById('yourDivId');
//     d.style.position = "absolute";
//     d.style.left = x+'px';
//     d.style.top = y+'px';
//     console.log(coords)
//   }

socket.on('coordinates',function(data){
    console.log(data)
})

socket.on('code',function(data){
    console.log(data)
})