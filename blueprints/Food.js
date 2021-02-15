class Food {
    constructor() {
        this.image = loadImage("images/milk.png");
        this.foodStock = food_stock;
        this.lastFed;
    }
    display() {
        var initial_y = 140;
        var initial_x = 460;
        var x_increment = 30;
        var y = initial_y;
        var x = initial_x;
        for (var i = 0; i < food_stock; i++) {
            y += 40;
            image(this.image, x, y, 44, 44);
            if (i === 4) {
                y = initial_y;
                x += x_increment;
            }
            else if (i === 9) {
                y = initial_y;
                x += x_increment;
            }
            else if (i === 14) {
                y = initial_y;
                x += x_increment;
            }
        }
    }
    updateFoodStock(dogName) {
        database.ref("Dogs/" + dogName).update({
            food: food_stock
        });
    }
    getFoodStock(dogName) {
        var obj = this;
        database.ref("Dogs/" + dogName + "/food").get().then(function (data) {
            if (data.exists()) {
                food_stock = data.val();
                // newAccount = false;
            }
            else {
                // newAccount = true;
                obj.updateFoodStock(dog.name);
            }
            food_initialized = true;
        }).catch(function (error) {
            console.error(error);
        });
    }
    updateLastFed(dogName) {
        minuteTime = minute();
        hourTime = hour();
        lastFed = [hourTime, minuteTime];
        if (hourTime >= 12) {
            meridian = "PM";
            lastFed = [hourTime - 12, minuteTime, meridian];
        }
        else {
            meridian = "AM";
            lastFed = [hourTime, minuteTime, meridian];
        }
        txt10.html("Last Feed Time: " + fedTime);
        database.ref("Dogs/" + dogName).update({
            lastFeedTime: lastFed
        });
    }
    getLastFed(dogName) {
        database.ref("Dogs/" + dogName + "/lastFeedTime").get().then(function (data) {
            if (data.exists()) {
                console.log("Last Feed Data Exists");
                lastFed = data.val();
                fedTime = (lastFed[0]) + ": " + lastFed[1] + " " + lastFed[2];
                txt10.html("Last Feed Time: " + fedTime);
            }
            else {
                console.log("Last Feed Data Does not Exist");
                database.ref("Dogs/" + dogName).update({
                    lastFeedTime: ""
                });
            }
        }).catch(function (error) {
            console.error(error);
        });
    }
}