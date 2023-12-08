# Admin API Specs

## Login

Endpoint : POST /api/admin/login

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
    "isSuperAdmin": "false",
    "token": "unique-token",
    "token_expires_at": "Dec 07 2023 10:11:57 GMT+0700"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email is invalid"
}
```

## Regist

Endpoint : POST /api/admin/regist

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
    "email": "admin2@mail.com"
  }
}
```

Response body error :

```json
{
  "errors": "email is not valid"
}
```

## Logout

Endpoint : DELETE /api/admin/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "Logout Success"
}
```

Response Body Error :

```json
{
  "errors": "anauthorized"
}
```

## Get admin

Endpoint : GET /api/admin/:nip

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

## Create user

Endpoint : POST /api/admin/

Header :

- Authorization : token

Request body :

```json
{
  "name": "hadi",
  "nip": "123344553322",
  "role": "junior dev",
  "departmen": "it",
  "email": "hadi@mail.com",
  "password": "rahasia"
}
```

Response body success :

```json
{
  "data": {
    "name": "hadi",
    "nip": "123344553322",
    "role": "junior dev",
    "departmen": "it",
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

## Update admin

Endpoint : PUT /api/admin/:nip

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

## Delete admin

Endpoint : DELETE /api/admin/:nip

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

## Get user

Endpoint : GET /api/admin/:nip

Header :

- Authorization : token

Response body :

```json
{
  "data": {
    "name": "hadi",
    "nip": "123344553322",
    "role": "junior dev",
    "departmen": "it",
    "email": "hadi@mail.com"
  }
}
```

Response body error :

```json
{
  "errors": "email is not valid"
}
```

## Update user

Endpoint : PUT /api/admin/:nip

Header :

- Authorization : token

Request body :

```json
{
  "name": "hadi", //opt
  "role": "junior dev", //opt
  "departmen": "it", //opt
  "email": "hadi@mail.com", //opt
  "password": "rahasia" //opt
}
```

Response body success :

```json
{
  "data": {
    "name": "hadi",
    "role": "junior dev",
    "departmen": "it",
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

Endpoint : DELETE /api/admin/:nip

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

## Attendance Recap by Day

Endpoint : GET /api/admin/recapbyday/

Header :

- Authorization : token

Response body success :

```json
{
  "data": {
    "name": "hadi",
    "date": "13/12/2023",
    "time_in": "07:00",
    "time_out": "17:00",
    "isWorking": "true",
    "isLate": "false",
    "isWfh": "true",
    "isSick": "false",
    "isLeaves": "false",
    "isPermits": "false",
    "notes": ""
  }
}
```

Response body error :

```json
{
  "errors": "Employee is not found"
}
```

## Attendance Recap by Month

Endpoint : GET /api/admin/recapbymonth/

Header :

- Authorization : token

Response body success :

```json
{
  "data": {
    "name": "hadi",
    "date": "13/12/2023",
    "count_sick": "0",
    "count_permits": "1",
    "count_leaves": "1",
    "count_wfh": "2",
    "count_works": "24",
    "count_late": "2",
    "notes": "demam"
  }
}
```

Response body error :

```json
{
  "errors": "Employee is not found"
}
```

## Search Employee

Endpoint : GET /api/admin/

Headers :

- Authorization : token

Query Params :

- name : search by name, using like, optional
- email : search by email, using like, optional
- nip : search by nip, using like, optional
- page: number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "name": "hadi",
      "email": "hadi@mail.com",
      "nip": "1122233442211"
    },
    {
      "id": 2,
      "name": "ncip",
      "email": "ncip@mail.com",
      "nip": "1122233442211"
    }
  ],
  "Paging": {
    "page": 1,
    "total_page": 3,
    "total_items": 10
  }
}
```

Response Body Error :

```json
{
  "errors": "Name not found"
}
```

## Permission sakit, izin, cuti, wfh

Endpoint : GET /api/admin/permission/

Header :

- Authorization : token

Response body success :

```json
{
  "data": {
    "name": "hadi",
    "date": "13/12/2023",
    "isWfh": "true",
    "isSick": "false",
    "isLeaves": "false",
    "isPermits": "false"
  }
}
```

Response body error :

```json
{
  "errors": "Data is empty"
}
```
