## type-graphql Subscriptions (Docs)

https://github.com/19majkel94/type-graphql/blob/master/docs/subscriptions.md

## type-graphql Subscriptions (Simple Example)

https://github.com/19majkel94/type-graphql/blob/master/examples/simple-subscriptions/resolver.ts

## type-graphql Subscriptions (redis-subscriptions Example)

https://github.com/19majkel94/type-graphql/tree/master/examples/redis-subscriptions

## Add Authentication to GraphQL Subscriptions

https://www.youtube.com/watch?v=EuaVr7vFF5E

## GraphQL Subscbriptions

https://www.apollographql.com/docs/apollo-server/features/subscriptions#middleware
https://github.com/apollographql/apollo-server/issues/1902

## context with GraphQL Subscriptions

From: https://github.com/apollographql/apollo-server/issues/2315#issuecomment-466130174

```javascript
  context: ({ req, connection }) => {
    if (connection) {
      return getContextFromSubscription(connection);
    }
    return getContextFromHttpRequest(req);
  },
```

where getContextFromHttpRequest could be a user defined function (likely with not such a lengthy name), like

```javascript
const getContextFromHttpRequest = ({ req }: { req: $Request }): Params => {
    const auth = req.get('authorization')
    const match = /^Bearer (.*)$/i.exec(auth || '')
    const authToken = match ? match[1] : null
    return {
      authToken,
      user: await getUserByToken(null, authToken)),
    }
  }
```

What do you think?



Earlier

```javascript
  getParamsFromRequest: ({ req }) => {
    const auth = req.get('authorization')
    const match = /^Bearer (.*)$/i.exec(auth || '')
    const authToken = match ? match[1] : null
    return { authToken }
  }
```

Would be...

```javascript
const getContextFromSubscription = ({ connection }) => {
    return {userId} = connection.context;
}
```

and



```javascript
const getContextFromHttpRequest = ({req}) => {
  const {userId} = request.session;
  return {userId}
}
```

