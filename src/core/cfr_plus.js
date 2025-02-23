import { Random } from '../utils/random.js';

class CFRPlus {
  constructor(actions) {
    this.regret = new Array(actions).fill(0);
    this.strategySum = new Array(actions).fill(0);
    this.actions = actions;
    this.random = new Random('poker-ai'); // Seeded random number generator
  }

  update(iteration, utilities) {
    const strategy = this.getStrategy();
    for (let i = 0; i < this.actions; i++) {
      this.regret[i] += utilities[i] - strategy.reduce((sum, s, j) => sum + s * utilities[j], 0);
    }
    for (let i = 0; i < this.actions; i++) {
      this.strategySum[i] += strategy[i] * iteration;
    }
    return strategy;
  }

  getStrategy() {
    const posRegret = this.regret.map(r => Math.max(r, 0));
    const normalizer = posRegret.reduce((sum, r) => sum + r, 0);
    return normalizer > 0
      ? posRegret.map(r => r / normalizer)
      : new Array(this.actions).fill(1 / this.actions);
  }

    saveStrategy(filepath) {
        const fs = require('fs');
        fs.writeFileSync(filepath, JSON.stringify(this.strategySum));
    }
    
    static loadStrategy(filepath) {
        const fs = require('fs');
        try {
            const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
            const instance = new CFRPlus(data.length);
            instance.strategySum = data;
            return instance;
        } catch (e) {
            console.warn("Failed to load strategy, returning a blank one", e);
            return null;
        }
    }
}


class GameTree {
    constructor(config) {
        this.config = config;
        this.nodes = {};
    }

    get_node(infoset) {
        if (!(infoset in this.nodes)) {
            this.nodes[infoset] = new CFRPlus(this.config.actions.length);
        }
        return this.nodes[infoset];
    }
}

export { CFRPlus, GameTree };
