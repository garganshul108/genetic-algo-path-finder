function Target(r, x, y, options) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.options = options || {};
    this.color = this.options.color || { r: 255, g: 255, b: 255 };

    this.draw = () => {
        push();
        noStroke();
        fill(this.color.r, this.color.g, this.color.b);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
        pop();
    }
}