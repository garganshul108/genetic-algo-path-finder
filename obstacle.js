function Obstacle(x1, y1, x2, y2) {

    this.x1 = min(x1, x2);
    this.y1 = min(y1, y2);
    this.x2 = max(x1, x2);
    this.y2 = max(y1, y2);


    this.draw = () => {
        push();
        fill('red');
        rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
        pop();
    }

    this.hitBy = (p) => {
        return (this.x1 <= p.x && p.x <= this.x2 && this.y1 <= p.y && p.y <= this.y2);
    }
}