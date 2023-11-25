// AppNavigator.js
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GameScreen from '../components/GameScreen';
import LobbyScreen from '../components/LobbyScreen';
import AuthScreen from '../components/AuthScreen';

const AppNavigator = createStackNavigator(
  {
    Lobby: LobbyScreen,
    Game: GameScreen,
    Auth: AuthScreen,
  },
  {
    initialRouteName: 'Auth',
  }
);

export default createAppContainer(AppNavigator);
