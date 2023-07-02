export enum Message {

  // ***** MAIN ROOM *****
  SEND_ROOM_DATA,
  UPDATE_PLAYER,
  UPDATE_PLAYER_NAME,
  READY_TO_CONNECT,
  VIDEO_CONNECTED,
  DISCONNECT_STREAM,
  STOP_SCREEN_SHARE,
  ADD_CHAT_MESSAGE,

  // ***** RAIN GAME *****  
  RAIN_GAME_USER_C,
  RAIN_GAME_USER_S,
  RAIN_GAME_START_C,
  RAIN_GAME_START_S,
  RAIN_GAME_WORD_C,
  RAIN_GAME_WORD_S, 
  RAIN_GAME_READY_C,
  RAIN_GAME_READY_S, 
  RAIN_GAME_HEART_C,
  RAIN_GAME_HEART_S,

  // ***** Brick Game *****
  // Client
  BRICK_GAME_COMMAND,
  BRICK_GAME_START,
  // Server
  BRICK_GAME_PLAYERS,
  BRICK_GAME_STATE,
  BRICK_GAME_ERROR,
  BRICK_PLAYER_UPDATE,
  
  // ***** MOLE GAME *****
  SEND_MOLE,
  RECEIVE_MOLE,
  SEND_MY_POINT,
  RECEIVE_YOUR_POINT,
  REQUEST_MOLE,
  RESPONSE_MOLE,
  SEND_HOST,
  RECEIVE_HOST,
  SEND_LIFE,
  RECEIVE_LIFE,

  // ***** NOT USED *****
  // CONNECT_TO_MOLEGAME,
  // DISCONNECT_FROM_MOLEGAME,
  // CONNECT_TO_BRICKGAME,
  // DISCONNECT_FROM_BRICKGAME,
  // CONNECT_TO_TYPINGGAME,
  // DISCONNECT_FROM_TYPINGGAME,  
  // DISABLE_GAME_PLAYER,
  // REACTIVATE_GAME_PLAYER,
}
