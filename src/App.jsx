import React, { useState, useEffect } from 'react';
import CoinPokerConnector from './api/coinpoker_connector';
import PokerVisionSystem from './vision/poker_vision';
import AutoPlayer from './core/auto_player';
import gameConfig from '../config/game_config.json';
import coinpokerConfig from '../config/coinpoker.yaml';

function App() {
  const [gameState, setGameState] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    async function runAutoPlayer() {
      const vision = new PokerVisionSystem(coinpokerConfig);
      const connector = new CoinPokerConnector(coinpokerConfig.api.ws_endpoint);
      await connector.connect();
      const autoPlayer = new AutoPlayer(vision, connector, gameConfig);

      while (true) {
        const currentState = await connector.getTableState("your_table_id"); // Replace with actual table ID
        setGameState(currentState);
        const chosenAction = autoPlayer.decideAction(currentState);
        setAction(chosenAction);
        console.log("Action:", chosenAction);
        //await connector.executeAction(chosenAction); // Implement executeAction in CoinPokerConnector
        await new Promise(resolve => setTimeout(resolve, coinpokerConfig.anti_detection.delay));
      }
    }

    runAutoPlayer();
  }, []);

  return (
    
      <h1>CoinPoker AI</h1>
      {gameState ? (
        
          <h2>Game State</h2>
          <pre>{JSON.stringify(gameState, null, 2)}</pre>
          {action && (
            
              <h2>Action</h2>
              <p>{action}</p>
            
          )}
        
      ) : (
        
          Loading...
        
      )}
    
  );
}

export default App;
