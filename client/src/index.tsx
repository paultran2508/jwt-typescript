import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import JWTManager from './utils/jwt'
import { AuthContextProvider } from './contexts/ContextAuth';




const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include'
})
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JWTManager.getToken()
  console.log(token)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


ReactDOM.render(
  <ApolloProvider client={client}>

    <AuthContextProvider >

      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthContextProvider>
  </ApolloProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
