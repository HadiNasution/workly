# Superadmin API Specs

## Login

Endpoint : POST /api/superadmin/login

Request Body :

```json
{
  "email": "admin@mail.com",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "isSuperAdmin": "true",
    "token": "unique-token"
  }
}
```

## Logout

Endpoint : DELETE /api/superadmin/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "anauthorized"
}
```

## Create admin

Endpoint : POST /api/superadmin/

Header :

- Authorization : token

Request body :

```json
{
  "name": "admin2",
  "nip": "123344553322",
  "email": "admin2@mail.com",
  "password": "rahasia"
}
```

Response body success :

```json
{
  "data": {
    "name": "admin2",
    "nip": "123344553322",
    "email": "admin2@mail.com",
    "password": "rahasia"
  }
}
```

Response body error :

```json
{
  "errors": "email is not valid"
}
```

## Get admin

Endpoint : GET /api/superadmin/:nip

Header :

- Authorization : token

Response body :

```json
{
  "data": {
    "name": "hadi",
    "nip": "123344553322",
    "email": "hadi@mail.com"
  }
}
```

Response body error :

```json
{ "errors": "email is not valid" }
```

## Update admin

Endpoint : PUT /api/superadmin/:nip

Header :

- Authorization : token

Request body :

```json
{
  "name": "hadi", //opt
  "email": "hadi@mail.com", //opt
  "password": "rahasia" //opt
}
```

Response body success :

```json
{
  "data": {
    "name": "hadi",
    "email": "hadi@mail.com",
    "password": "rahasia"
  }
}
```

Response body error :

```json
{
  "errors": "email is not valid"
}
```

## Delete user

Endpoint : DELETE /api/superadmin/:nip

Header :

- Authorization : token

Response body success :

```json
{
  "data": "Deleted"
}
```

Response body error :

```json
{
  "errors": "Employee is not found"
}
```
