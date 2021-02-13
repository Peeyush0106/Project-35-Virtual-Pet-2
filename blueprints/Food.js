class Food {
    constructor() {
        this.image = loadImage("images/milk.png");
        this.foodStock;
        this.lastFed;
    }
    display() {
    }
    getFoodStock(dogName) {
        database.ref("Dogs/" + dogName + "/food").get().then(function (data) {
            if (data.exists()) {
                food_stock = data.val();
            }
            else {
                updateFoodStock(dog.name);
            }
        }).catch(function (error) {
            console.error(error);
        });
    }
    updateFoodStock(dogName) {
        database.ref("Dogs/" + dogName).update({
            food: food_stock
        });
    }
    getFoodStock(dogName) {
        database.ref("Dogs/" + dogName + "/food").get().then(function (data) {
            if (data.exists()) {
                food_stock = data.val();
            }
            else {
                updateFoodStock(dog.name);
            }
            food_initialized = true;
        }).catch(function (error) {
            console.error(error);
        });
    }
    getMoney(dogName) {
        database.ref("Dogs/" + dogName + "/Owner/cash").get().then(function (data) {
            if (data.exists()) {
                money = data.val();
                console.log("Get Money", money);
            }
            else {
                updateMoney(dog.name);
                console.log("updating money through get money");
            }
            money_initialized = true;
        }).catch(function (error) {
            console.error(error);
        });
    }
    updateMoney(dogName) {
        var my_round_off_money = Math.round(money);
        database.ref("Dogs/" + dogName + "/Owner").update({
            cash: my_round_off_money
        });
    }
}