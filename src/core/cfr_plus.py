import numpy as np
from numba import jit
import json
from typing import Dict, List

class CFRPlus:
    def __init__(self, actions: int):
        self.regret = np.zeros(actions, dtype=np.float32)
        self.strategy_sum = np.zeros(actions, dtype=np.float32)
        self.actions = actions
        
    @jit(nopython=True, nogil=True)
    def _update_regret(self, regret: np.ndarray, utility: np.ndarray, strategy: np.ndarray) -> None:
        regret += utility - np.dot(strategy, utility)
        
    def update(self, iteration: int, utilities: np.ndarray) -> np.ndarray:
        strategy = self.get_strategy()
        self._update_regret(self.regret, utilities, strategy)
        self.strategy_sum += strategy * iteration
        return strategy
        
    @jit(nopython=True)
    def get_strategy(self) -> np.ndarray:
        pos_regret = np.maximum(self.regret, 0)
        normalizer = np.sum(pos_regret)
        return pos_regret / normalizer if normalizer > 0 else np.ones(self.actions) / self.actions
        
    def save_strategy(self, filepath: str) -> None:
        np.savez_compressed(filepath, strategy=self.strategy_sum)
        
    @classmethod
    def load_strategy(cls, filepath: str) -> 'CFRPlus':
        data = np.load(filepath)
        instance = cls(data['strategy'].shape[0])
        instance.strategy_sum = data['strategy']
        return instance

class GameTree:
    def __init__(self, config_path: str):
        with open(config_path) as f:
            self.config = json.load(f)
        self.nodes = {}
        
    def get_node(self, infoset: str) -> CFRPlus:
        if infoset not in self.nodes:
            self.nodes[infoset] = CFRPlus(len(self.config['actions']))
        return self.nodes[infoset]
