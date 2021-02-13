class Sprite {
    constructor(x, y, width, height, picture1, picture2, choose_pic, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.width = width;
        this.height = height;
        this.sprite = createSprite(this.x, this.y, this.width, this.height);
        this.image1 = loadImage(picture1);
        this.image2 = loadImage(picture2);
        if(choose_pic == 1) {
            this.image = this.image1;
        } else {
            this.image = this.image2;
        }
    }
    changePicture(picture) {
        this.image = picture;
    }
    display() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.x = this.sprite.x;
        this.y = this.sprite.y;
        image(this.image, this.x, this.y, this.width, this.height);
    }
}