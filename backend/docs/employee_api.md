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

Enpoint : GET /api/employee/forgotpassword

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

Endpoint : POST /api/employee/attendance/

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "hadi",
  "nip": "1223445533",
  "isWfh": "false",
  "longitude_in": "21.212",
  "latitude_in": "2223.11"
}
```

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

Request Body :

```json
{
  "name": "hadi",
  "nip": "1223445533",
  "date": "03/12/2023",
  "time_out": "07:00",
  "longitude_out": "21.212",
  "latitude_out": "2223.11"
}
```

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

Endpoint : GET /api/employee/profile/

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "name": "hadi",
    "nip": "1122334445",
    "role": "junior dev",
    "departmen": "it",
    "picture": "https://hehe.jpg",
    "email": "hadi@mail.com",
    "join_date": "01/01/2024",
    "quit_date": "null"
  }
}
```

Response Body Error :

```json
{
  "errors": "anauthorized"
}
```

## Update foto profile

Endpoint : POST /api/employee/profile/

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "hadi",
  "nip": "1122334445",
  "picture": "https://hehe.jpg"
}
```

Response Body Success :

```json
{
  "data": {
    "name": "hadi",
    "nip": "1122334445",
    "picture": "https://hehe2.jpg"
  }
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
  "date": "13/12/2023",
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

Query params : id (permission)

Response Body Success :

```json
{
  "type": "sick",
  "date": "13/12/2023",
  "is_approved": "false",
  "images": "surat-sakit.png",
  "start_date": "13/12/2023",
  "end_date": "18/12/2023"
}
```

Response Body Error :

```json
{
  "errors": "Data kosong"
}
```

## Attendance Recap by Day

Endpoint : GET /api/employee/recapbyday/

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

Endpoint : GET /api/employee/recapbymonth/

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
