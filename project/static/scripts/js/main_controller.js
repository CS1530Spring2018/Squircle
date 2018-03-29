

var drone = new ScaleDrone('JX2gIREeJoi7FDzN');

var curr_room = document.currentScript.getAttribute('room');

drone.on('open', function (error) {
  if (error) {
    return console.error(error);
  }
  var room = drone.subscribe(curr_room);
  room.on('open', function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log('Connected to room');
    }
  });
});

function tapFunction(){
    //alert("Doing something for a tap");

    drone.publish({
    room: curr_room,
    message: { "log" : "tapFunction"
    }

    });
}//tapFunction

function doubleTapFunction(){

  drone.publish({
  room: curr_room,
  message: { "log" : "doubleTapFunction"
  }

  });
}//doubleTapFunction

function swipeRFunction(){
  drone.publish({
  room: curr_room,
  message: { "log" : "swipeRFunction"
  }

  });
}//swipeRFunction

function swipeLFunction(){
  drone.publish({
  room: curr_room,
  message: { "log" : "swipeLFunction"
  }

  });
}//swipeLFunction

function swipeDFunction(){
  drone.publish({
  room: curr_room,
  message: { "log" : "swipeDFunction"
  }

  });
}//swipeDFunction

function swipeUFunction(){
  drone.publish({
  room: curr_room,
  message: { "log" : "swipeUFunction"
  }

  });
}//swipeUFunction
var timer = 0;
function touchStart(){
  if (timer == 0){
    console.log("here");
    var sendDig = getDigDirection();
    drone.publish({
    room: curr_room,
    message: sendDig
    });
    timer = 5;
  } else {
    timer --;
  }

}//touchStart

function touchEnd(){
    console.log("here");
    var sendDig =  {'xdig': 0, 'ydig': 0};
    drone.publish({
      room: curr_room,
      message: sendDig
    });
}

var tier2=0;
function touchMove(){
if (tier2 == 0){
        var sendAnal = getDigDirection();
        drone.publish({
        room: curr_room,
        message: sendAnal

      });
      tier2 = 5;
      
    } else {
        tier2 --;
      }
}//touchMove
//setInterval(doStuff, 100);

function doStuff(){
    var sendAnal = {'xdig': 0, 'ydig': 0};
    drone.publish({
        room: curr_room,
          message: sendAnal

          });
}//doStuff
function setup() {
	var controller = myjoystick (tapFunction, doubleTapFunction, swipeRFunction, swipeLFunction, swipeUFunction, swipeDFunction, touchStart, touchMove, touchEnd);
}
window.addEventListener("load", setup, true);
