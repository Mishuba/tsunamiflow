AI Demo for TsunamiFlow frontend

Overview
- This demo shows the in-browser AI manager and simple agents.
- Files: `JS/TFN/T/aiGameManager.js`, `JS/TFN/T/Class/.../ai.js`, and `N/Games/sprite.js`.

How to run
1. Open `frontend/tsunamiflow/index.html` in a browser with devtools open.
2. Ensure the scripts are served (if using a local static server) or open the file directly.

Controls (floating panel on top-right)
- AI Start: resume AI ticks
- AI Stop: pause AI ticks
- AI Save: save agent Q-tables and model weights to `localStorage` key `ai_game_state`
- AI Load: restore from `localStorage` key `ai_game_state`
- ε - / ε +: decrease or increase exploration rate (epsilon)
- lr - / lr +: decrease or increase learning rate for the DQN model
- sync - / sync +: adjust the target-network synchronization interval

Notes
- The demo uses a lightweight `SimpleDQNModel` implemented in `ai.js`. It's suitable for small toy environments; for serious training use a proper ML backend.
- Epsilon decay and periodic target-network syncing are implemented in the current DQN agent for more stable online learning.
- Model serialization is a plain JSON snapshot of weights — compatibility isn't guaranteed across code changes.

Next steps
- Wire better UI for inspecting agent Q-values and model weights.
- Add per-agent parameter controls and training diagnostics.
