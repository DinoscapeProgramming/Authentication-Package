# Authentication Package
A package you can use to create a user system with authentications

## Documentation
### Setup
```js
const expressAuthentication = require('express-user-authentication');
```

### Create User
```js
expressAuthentication.createUser({
  username: "Dinoscape",
  password: "MyPassword",
  data: {
    type: "User"
  }
});
```

### Edit User
```js
expressAuthentication.editUser({
  username: "Dinoscape",
  password: "MyPassword",
  options: {
    username: "DinoRunner",
    password: "SecurePassword",
    data: {
      type: "Admin"
    }
  }
});
```

### Delete User
```js
expressAuthentication.deleteUser({
  username: "DinoRunner",
  password: "SecurePassword"
});
```

### Authentication
```js
app.on("/admin", expressAuthentication({
  data: {
    type: "Admin"
  }
}), (req, res) => {
  res.send("You are an admin!");
})
```