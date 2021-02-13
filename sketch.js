// Global Variables in our game
var dog_norm, dog_hap, dog, database, food_stock, playerCount, playerCount_data, gameState, gameText, resetDogMoodTimer, counter, pet_hungry_text, pet_satis_text, max_pet_satis_time, inputNam, butto, greeting, txt1, txt2 /*, txt3*/, txt4, txt5, txt6, txt7, feed_button, buy_button, start_text, money, temp_food_stock;

function setup() {
    var canvas = createCanvas(700, 500);
    canvas.position(-350, -50);
    food_stock = 20;
    playerCount = 0;
    money = 30;
    database = firebase.database();
    playerCount_data = database.ref("PlayerDat/Count").on("value", function (data) {
        playerCount = data.val();
    });
    // "15 * 30" means 15 seconds. 30 is the universal framerate
    max_pet_satis_time = 15 * 30;
    gameState = "solving-form";
    gameText = pet_hungry_text;
    counter = max_pet_satis_time;
    inputName = createInput("Your pet").attribute("place-holder", "Name").size(80).attribute("maxlength", 10).position(250, 15).style("background-color", "yellow");
    feed_button = createButton("Feed Milk").hide().position(340, 397.5).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock > 0 && gameState === "hungry") {
            food_stock -= 1;
            gameState = "satis";
            gameText = pet_satis_text;
            updateFoodStockCount(dog.name);
        }
    });
    buy_button = createButton("Buy Food").hide().position(425, 397.5).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock < 20 && money >= 6) {
            money -= 6;
            food_stock += 2;
            updateFoodStockCount(dog.name);
        }
    });

    var petName = inputName.value();
    start_text = createElement('h2').position(50, -10).html("Your pet's name: ");
    button = createButton("Play").position(340, 15).style("background-color", "blue").style("color", "white").mousePressed(function () {
        inputName.hide();
        button.hide();
        start_text.hide();
        petName = inputName.value();
        greeting = createElement('h3').html("Your virtual pet '" + petName + "' is waiting for you.").position(40, -10).hide();
        gameState = "hungry";
        pet_hungry_text = [(petName + "'s hungry."), ("Press the button above to feed it")];
        pet_satis_text = "You've fed " + petName + "! Get it on a walk using your mouse";
        dog = new Sprite(200, 200, 100, 100, "images/Dog.png", "images/happydog.png", 1, petName);
        temp_food_stock = getFoodStockCount(petName);
        // if(temp_food_stock == null) {
        //     updateFoodStockCount(dog.name);
        // } else {
        //     food_stock = temp_food_stock;
        // }
    });
    txt1 = createElement('h2').position(20, 410).style("color", "black").style("background-color", "orange");
    txt2 = createElement('h2').position(20, 440).style("color", "black").style("background-color", "orange");
    // txt3 = createElement('h2').position(20, 450).style("color", "black").style("background-color", "red");
    txt4 = createElement('h2').position(10, 440).style("color", "black").style("background-color", "orange");
    txt5 = createElement('h2').position(50, 60).style("color", "blue").html("Food Left: " + food_stock).hide();
    txt6 = createElement('h2').position(50, 95).style("color", "orange").html(petName + " will be hungry again in: " + resetDogMoodTimer + " seconds").hide();
    txt7 = createElement('h3').position(360, 135).style("color", "orange").html("You have " + Math.round(money) + " $ as cash to buy food").hide();
    txt8 = createElement('h3').position(360, 165).style("color", "orange").html("You are earning").hide();
    dog = new Sprite(200, 200, 100, 100, "images/Dog.png", "images/happydog.png", 1, petName);
    updatePlayerCount();
}

function draw() {    
    if (playerCount_data !== undefined) {
        background(46, 139, 87);
        // 1 second.
        if (resetDogMoodTimer <= 1) {
            txt6.html(inputName.value() + " will be hungry again in: " + resetDogMoodTimer + " second").hide();
        }
        else {
            txt6.html(inputName.value() + " will be hungry again in: " + resetDogMoodTimer + " seconds");
        }
        money += 0.0057;
        txt5.html("Food Left: " + food_stock);
        if (gameState !== "solving-form") {
            txt7.html("You have " + Math.round(money) + " $ as cash to buy food");
            txt7.show();
            txt8.show();
            resetDogMoodTimer = Math.round(counter / 30);
            imageMode(CENTER);
            push();
            stroke("yellow");
            strokeWeight(3);
            // Right
            line(600 + (dog.width / 2), 200 - (dog.height / 2), 600 + (dog.width / 2), 370 + (dog.height / 2));
            // Left
            line(100 - (dog.width / 2), 200 - (dog.height / 2), 100 - (dog.width / 2), 370 + (dog.height / 2));
            // Up
            line(100 - (dog.width / 2), 200 - (dog.height / 2), 600 + (dog.width / 2), 200 - (dog.height / 2));
            // Down
            line(600 + (dog.width / 2), 370 + (dog.height / 2), 100 - (dog.width / 2), 370 + (dog.height / 2));
            pop();
            txt5.show();
            if (gameState === "hungry") {
                dog.changePicture(dog.image1);
                greeting.show();
                gameText = [pet_hungry_text[0], pet_hungry_text[1]];
                push();
                fill("yellow");
                textSize(17.5);
                txt1.html(gameText[0]);
                txt2.html(gameText[1].slice(0, 43));
                // txt3.html(gameText[1].slice(0, 33));
                txt4.html("");
                pop();
                feed_button.show();
                buy_button.show();
            }
            else {
                push();
                textSize(25);
                fill("yellow");
                txt4.html(gameText);
                pop();
                feed_button.hide();
                txt1.html("");
                txt2.html("");
                // txt3.html("");
                greeting.hide();
            }
            if (gameState === "satis") {
                dog.changePicture(dog.image2);
                if (resetDogMoodTimer > 0) {
                    counter -= 1;
                    if (mouseX < 600 && mouseX > 100 && mouseY < 370 && mouseY > 200) {
                        dog.sprite.x = mouseX;
                        dog.sprite.y = mouseY;
                    }
                }
                else {
                    gameState = "hungry";
                    counter = max_pet_satis_time;
                }
            }
            // updateFoodStockCount();
            // updateName();
            if (resetDogMoodTimer <= 15 && gameState === "satis") {
                push();
                txt6.show();
                pop();
            }
            else {
                txt6.hide();
            }
            if (food_stock === 0) {
                txt1.hide();
                txt2.hide();
                // txt3.hide();
                txt4.hide();
                txt5.hide();
                txt6.hide();
            }
        }
        dog.display();
    }
}

function updatePlayerCount() {
    playerCount += 1;
    database.ref("PlayerDat").update({
        Count: playerCount
    });
}

function updateFoodStockCount(dogName) {
    database.ref("Dogs/"+dogName).update({
        food: food_stock
    });
}

function getFoodStockCount(dogName) {

    // stock_data = database.ref("Dogs/"+dogName+"/food");
    // stock_data.on("value", function (data) {
    //     temp_food_stock = data.val();
    // });

    database.ref("Dogs/"+dogName+"/food").get().then(function(snapshot) {
        if (snapshot.exists()) {
          food_stock = snapshot.val();
        }
        else {
          updateFoodStockCount(dog.name);          
        }
      }).catch(function(error) {
        console.error(error);
      });

    //return database.ref("Dogs/"+dogName+"/food");
}

// function updateName() {
//     var player = "player" + playerCount;
//     var resource = database.ref("PlayerDat");
//     // var id = player;
//     resource.update({
//         Name: player
//     });
// }

function updateName() {
    var playerIndex = "Player" + playerCount;
    name_of_row = "Name" + playerCount
    database.ref("PlayerDat").update({
        name_of_row: playerIndex
    });
}