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

## Regist admin by superadmin

Endpoint : POST /api/admin/regist

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

## Reset password

Enpoint : GET /api/admin/forgotpassword

Request body :

```json
{
  "name": "admin",
  "nip": "1111111",
  "email": "admin@gmail.com"
}
```

Response body success :

```json
{
  "data": "randomword" // temporary pass
}
```

Response body error :

```json
{
  "errors": "Email tidak terdaftar"
}
```

## Get admins and superadmins

Endpoint : GET /api/admin

Header :

- Authorization : token

Response body :

```json
{
  "data": [
    {
      "name": "hadi",
      "nip": "123344553322",
      "email": "hadi@mail.com",
      "is_super_admin": "false"
    },
    {
      "name": "hadi",
      "nip": "123344553322",
      "email": "hadi@mail.com",
      "is_super_admin": "false"
    },
    {
      "name": "hadi",
      "nip": "123344553322",
      "email": "hadi@mail.com",
      "is_super_admin": "false"
    }
  ]
}
```

Response body error :

```json
{ "errors": "admin is empty" }
```

## Create employee

Endpoint : POST /api/admin/create/employee

Header :

- Authorization : token

Request body :

```json
{
  "name": "hadi",
  "nip": "123344553322",
  "role": "junior dev", //opt
  "departmen": "it", //opt
  "email": "hadi@mail.com",
  "join_date": "10/12/12",
  "quit_date": "10/12/12" //opt
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
    "join_date": "10/12/12",
    "quit_date": "10/12/12"
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

Endpoint : PUT /api/admin/update/:nip

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
  "data": "Data updated"
}
```

Response body error :

```json
{
  "errors": "email is not valid"
}
```

## Delete admin

Endpoint : DELETE /api/admin/delete/:nip

Header :

- Authorization : token

Response body success :

```json
{
  "data": "Admin hadi berhasil dihapus"
}
```

Response body error :

```json
{
  "errors": "Admin tidak ditemukan"
}
```

## Get all employee

Endpoint : GET /api/admin/getemployee

Header :

- Authorization : token

Response body :

```json
{
  "data": [
    {
      "name": "hadi",
      "nip": "123344553322",
      "email": "hadi@mail.com"
    },
    {
      "name": "hadi",
      "nip": "123344553322",
      "email": "hadi@mail.com"
    },
    {
      "name": "hadi",
      "nip": "123344553322",
      "email": "hadi@mail.com"
    }
  ]
}
```

Response body error :

```json
{
  "errors": "data pegawai kosong"
}
```

## Get Employee details

Endpoint : GET /api/admin/employee/detail

Header :

- Authorization : token

Request params : nip

Response body success :

```json
{
  "data": {
    "name": "hadi",
    "nip": "123344553322",
    "email": "hadi@mail.com",
    "role": "junior dev",
    "department": "it",
    "picture": "hadi.jpg",
    "join_date": "10/12/2023",
    "quit_date": ""
  },
  "attendance": {
    "date": "13/12/2023",
    "count_sick": "0",
    "count_permits": "1",
    "count_leaves": "1",
    "count_wfh": "2",
    "count_works": "24",
    "count_late": "4",
    "notes": "demam"
  }
}
```

Response body error :

```json
{
  "errors": "Data kosong"
}
```

## Update employee

Endpoint : PUT /api/admin/update

Header :

- Authorization : token

Request body :

```json
{
  "nip": "183040066",
  "name": "hadi", //opt
  "email": "hadi@mail.com", //opt
  "role": "junior dev", //opt
  "departmen": "it", //opt
  "join_date": "10/12/12", //opt
  "quit_date": "10/12/12" //opt
}
```

Response body success :

```json
{
  "data": "Data NIP : 183040066 berhasil diupdate"
}
```

Response body error :

```json
{
  "errors": "email sudah digunakan"
}
```

## Delete employee

Endpoint : DELETE /api/admin/delete/employee/:employeeNip

Header :

- Authorization : token

Request params : nip

Response body success :

```json
{
  "data": "Hadi berhasil di hapus"
}
```

Response body error :

```json
{
  "errors": "Pegawai tidak ditemukan"
}
```

## Attendance Recap by Day

Endpoint : GET /api/admin/recap/day/

Header :

- Authorization : token

Response body success :

```json
{
  "data": [
    {
      "name": "hadi",
      "date": "13/12/2023",
      "time_in": "09:00",
      "time_out": "",
      "is_working": "true",
      "is_late": "true",
      "is_wfh": "true",
      "is_sick": "false",
      "is_leaves": "false",
      "is_permits": "false",
      "notes": ""
    },
    {
      "name": "hadi2",
      "date": "13/12/2023",
      "time_in": "08:00",
      "time_out": "",
      "is_working": "true",
      "is_late": "false",
      "is_wfh": "true",
      "is_sick": "false",
      "is_leaves": "false",
      "is_permits": "false",
      "notes": ""
    }
  ]
}
```

Response body error :

```json
{
  "errors": "Data kosong"
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
    "count_late": "4",
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
