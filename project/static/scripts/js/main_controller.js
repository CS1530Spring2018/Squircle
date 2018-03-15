

var drone = new ScaleDrone('JX2gIREeJoi7FDzN');

drone.on('open', function (error) {
  if (error) {
    return console.error(error);
  }
  var room = drone.subscribe('my_game');
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
    room: "my_game",
    message: { "log" : "tapFunction"
    }

    });
}//tapFunction

function doubleTapFunction(){

  drone.publish({
  room: "my_game",
  message: { "log" : "doubleTapFunction"
  }

  });
}//doubleTapFunction

function swipeRFunction(){
  drone.publish({
  room: "my_game",
  message: { "log" : "swipeRFunction"
  }

  });
}//swipeRFunction

function swipeLFunction(){
  drone.publish({
  room: "my_game",
  message: { "log" : "swipeLFunction"
  }

  });
}//swipeLFunction

function swipeDFunction(){
  drone.publish({
  room: "my_game",
  message: { "log" : "swipeDFunction"
  }

  });
}//swipeDFunction

function swipeUFunction(){
  drone.publish({
  room: "my_game",
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
    room: "my_game",
    message: sendDig
    });
    timer = 5;
  } else {
    timer --;
  }



}//touchStart
var tier2=0;
function touchMove(){
if (tier2 == 0){
        var sendAnal = getDigDirection();
        drone.publish({
        room: "my_game",
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
        room: "my_game",
          message: sendAnal

          });
}//doStuff
function setup() {
	var controller = myjoystick (tapFunction, doubleTapFunction, swipeRFunction, swipeLFunction, swipeUFunction, swipeDFunction, touchStart, touchMove, touchStart);
}
window.addEventListener("load", setup, true);
