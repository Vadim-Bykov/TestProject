import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {authReducer} from './auth/reducer';
import {commonReducer} from './common/reducer';
import thunkMiddleware from 'redux-thunk';

const rootReducer = combineReducers({
  auth: authReducer,
  common: commonReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

export default store;
