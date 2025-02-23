import { GameTree, CFRPlus } from './cfr_plus.js';
import CoinPokerVision from '../vision/coinpoker_vision.js';
import CoinPokerInput from './coinpoker_input.js';

class AutoPlayer {
  constructor(vision, connector, gameConfig) {
    this.vision = vision;
    this.connector = connector;
    this.gameTree = new GameTree(gameConfig);
    this.strategy = CFRPlus.loadStrategy('strategies/merged.npz'); // Adjust path as needed
    this.coinPokerVision = new CoinPokerVision();
    this.coinPokerInput = new CoinPokerInput();
  }

  decideAction(state) {
    const infoset = this.createInfoset(state);
    const node = this.gameTree.get_node(infoset);
    const strategy = node.getStrategy();

    let actionIndex = 0;
    if (strategy && strategy.length > 0) {
      // Use strategy to pick action
      let rand = Math.random();
      let cumulativeProbability = 0;
      for (let i = 0; i < strategy.length; i++) {
        cumulativeProbability += strategy[i];
        if (rand < cumulativeProbability) {
          actionIndex = i;
          break;
        }
      }
    } else {
      // If strategy is not available, pick a random action
      actionIndex = Math.floor(Math.random() * this.gameTree.config.actions.length);
    }

    const action = this.gameTree.config.actions[actionIndex];
    this.executeAction(action);
    return action;
  }

  executeAction(action) {
    // Convert the action to UI coordinates and click the button
    const actionCoordinates = this.getActionCoordinates(action);
    this.coinPokerInput.clickButton(actionCoordinates.x, actionCoordinates.y);
  }

  getActionCoordinates(action) {
    // Placeholder: Map actions to screen coordinates based on config
    console.log(`Getting coordinates for action: ${action}`);
    return { x: 100, y: 200 }; // Replace with actual coordinates
  }

  createInfoset(state) {
    return `${state.holeCards.join(',')}|${state.communityCards.join(',')}|${state.pot}`;
  }
}

export default AutoPlayer;
