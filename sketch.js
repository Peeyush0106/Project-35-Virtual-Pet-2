// Global Variables in our game
var dog_norm, dog_hap, dog, database, food_stock, gameState, gameText, resetDogMoodTimer, counter, pet_hungry_text, pet_satis_text, max_pet_satis_time, inputNam, butto, greeting, txt1, txt2 /*, txt3*/, txt4, txt5, txt6, txt7, feed_button, buy_button, start_text, money, temp_food_stock, foodObj, showImageNearDog, money_initialized, food_initialized, newAccount, fedTime, lastFed, meridian, minuteTime, hourTime;

function setup() {
    var canvas = createCanvas(700, 500);
    canvas.position(-350, -50);
    money_initialized = false;
    food_initialized = false;
    food_stock = 20;
    money = 30;
    meridian = "";
    database = firebase.database();
    // "15 * 30" means 15 seconds. 30 is the universal framerate
    max_pet_satis_time = 20 * 30;
    gameState = "solving-form";
    gameText = pet_hungry_text;
    counter = max_pet_satis_time;
    foodObj = new Food();
    showImageNearDog = false;
    inputName = createInput("Your pet").attribute("place-holder", "Name").size(80).attribute("maxlength", 10).position(250, 15).style("background-color", "yellow");
    feed_button = createButton("Feed Milk").hide().position(240, 397.5).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock > 0 && gameState === "hungry") {
            food_stock -= 1;
            gameState = "satis";
            gameText = pet_satis_text;
            foodObj.updateFoodStock(dog.name);
            showImageNearDog = true;
            foodObj.updateLastFed(petName);
            foodObj.updateFoodStock(dog.name);
            fedTime = (lastFed[0]) + ": " + lastFed[1] + " " + meridian;
            txt10.html("Last Feed Time: " + fedTime);
        }
    });
    buy_button = createButton("Buy Food").hide().position(325, 397.5).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock < 19 && money >= 6) {
            money -= 6;
            updateMoney(dog.name);
            food_stock += 2;
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
        dog = new Sprite(320, 260, 100, 100, "images/Dog.png", "images/happydog.png", 1, petName);
        getMoney(petName);
        temp_food_stock = foodObj.getFoodStock(petName);
        foodObj.getLastFed(petName);
    });
    txt1 = createElement('h2').position(20, 410).style("color", "black").style("background-color", "orange");
    txt2 = createElement('h2').position(20, 440).style("color", "black").style("background-color", "orange");
    // txt3 = createElement('h2').position(20, 450).style("color", "black").style("background-color", "red");
    txt4 = createElement('h2').position(10, 440).style("color", "black").style("background-color", "orange");
    txt5 = createElement('h2').position(50, 60).style("color", "blue").html("Food Left: " + food_stock).hide();
    txt6 = createElement('h2').position(50, 95).style("color", "orange").html(petName + " will be hungry again in: " + resetDogMoodTimer + " seconds").hide();
    txt7 = createElement('h3').position(160, 135).style("color", "orange").html("You have " + Math.round(money) + " $ as cash to buy food").hide();
    txt8 = createElement('h3').position(160, 155).style("color", "orange").html("You're earning. One bottle for 3 $").hide();
    txt9 = createElement('h4').position(90, 175).style("color", "orange").html("You can Buy food when your stock is less than 18").hide();
    txt10 = createElement('h4').position(475, 133).style("color", "orange").html("Last Feed Time: " + fedTime).hide();
    dog = new Sprite(320, 260, 100, 100, "images/Dog.png", "images/happydog.png", 1, petName);
}

function draw() {
    background(46, 139, 87);
    if (food_stock > 20) {
        food_stock = 20;
        foodObj.foodStock = food_stock;
    }
    if (food_stock <= 19 || gameState === "solving-form") {
        buy_button.hide();
    }
    if (food_stock < 19 && gameState !== "solving-form") {
        buy_button.show();
    }
    if (showImageNearDog) {
        push();
        angleMode(RADIANS);
        translate(dog.sprite.x - 45, dog.sprite.y);
        rotate(120);
        image(foodObj.image, 0, 0, 44, 44);
        // More than 10 seconds
        if (resetDogMoodTimer <= 15) {
            showImageNearDog = false;
        }
        pop();
    }
    if (food_initialized && money_initialized) {
        foodObj.display();
        // 1 second.
        if (resetDogMoodTimer <= 1) {
            txt6.html(inputName.value() + " will be hungry again in: " + resetDogMoodTimer + " second").hide();
        }
        else {
            txt6.html(inputName.value() + " will be hungry again in: " + resetDogMoodTimer + " seconds");
        }
        if (gameState !== "solving-form") {
            money += 0.005;
        }
        if (Math.round(money % 1) === 0) {
            updateMoney(dog.name);
        }
        txt5.html("Food Left: " + food_stock);
        if (gameState !== "solving-form") {
            txt7.html("You have " + Math.round(money) + " $ as cash to buy food");
            txt7.show();
            txt8.show();
            txt9.show();
            txt10.show();
            resetDogMoodTimer = Math.round(counter / 30);
            imageMode(CENTER);
            push();
            stroke("yellow");
            strokeWeight(3);
            // Right
            line(600 + (dog.width / 2), 200 - (dog.height / 2), 600 + (dog.width / 2), 370 + (dog.height / 2));
            // Left
            line(100 - (dog.width / 2), 200 - (dog.height / 2), 100 - (dog.width / 2), 370 + (dog.height / 2));
            // Midle
            line(400 + (dog.width / 2), 200 - (dog.height / 2), 400 + (dog.width / 2), 370 + (dog.height / 2));
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
            }
            else {
                push();
                textSize(25);
                fill("yellow");
                if (resetDogMoodTimer > 15) {
                    txt4.html("Your pet is drinking milk. Wait for it.");
                }
                else {
                    txt4.html(gameText);
                }
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
                    if (mouseX < 400 && mouseX > 100 && mouseY < 350 && mouseY > 245) {
                        if (resetDogMoodTimer <= 15) {
                            dog.x = mouseX;
                            dog.y = mouseY;
                        }
                    }
                }
                else {
                    gameState = "hungry";
                    counter = max_pet_satis_time;
                }
            }
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
    else if (gameState !== "solving-form") {
        push();
        fill("red");
        textSize(30);
        text("We are Loading and Saving your's and " + dog.name + "'s details...", 10, 200, 490, 500);
        pop();
    }
}

function getMoney(dogName) {
    database.ref("Dogs/" + dogName + "/Owner/cash").get().then(function (data) {
        if (data.exists()) {
            money = data.val();
        }
        else {
            updateMoney(dog.name);
        }
        money_initialized = true;
    }).catch(function (error) {
        console.error(error);
    });
}

function updateMoney(dogName) {
    var my_round_off_money = Math.round(money);
    database.ref("Dogs/" + dogName + "/Owner").update({
        cash: my_round_off_money
    });
}