function Particle(r, x, y, l, options) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.lifeSpan = l;
    this.options = options || {};
    this.velSeq = [];
    this.velIndex = 0;
    this.dead = false;
    this.fitness = 0;
    this.hitWall = false;


    for (let i = 0; i < this.lifeSpan; i++) {
        let vr = random(0, 35);
        let vx = random(-1, 1) * vr;
        let vy = random(-1, 1) * vr;
        this.velSeq.push({ vx, vy });
    }

    this.color = this.options.color || 255;

    this.move = () => {
        if (this.velIndex >= this.lifeSpan) {
            this.x += 0;
            this.y += 0;
            this.dead = true;
        }

        if (!this.dead) {
            this.x += this.velSeq[this.velIndex].vx;
            this.y += this.velSeq[this.velIndex].vy;
            this.velIndex++;
        }

    }

    this.injectNewLifeSpan = (span) => {
        this.lifeSpan = span.length;
        this.velSeq = [...span];
    }

    this.addLifeSpan = (span) => {
        this.lifeSpan += span.length;
        this.velSeq = [...this.velSeq, ...span];
    }



    this.draw = () => {
        push();
        noStroke();
        // console.log(this.color);
        fill(this.color, 50);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
        pop();
    }

    this.constraint = (w, h) => {
        if (this.x >= w - this.r) {
            this.x = w - this.r;
        } else if (this.x <= this.r) {
            this.x = this.r;
        }
        if (this.y >= h - this.r) {
            this.y = h - this.r;
        } else if (this.y <= this.r) {
            this.y = this.r;
        }
    }


}