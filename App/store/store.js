import {applyMiddleware, combineReducers, createStore} from 'redux';
import {authReducer} from './auth/reducer';
import {commonReducer} from './common/reducer';
import thunkMiddleware from 'redux-thunk';

const rootReducer = combineReducers({
  auth: authReducer,
  common: commonReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
