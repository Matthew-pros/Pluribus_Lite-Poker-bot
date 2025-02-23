//decision_engine.py translated to js
import numpy as np;

class GTOEngine {
    constructor(tree) {
        this.tree = tree;
        this.currentStrategy = {};
    }

    _cfrUtility(reachProb, actionUtil) {
        return reachProb * (actionUtil - np.sum(reachProb * actionUtil));
    }

    computeAction(infoset) {
        const strategies = this.tree.getStrategy(infoset);
        const randomNumber = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < strategies.length; i++) {
            cumulativeProbability += strategies[i];
            if (randomNumber < cumulativeProbability) {
                return i;
            }
        }
        return strategies.length -1;
    }

    updateStrategy(infoset, regretDelta) {
        let node = this.tree.nodes[infoset];
        if(!node) {
            node = {regret: [], strategy: []};
            this.tree.nodes[infoset] = node;
        }
        node.regret = node.regret.map((r, i) => r + regretDelta[i]);
        node.strategy = this._normalize(node.regret);
    }

    _normalize(arr) {
        const pos = arr.map(x => Math.max(x, 0));
        const total = np.sum(pos);
        return total > 0 ? pos.map(x => x / total) : pos.map( _ => 1 / pos.length);
    }
}

module.exports = GTOEngine;
