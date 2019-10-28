
let width = 1000;
let height = 700;

let particles = [];

let population = 10000;
let particleR = 5;

let target;

let gen = 1;

let isAlive = [];

let obstacles = [];

function setup() {

    createCanvas(width, height);
    target = new Target(100, width - 200, height / 2);

    for (let i = 0; i < population; i++) {
        let ls = floor(random(100, 300));
        particles.push(new Particle(particleR, particleR * 2, height / 2, ls))
        isAlive.push(true);
    }

    // obstacles.push(new Obstacle(100, 0, 140, 500));
    // obstacles.push(new Obstacle(250, 700, 290, 200));
    // obstacles.push(new Obstacle(400, 0, 440, 500));
    // obstacles.push(new Obstacle(570, 700, 610, 200));


    background(color(50, 12, 210));
    for (let o of obstacles) {
        o.draw();
    }
    target.draw();


}

function calculateFitness(p) {
    let maxd = dist(particleR * 2, height / 2, width - 200, height / 2) * (target.x - particleR * 2);
    let d = dist(target.x, target.y, p.x, p.y);
    d = d - p.r - target.r;
    if (d < 0) d = 0;
    d = d * abs(target.x - p.x);
    p.fitness = map(d, 0, maxd, 100, 0);
}


function mutation() {
    for (let p of particles) {
        let mR = random(0, 1);
        if (mR < 0.4) {
            let n = floor(random(20, 500));
            let augLS = [];
            for (let i = 0; i < n; i++) {
                let vr = random(0, 35);
                let vx = random(-1, 1) * vr;
                let vy = random(-1, 1) * vr;
                augLS.push({ vx, vy });
            }

            p.addLifeSpan(augLS);
        }
    }
}

function mutationLevel2() {
    for (let p of particles) {
        let mR = random(0, 1);
        if (mR < 0.2) {
            let i = floor(random(0, p.velSeq.length));
            let vr = random(0, 35);
            let vx = random(-1, 1) * vr;
            let vy = random(-1, 1) * vr;
            p.velSeq[i] = { vx, vy };
        }
    }
}

function nextPopulation() {
    background(color(50, 12, 210));
    for (let o of obstacles) {
        o.draw();
    }
    target.draw();

    let maxFit = 0;
    let avFit = 0;
    for (let p of particles) {
        if (!p.hitWall) {
            calculateFitness(p);
            maxFit = max(p.fitness, maxFit);
            avFit = avFit + p.fitness;
        }
    }

    console.log("maxFit", maxFit);
    console.log("avFit", avFit / population);

    particles.sort((a, b) => {
        return a.fitness > b.fitness;
    });
    let f = 1.0 / 100.0;
    particles = particles.slice(0, floor(f * population));
    let newParticlesCount = population - particles.length;
    for (let p of particles) {
        if (p.dead) {
            p.x = particleR * 2;
            p.y = height / 2;
            p.velIndex = 0;
            p.dead = false;
            p.hitWall = false;
        }
        p.color = floor(map(p.fitness, 0, maxFit, 50, 255));
    }

    for (let i = 0; i < newParticlesCount; i++) {
        let r1 = random(0, population * population * f * f);
        let index1 = max(floor(population * f - pow(r1, 0.5)), 0);
        let r2 = random(0, population * population * f * f);
        let index2 = max(floor(population * f - pow(r2, 0.5)), 0);


        let np = new Particle(particleR, particleR * 2, height / 2, 10);
        np.injectNewLifeSpan([...particles[index1].velSeq.slice(0, particles[index1].lifeSpan / 2), ...particles[index2].velSeq.slice(particles[index2].lifeSpan / 2 - 1, particles[index2].lifeSpan - 1)]);
        np.color = color(232, 195, 100, 10);
        particles.push(np);
    }



    for (let i = 0; i < population; i++) {
        isAlive[i] = true;
    }

    mutation();
    mutationLevel2();

}

function allDead() {
    for (let i = 0; i < population; i++) {
        if (isAlive[i]) return false;
    }

    return true;
}

function draw() {



    for (let i = 0; i < population; i++) {
        particles[i].move();
        particles[i].constraint(width, height);
        particles[i].draw();
        if (particles[i].dead) isAlive[i] = false;
    }


    for (let o of obstacles) {
        for (let i = 0; i < particles.length; i++) {
            if (o.hitBy(particles[i])) {
                // console.log("hit");
                particles[i].dead = true;
                particles[i].hitWall = true;
                particles[i].fitness = 0;
                isAlive[i] = false;
            }
        }
    }

    if (allDead()) {
        console.log("all dead", gen);
        nextPopulation();
        gen++;
    }
}