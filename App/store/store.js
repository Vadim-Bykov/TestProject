import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {authReducer} from './auth/reducer';
import {commonReducer} from './common/reducer';
import thunkMiddleware from 'redux-thunk';
import {mediaReducer} from './media/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  common: commonReducer,
  media: mediaReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

export default store;
