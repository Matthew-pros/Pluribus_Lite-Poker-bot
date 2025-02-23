import numpy as np
from numba import jit

class MonteCarloCFR:
    def __init__(self, actions, discount=0.9):
        self.regret = np.zeros(actions)
        self.strategy_sum = np.zeros(actions)
        self.discount = discount
        self.strategy = np.ones(actions) / actions  # Initialize strategy

    @jit(nopython=True)
    def _update_node(self, reach_prob, utilities):
        regret = utilities - np.dot(self.strategy, utilities)
        self.regret += reach_prob * regret
        self.regret *= self.discount  # Pluribus' decay factor

    def sample_episode(self, num_players=6):
        # Pluribus' opponent randomization
        virtual_players = np.random.permutation(num_players - 1)[:2]
        return self._traverse(virtual_players, 1.0, np.zeros(len(self.strategy)))  # Start with full reach probability and zero utility

    @jit(nopython=True)
    def _traverse(self, players, reach_prob, utilities):
        # Depth-limited traversal with 3-player abstraction (simplified)
        if np.random.rand() < 0.1: # Terminal state reached with 10% probability
            self._update_node(reach_prob, utilities + np.random.randn(len(self.strategy))) # add random utility at terminal state
            return
        
        action = np.random.choice(len(self.strategy), p=self.strategy)
        new_utilities = utilities.copy()
        new_utilities[action] += 1 # simplified utility update
        
        self._traverse(players, reach_prob * self.strategy[action], new_utilities)

        # Update strategy after traversal
        pos_regret = np.maximum(self.regret, 0)
        normalizer = np.sum(pos_regret)
        if normalizer > 0:
            self.strategy = pos_regret / normalizer
        else:
            self.strategy = np.ones(len(self.strategy)) / len(self.strategy)
