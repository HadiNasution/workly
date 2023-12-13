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
      "id": 1,
      "name": "hadi",
      "nip": "123344553322",
      "email": "hadi@mail.com"
    },
    {
      "id": 2,
      "name": "hadi",
      "nip": "123344553322",
      "email": "hadi@mail.com"
    },
    {
      "id": 3,
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

Query params : nip

Response body success :

```json
{
  "data": [
    {
      "id": 36,
      "name": "helmi",
      "nip": "183040433",
      "email": "miii@mail.com",
      "password": "$2b$10$vPlneC5ikR85z/Ofe9cNEOB/S535/gZgdVjLQgCHJyv.RVwla6b2m",
      "role": "senior dev",
      "departmen": "Dev",
      "picture": "me.jpg",
      "token": null,
      "token_expires_at": null,
      "join_date": "2023-12-13T01:35:49.258Z",
      "quit_date": null,
      "admin_id": 106,
      "attendance": [
        {
          "id": 6,
          "date": "2023-12-13T01:39:00.815Z",
          "time_in": "2023-12-13T01:39:00.815Z",
          "time_out": null,
          "is_late": false,
          "is_working": false,
          "is_wfh": false,
          "is_sick": true,
          "is_leaves": false,
          "is_permits": false,
          "notes": "demam",
          "longtitude_in": null,
          "latitude_in": null,
          "longtitude_out": null,
          "latitude_out": null,
          "created_at": "2023-12-13T01:39:01.357Z",
          "updated_at": "2023-12-13T01:39:01.357Z",
          "deleted_at": null,
          "employee_id": 36
        }
      ],
      "attendance_recap": [
        {
          "id": 3,
          "count_late": 2,
          "count_sick": 5,
          "count_permits": 0,
          "count_leaves": 3,
          "count_wfh": 2,
          "count_works": 2,
          "date": "2023-12-13T01:41:27.513Z",
          "notes": "",
          "employee_id": 36
        }
      ]
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

Query params : nip

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

Endpoint : GET /api/admin/recap/day

Header :

- Authorization : token

Response body success :

```json
{
  "data": [
    {
      "date": "2023-12-13T01:39:00.815Z",
      "time_in": "2023-12-13T01:39:00.815Z",
      "time_out": null,
      "is_late": false,
      "is_working": true,
      "is_wfh": false,
      "is_sick": false,
      "is_leaves": false,
      "is_permits": false,
      "employee_id": 35,
      "nip": "18304055",
      "name": "yusuf"
    },
    {
      "date": "2023-12-13T01:38:15.050Z",
      "time_in": "2023-12-13T01:38:15.050Z",
      "time_out": "2023-12-13T01:38:15.050Z",
      "is_late": true,
      "is_working": true,
      "is_wfh": true,
      "is_sick": false,
      "is_leaves": false,
      "is_permits": false,
      "employee_id": null,
      "nip": null,
      "name": null
    },
    {
      "date": "2023-12-13T01:38:15.050Z",
      "time_in": "2023-12-13T01:38:15.050Z",
      "time_out": null,
      "is_late": false,
      "is_working": true,
      "is_wfh": false,
      "is_sick": false,
      "is_leaves": false,
      "is_permits": false,
      "employee_id": null,
      "nip": null,
      "name": null
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

Query params : year, month

Header :

- Authorization : token

Response body success :

```json
{
  "data": [
    {
      "count_late": 2,
      "count_sick": 2,
      "count_permits": 0,
      "count_leaves": 3,
      "count_wfh": 2,
      "count_works": 2,
      "employee_id": 34,
      "nip": "183040066",
      "name": "hadi"
    },
    {
      "count_late": 2,
      "count_sick": 4,
      "count_permits": 0,
      "count_leaves": 3,
      "count_wfh": 2,
      "count_works": 2,
      "employee_id": 35,
      "nip": "18304055",
      "name": "yusuf"
    },
    {
      "count_late": 2,
      "count_sick": 5,
      "count_permits": 0,
      "count_leaves": 3,
      "count_wfh": 2,
      "count_works": 2,
      "employee_id": 36,
      "nip": "183040433",
      "name": "helmi"
    }
  ]
}
```

Response body error :

```json
{
  "errors": "Employee is not found"
}
```

## Search Employee

Endpoint : GET /api/admin/search

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
  "data": {
    "result": [
      {
        "id": 34,
        "name": "hadi",
        "nip": "183040066",
        "email": "hadi@mail.com",
        "role": "junior dev",
        "departmen": "it",
        "picture": null,
        "join_date": "2012-10-11T17:00:00.000Z",
        "quit_date": "2012-10-11T17:00:00.000Z"
      }
    ],
    "paging": {
      "page": 1,
      "total_item": 1,
      "total_page": 1
    }
  }
}
```

Response Body Error :

```json
{
  "errors": "Name not found"
}
```

## Get permission sakit, izin, cuti, wfh

Endpoint : GET /api/admin/permission/

Header :

- Authorization : token

Response body success :

```json
{
  "data": {
    "result": [
      {
        "type": "sakit",
        "date": "2023-12-13T06:50:38.377Z",
        "is_approved": false,
        "images": "surat-sakit.png",
        "start_date": "2023-12-13T06:50:38.377Z",
        "end_date": "2023-12-13T06:50:38.377Z",
        "name": "hadi",
        "nip": "183040066",
        "email": "hadi@mail.com",
        "role": "junior dev",
        "departmen": "it"
      },
      {
        "type": "wfh",
        "date": "2023-12-13T06:50:38.377Z",
        "is_approved": false,
        "images": null,
        "start_date": null,
        "end_date": null,
        "name": "yusuf",
        "nip": "18304055",
        "email": "ucup@mail.com",
        "role": "senior dev",
        "departmen": "Dev"
      }
    ],
    "status": {
      "total": 3,
      "approve": 3,
      "approved": 0
    }
  }
}
```

Response body error :

```json
{
  "errors": "Data kosong"
}
```

## Approve permission sakit, izin, cuti, wfh

Endpoint : PUT /api/admin/permission/

Header :

- Authorization : token

Query params : id (permission)

Response body success :

```json
{
  "data": "Approved"
}
```

Response body error :

```json
{
  "errors": "Gagal approve"
}
```

## Reject permission sakit, izin, cuti, wfh

Endpoint : PUT /api/admin/permission/reject

Header :

- Authorization : token

Query params : id (permission)

Response body success :

```json
{
  "data": "Rejected"
}
```

Response body error :

```json
{
  "errors": "Gagal reject"
}
```
