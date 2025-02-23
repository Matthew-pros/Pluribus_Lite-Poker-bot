import ray
from typing import Dict, List
from src.core import CFRPlus, GameTree

@ray.remote(num_gpus=0.5)
class SelfPlayWorker:
    def __init__(self, tree_config: str):
        self.tree = GameTree(tree_config)
        self.current_strategy = {}
        
    def iterate(self, iterations: int) -> Dict:
        for _ in range(iterations):
            self.run_cfr()
        return self.tree.nodes
        
    def run_cfr(self) -> None:
        # Recursive CFR implementation
        pass

class TrainingCoordinator:
    def __init__(self, num_workers: int = 4):
        ray.init()
        self.workers = [SelfPlayWorker.remote() for _ in range(num_workers)]
        
    def train(self, total_iterations: int):
        iterations_per = total_iterations // len(self.workers)
        futures = [w.iterate.remote(iterations_per) for w in self.workers]
        results = ray.get(futures)
        self.merge_strategies(results)
        
    def merge_strategies(self, node_sets: List[Dict]) -> None:
        merged = {}
        for nodes in node_sets:
            for infoset, node in nodes.items():
                if infoset not in merged:
                    merged[infoset] = node
                else:
                    merged[infoset].strategy_sum += node.strategy_sum
        CFRPlus.save_strategy(merged, "strategies/merged.npz")
