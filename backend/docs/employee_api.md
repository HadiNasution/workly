# Employee API Specs

## Login

Endpoint : POST /api/employee/login

Request Body :

```json
{
  "email": "user@mail.com",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token",
    "token_expires_at": "Dec 07 2023 10:11:57 GMT+0700"
  }
}
```

## Logout

Endpoint : DELETE /api/employee/logout

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

Enpoint : GET /api/employee/resetpassword

Request body :

```json
{
  "name": "hadi",
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

## Absen Time in

Endpoint : POST /api/employee/absenIn

Headers :

- Authorization : token

Request params : latitude, longitude, isWfh

Response Body Success :

```json
{
  "data": "Absen masuk Berhasil"
}
```

Response Body Error :

```json
{
  "errors": "Absen masuk gagal"
}
```

## Absen Time out

Endpoint : PUT /api/employee/attendance/

Headers :

- Authorization : token

Request params : latitude, longitude

Response Body Success :

```json
{
  "data": "Absen keluar Berhasil"
}
```

Response Body Error :

```json
{
  "errors": "anauthorized"
}
```

## Profile details

Endpoint : GET /api/employee/profile

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "name": "yusuf",
      "nip": "18304055",
      "email": "ucup@mail.com",
      "role": "senior dev",
      "departmen": "Dev",
      "picture": "me.jpg",
      "join_date": "2023-12-13T01:35:49.258Z",
      "quit_date": null,
      "count_late": 2,
      "count_sick": 4,
      "count_permits": 0,
      "count_leaves": 3,
      "count_wfh": 3,
      "count_works": 2
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Update foto profile

Endpoint : POST /api/employee/upload

Headers :

- Authorization : token

Request Body :

```json
{
  "profilePhoto": "https://hehe.jpg"
}
```

Response Body Success :

```json
{
  "data": "uploadsprofilePhoto-1702621358788-292841658.png"
}
```

Response Body Error :

```json
{
  "errors": "Image format is not supported"
}
```

## Create permission cuti, izin, sakit

Endpoint : POST /api/employee/permission/

Headers :

- Authorization : token

Request Body :

```json
{
  "type": "sick",
  "note": "demam",
  "images": "surat-sakit.png",
  "start_date": "13/12/2023",
  "end_date": "18/12/2023"
}
```

Response Body Success :

```json
{
  "data": "Pengajuan berhasil dikirim"
}
```

Response Body Error :

```json
{
  "errors": "Image format is not supported"
}
```

## Get permission cuti, izin, sakit

Endpoint : GET /api/employee/permission/

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": [
    {
      "id": 4,
      "type": "sick",
      "note": "diare",
      "date": "2023-12-15T07:27:34.608Z",
      "is_approved": false,
      "images": "uploads\\surat-1702625254604-356498492.jpg",
      "start_date": "2023-12-13T06:50:38.377Z",
      "end_date": "2023-12-13T06:50:38.377Z",
      "admin_id": null
    },
    {
      "id": 5,
      "type": "sick",
      "note": "diare",
      "date": "2023-12-15T07:36:08.763Z",
      "is_approved": false,
      "images": "uploads\\surat-1702625768732-529603503.jpg",
      "start_date": "2023-12-13T06:50:38.377Z",
      "end_date": "2023-12-13T06:50:38.377Z",
      "admin_id": null
    },
    {
      "id": 2,
      "type": "wfh",
      "note": "hujan",
      "date": "2023-12-13T06:50:38.377Z",
      "is_approved": true,
      "images": null,
      "start_date": null,
      "end_date": null,
      "admin_id": 106
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Data kosong"
}
```

## Attendance Recap by Day

Endpoint : GET /api/employee/attendance/day

Header :

- Authorization : token

Response body success :

```json
{
  "data": {
    "time_in": "2023-12-15T01:27:09.927Z",
    "time_out": "2023-12-15T02:29:10.730Z",
    "is_late": true,
    "is_working": true,
    "is_wfh": false
  }
}
```

Response body error :

```json
{
  "errors": "Data kosong"
}
```

## Attendance Recap by Month

Endpoint : GET /api/employee/attendance/month

Header :

- Authorization : token

Response body success :

```json
{
  "data": [
    {
      "time_in": "2023-12-13T01:39:00.815Z",
      "time_out": "2023-12-15T01:50:04.878Z",
      "is_late": false,
      "is_working": true,
      "is_wfh": false
    },
    {
      "time_in": "2023-12-14T04:04:32.876Z",
      "time_out": null,
      "is_late": true,
      "is_working": true,
      "is_wfh": false
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
